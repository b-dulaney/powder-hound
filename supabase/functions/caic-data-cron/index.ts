import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.5";
import { Database } from "../database-generated.types.ts";
import { CaicData, DbResult } from "../database.types.ts";

interface MountainRow {
  mountain_id: number;
  caic_code: string;
}

const API_URL =
  "https://looper.avalanche.state.co.us/weather/ptfcst/wrfhr/current";
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

const supabase = createClient<Database>(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_ANON_KEY") ?? "",
);

function parseForecastData(data: string, mountainID: number): CaicData[] {
  const parsedForecastData: CaicData[] = [];
  const lines = data.split("\n");

  let isDataParsingStarted = false;

  for (const line of lines) {
    if (line.includes("DATE")) {
      isDataParsingStarted = true;
      continue;
    }

    if (isDataParsingStarted) {
      const values = line.trim().split(/\s+/);
      // Check if it's the last line with summary information
      if (values.length === 1) {
        break;
      }

      const [
        date,
        time,
        temp,
        dewPoint,
        relativeHumidity,
        wind_degree_speed,
        wind_gust,
        cei,
        visibility,
        weather_desc,
        ncpcp,
        cnpcp,
        snowfall_in,
        wetbulb_temp,
      ] = values;

      // Create an object with the parsed values
      const parsedPointForecast: CaicData = {
        mountain_id: mountainID,
        datetime: `${date} ${time}`,
        temp: +temp,
        dew_point: +dewPoint,
        relative_humidity: +relativeHumidity,
        wind_deg_speed: wind_degree_speed,
        wind_gust: +wind_gust,
        cei: +cei,
        visbility_miles: +visibility,
        weather_desc,
        ncpcp_in: +ncpcp,
        cnpcp_in: +cnpcp,
        snowfall_in: +snowfall_in,
        wetbulb_temp: +wetbulb_temp,
        created_at: new Date().toISOString(),
      };

      // Push the object to the array
      parsedForecastData.push(parsedPointForecast);
    }
  }

  // Remove the first 2 header rows from the parsed data
  parsedForecastData.splice(0, 2);
  return parsedForecastData;
}

/**
 * Fetches the CAIC forecast for all mountains. The point forecast data only includes weather data, not avalanche data.
 *
 * @param {MountainRow[]} mountains - An array of Mountain objects, each containing the latitude, longitude, and CAIC designation of a mountain.
 * @returns {Promise<CaicData[]>} A promise that resolves to an array of CaicData objects. Each object contains all CAIC datapoints for the given hour and mountain.
 * @throws Will throw an error if the fetch request fails.
 */
async function fetchPointForecasts(
  mountains: MountainRow[],
): Promise<CaicData[]> {
  const pointForecastData: CaicData[] = [];

  for (const mountain of mountains) {
    try {
      const response = await fetch(`${API_URL}/${mountain.caic_code}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch data. Status: ${response.status}`);
      }
      const data = await response.text();
      const forecastData = parseForecastData(data, mountain.mountain_id);
      pointForecastData.push(...forecastData);
    } catch (err) {
      console.error(err);
    }
  }

  return pointForecastData;
}

/**
 * Updates the caic_data table in supabase.
 *
 * @param {CaicData[]} forecastData - An array of objects representing the full CAIC forecast for all mountains.
 * @returns {Promise<DbResult<CaicData>>} A promise that resolves to an object containing the updated data and any errors.
 */
async function updatePointForecastData(
  forecastData: CaicData[],
): Promise<DbResult<CaicData>> {
  const { data, error } = await supabase
    .from("caic_data")
    .upsert(forecastData, { ignoreDuplicates: false })
    .select();

  if (error) {
    console.error(`Error updating CAIC forecast`, error);
  } else {
    console.log(`CAIC forecast updated for ${data?.length} rows`);
  }

  return { data, error };
}

/** Deno request handler */
Deno.serve(async (req) => {
  const authHeader = req.headers.get("Authorization")!;
  if (authHeader !== `Bearer ${ANON_KEY}`) {
    return new Response(
      JSON.stringify({ message: "Unauthorized" }),
      { status: 401, headers: { "Content-Type": "application/json" } },
    );
  }

  const rows: MountainRow[] = await req.json();
  const pointForecastData = await fetchPointForecasts(rows);
  const { data, error } = await updatePointForecastData(pointForecastData);

  if (error) {
    console.error(`Error updating CAIC forecast`, error);
    return new Response(
      JSON.stringify({ message: "Error updating CAIC forecast" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  } else {
    return new Response(
      JSON.stringify({ message: "Updates completed", data }),
      { headers: { "Content-Type": "application/json" } },
    );
  }
});
