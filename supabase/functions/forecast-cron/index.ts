import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import type { Tables } from "../database.types"
import type { Database } from "../database-generated.types"

const OPEN_WEATHER_API_KEY = Deno.env.get('OPEN_WEATHER_API_KEY')!
const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!

const supabase = createClient<Database>(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? '',
)

async function fetchWeatherData(row: Partial<Tables<'mountains'>>): Promise<Response> {
  return fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${row.lat}&lon=${row.lon}&exclude=minutely,hourly&appid=${OPEN_WEATHER_API_KEY}&units=imperial`);
}

async function updateDailyForecast(mountainID: number, current: any, daily: any) {
  const { data, error } = await supabase
    .from('daily_forecasts')
    .update({
      current_temp: current.temp,
      daily_high: daily[0].temp.max,
      daily_low: daily[0].temp.min,
      feels_like: current.feels_like,
      uv_index: current.uvi,
      wind_speed: current.wind_speed,
      snow_today: daily[0]?.snow ? (daily[0].snow / 25.4) : 0, // convert mm to inches
      snow_tomorrow: daily[1]?.snow ? (daily[1].snow / 25.4) : 0, 
      weather_desc: current.weather[0].description,
      weather_code: current.weather[0].id,
      updated_at: new Date().toISOString()
    })
    .eq('mountain_id', mountainID)
    .select()
    .single();

  if (error) {
    console.error(`Error updating daily forecast for mountain: ${mountainID}`, error);
  } else {
    console.log(`Daily forecast updated for mountain: ${data.mountain_id}`);
  }
}

async function upsertWeeklyForecast(mountainID: number, daily: any) {
  const weeklyForecasts = daily.map((day: any) => ({
    mountain_id: mountainID,
    date: new Date(day.dt * 1000).toISOString(),
    daily_high: day.temp.max,
    daily_low: day.temp.min,
    uv_index: day.uvi,
    snow: day?.snow ? (day.snow / 25.4) : 0, // convert mm to inches
    wind_speed: day.wind_speed,
    weather_desc: day.weather[0].description,
    weather_code: day.weather[0].id,
    updated_at: new Date().toISOString()
  }));

  const { error } = await supabase
    .from('weekly_forecasts')
    .upsert(weeklyForecasts);

  if (error) {
    console.error(`Error upserting weekly forecast for mountain: ${mountainID}`, error);
  } else {
    console.log(`Weekly forecast upserted for mountain: ${mountainID}`);
  }
}

Deno.serve(async (req: Request) => {
  const authHeader = req.headers.get('Authorization')!
  if (authHeader !== `Bearer ${ANON_KEY}`) {
    return new Response(
      JSON.stringify({ message: 'Unauthorized' }),
      { status: 401, headers: { "Content-Type": "application/json" } },
    )
  }

  const requestBody: Partial<Tables<'mountains'>>[] = await req.json()
  const promises: Promise<Response>[] = []
  requestBody.forEach((row) => {
    promises.push(
      fetchWeatherData(row)
    )
  })

  const responses = await Promise.allSettled(promises)
  for (const response of responses) {
    if (response.status === 'fulfilled') {
      const { lat, lon, current, daily } = await response.value.json()
      const mountainID = requestBody.find((row: Partial<Tables<'mountains'>>) => row.lat === lat && row.lon === lon)?.mountain_id
      
      await updateDailyForecast(mountainID!, current, daily);
      await upsertWeeklyForecast(mountainID!, daily);
    }
  }
  
  return new Response(
    JSON.stringify({ message: 'Updates completed' }),
    { headers: { "Content-Type": "application/json" } },
  )
})

