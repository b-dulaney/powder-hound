import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import type { Database } from "../database-generated.types";
import type { Mountain, SnowAccumulation } from "../database.types";

const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!
const OPEN_WEATHER_API_KEY = Deno.env.get('OPEN_WEATHER_API_KEY')!

const supabase = createClient<Database>(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? '',
)

/**
 * Fetches snow accumulation data for a list of mountains.
 *
 * @param {Mountain[]} rows - An array of Mountain objects, each containing the latitude and longitude of a mountain.
 * @returns {Promise<SnowAccumulation[]>} A promise that resolves to an array of SnowAccumulation objects. Each object contains the mountain_id, date, and total snow accumulation.
 * @throws Will throw an error if the fetch request fails.
 */
async function fetchSnowAccumulation(rows: Mountain[]): Promise<SnowAccumulation[]> {
  const accumulationData: SnowAccumulation[] = [];
  const yesterday = getYesterday();

  for(const row of rows) {
    try {
     const response = await fetch(`https://api.openweathermap.org/data/3.0/onecall/day_summary?lat=${row.lat}&lon=${row.lon}&date=${yesterday}&appid=${OPEN_WEATHER_API_KEY}&units=imperial`)
     const data = await response.json();
     const totalSnowAccumulation = data?.precipitation?.total
      accumulationData.push({
        mountain_id: row.mountain_id,
        date: yesterday,
        precip_total: totalSnowAccumulation ?? 0,
      })
    }
    catch(err) {
      console.error(err);
    }
  }

  return accumulationData;
}

/**
 * Updates snow accumulation data for a list of mountains.
 *
 * @param {SnowAccumulation[]} accumulationData - An array of SnowAccumulation objects, each containing the mountain_id, date, and total snow accumulation.
 * @param {any} supabase - A Supabase client object.
 * @returns {Promise<{data: SnowAccumulation[], error: any}>} A promise that resolves to an object containing the data and error properties.
 */
async function updateSnowAccumulation(accumulationData: SnowAccumulation[]) {
  const { data, error } = await supabase
    .from('snow_accumulation')
    .insert(accumulationData)
    .select();

  if (error) {
    console.error(`Error updating snow accumulation`, error);
  } else {
    console.log(`Snow accumulation updated`);
  }

  return {data, error};
}

/**
 * Gets the date for yesterday in the format YYYY-MM-DD.
 *
 * @returns {string} A string containing the date for yesterday in the format YYYY-MM-DD.
 */
function getYesterday() {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}


Deno.serve(async (req: Request) => {
    const authHeader = req.headers.get('Authorization')!
    if (authHeader !== `Bearer ${ANON_KEY}`) {
      return new Response(
        JSON.stringify({ message: 'Unauthorized' }),
        { status: 401, headers: { "Content-Type": "application/json" } },
      )
    }
  
    const rows: Mountain[] = await req.json()
    const snowAccumulationData = await fetchSnowAccumulation(rows)
    const { data, error } = await  updateSnowAccumulation(snowAccumulationData)

    if (error) {
      console.error(`Error updating snow accumulation`, error);
      return new Response(
        JSON.stringify({ message: 'Error updating snow accumulation' }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      )
    }
    else {
      return new Response(
        JSON.stringify({ message: 'Updates completed', data }),
        { headers: { "Content-Type": "application/json" } },
      )
    }    
  })