import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { DailyAggregateSchema } from '../_shared/zod-types.ts';
import type { Database } from "../database-generated.types.ts";
import type { DbResult, SnowAccumulation } from "../database.types.ts";

const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!
const OPEN_WEATHER_API_KEY = Deno.env.get('OPEN_WEATHER_API_KEY')!
const API_URL = 'https://api.openweathermap.org/data/3.0/onecall/day_summary'

interface MountainRow {
  mountain_id: number
  lat: number
  lon: number
}

const supabase = createClient<Database>(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? '',
)

/**
 * Fetches snow accumulation data for a list of mountains.
 *
 * @param {Mountain[]} mountains - An array of Mountain objects, each containing the latitude and longitude of a mountain.
 * @returns {Promise<SnowAccumulation[]>} A promise that resolves to an array of SnowAccumulation objects. Each object contains the mountain_id, date, and total snow accumulation.
 * @throws Will throw an error if the fetch request fails.
 */
async function fetchSnowAccumulation(mountains: MountainRow[]): Promise<SnowAccumulation[]> {
  const accumulationData: SnowAccumulation[] = [];
  const yesterday = getYesterday();

  for(const mountain of mountains) {
    try {
     const response = await fetch(`${API_URL}?lat=${mountain.lat}&lon=${mountain.lon}&date=${yesterday}&appid=${OPEN_WEATHER_API_KEY}&units=imperial`)
     const data = DailyAggregateSchema.parse(await response.json());
     const totalSnowAccumulation = data?.precipitation?.total
      accumulationData.push({
        mountain_id: mountain.mountain_id,
        date: yesterday,
        precip_total: totalSnowAccumulation ? (totalSnowAccumulation / 25.4) : 0, // convert mm to inches
        created_at: new Date().toISOString()
      })
    }
    catch(err) {
      console.error(err);
    }
  }

  return accumulationData;
}

/**
 * Updates the snow accumulation table in supabase.
 *
 * @param {SnowAccumulation[]} accumulationData - An array of SnowAccumulation objects.
 * @returns {Promise<DbResult<SnowAccumulation>>} A promise that resolves to an object containing the updated data and any errors.
 */
async function updateSnowAccumulation(accumulationData: SnowAccumulation[]): Promise<DbResult<SnowAccumulation>> {
  const { data, error } = await supabase
    .from('snow_accumulation')
    .insert(accumulationData)
    .select();

  if (error) {
    console.error(`Error updating snow accumulation`, error);
  } else {
    console.log(`Snow accumulation updated for ${data?.length} mountains`);
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
  
    const rows: MountainRow[] = await req.json()
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