import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { DailyForecastSchema } from '../_shared/zod-types.ts'
import type { Database } from "../database-generated.types.ts"
import type { DailyForecast, WeeklyForecast, DbResult } from "../database.types.ts"

const OPEN_WEATHER_API_KEY = Deno.env.get('OPEN_WEATHER_API_KEY')!
const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!
const API_URL = 'https://api.openweathermap.org/data/3.0/onecall'

const supabase = createClient<Database>(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? '',
)

interface MountainRow {
  mountain_id: number
  lat: number
  lon: number
}

interface ForecastData {
  dailyForecastData: DailyForecast[]
  weeklyForecastData: WeeklyForecast[]
}
/**
 * Fetches forecast data for a list of mountains.
 *
 * @param {MountainRow[]} mountains - An array of MountainRow objects, each containing the latitude and longitude of a mountain.
 * @returns {Promise<ForecastData>} A promise that resolves to an object containing the daily and weekly forecast data.
 * @throws Will throw an error if the fetch request fails.
 */
async function fetchForecastData(mountains: MountainRow[]): Promise<ForecastData> {
  const dailyForecastData: DailyForecast[] = [];
  const weeklyForecastData: WeeklyForecast[] = [];

  for(const mountain of mountains) {
    try {
      const response = await fetch(`${API_URL}?lat=${mountain.lat}&lon=${mountain.lon}&exclude=minutely,hourly&appid=${OPEN_WEATHER_API_KEY}&units=imperial`);
      const data = DailyForecastSchema.parse(await response.json());

      dailyForecastData.push({
        id: mountain.mountain_id,
        mountain_id: mountain.mountain_id,
        current_temp: data.current.temp,
        daily_high: data.daily[0].temp.max,
        daily_low: data.daily[0].temp.min,
        feels_like: data.current.feels_like,
        uv_index: data.current.uvi,
        wind_speed: data.current.wind_speed,
        snow_today: data.daily[0]?.snow ? (data.daily[0].snow / 25.4) : 0, // convert mm to inches
        snow_tomorrow: data.daily[1]?.snow ? (data.daily[1].snow / 25.4) : 0, 
        weather_desc: data.current.weather[0].description,
        weather_code: data.current.weather[0].id,
        updated_at: new Date().toISOString()
      });

      weeklyForecastData.push({
        mountain_id: mountain.mountain_id,
        date: new Date(data.daily[0].dt * 1000).toISOString(),
        daily_high: data.daily[0].temp.max,
        daily_low: data.daily[0].temp.min,
        uv_index: data.daily[0].uvi,
        snow: data.daily[0]?.snow ? (data.daily[0].snow / 25.4) : 0, // convert mm to inches
        wind_speed: data.daily[0].wind_speed,
        weather_desc: data.daily[0].weather[0].description,
        weather_code: data.daily[0].weather[0].id,
        updated_at: new Date().toISOString()
      });
    } catch(err) {
      console.error(err);
    }
  }
    return { dailyForecastData, weeklyForecastData };
}

/**
 * Updates the daily forecast table in supabase.
 *
 * @param {DailyForecast[]} dailyForecastData - An array of DailyForecast objects.
 * @returns {Promise<DbResult<DailyForecast>>} A promise that resolves to an object containing the updated data and any errors.
 */
async function updateDailyForecast(dailyForecastData: DailyForecast[]): Promise<DbResult<DailyForecast>> {
  const { data, error } = await supabase
    .from('daily_forecasts')
    .upsert(dailyForecastData)
    .select()

  if (error) {
    console.error(`Error updating daily forecast`, error);
  } else {
    console.log(`Daily forecast updated for ${data.length} mountains`);
  }

  return {data, error};
}

/**
 * Updates the weekly forecast table in supabase.
 *
 * @param {WeeklyForecast[]} weeklyForecastData - An array of WeeklyForecast objects.
 * @returns {Promise<DbResult<WeeklyForecast>>} A promise that resolves to an object containing the updated data and any errors.
 */
async function updateWeeklyForecasts(weeklyForecastData: WeeklyForecast[]): Promise<DbResult<WeeklyForecast>> {
  const { data, error } = await supabase
    .from('weekly_forecasts')
    .upsert(weeklyForecastData)
    .select();

  if (error) {
    console.error(`Error upserting weekly forecast: `, error);
  } else {
    console.log(`Weekly forecast upserted for ${data.length} mountains`);
  }

  return {data, error};
}

/**
 * Deno edge function request handler
 */
Deno.serve(async (req: Request) => {
  const authHeader = req.headers.get('Authorization')!
  if (authHeader !== `Bearer ${ANON_KEY}`) {
    return new Response(
      JSON.stringify({ message: 'Unauthorized' }),
      { status: 401, headers: { "Content-Type": "application/json" } },
    )
  }

  const mountains: MountainRow[] = await req.json()

  const { dailyForecastData, weeklyForecastData } = await fetchForecastData(mountains)
  const {data: dailyData, error: dailyError} = await updateDailyForecast(dailyForecastData)
  const {data: weeklyData, error: weeklyError} = await updateWeeklyForecasts(weeklyForecastData)

  if (dailyError || weeklyError) {
    return new Response(
      JSON.stringify({ message: 'Error updating forecasts' }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  } else {
    return new Response(
      JSON.stringify({ message: 'Updates completed', dailyData, weeklyData }),
      { headers: { "Content-Type": "application/json" } },
    )
  }
})
