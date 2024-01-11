import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.5";
import { Database } from "../database-generated.types.ts";
import { CaicData, DbResult } from "../database.types.ts";

interface MountainRow {
  mountain_id: number;
  caic_code: string;
}

const API_URL =
  "https://looper.avalanche.state.co.us/weather/ptfcst/wrfhr/current";
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient<Database>(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
);

function parseForecastData(data: string, mountainID: number): CaicData[] {
  const parsedForecastData: CaicData[] = [];
  const lines = data.split("\n");
  lines.splice(0, 7);

  for (const line of lines) {
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

    // Parse the 'date' string into a Date object
    const dateObj = new Date(date);

    // Determine the start and end of daylight saving time for the year of the date
    const startDst = new Date(`03/14/${dateObj.getFullYear()} 02:00`);
    const endDst = new Date(`11/07/${dateObj.getFullYear()} 02:00`);

    // Adjust the start and end dates based on the day of the week
    startDst.setDate(14 - startDst.getDay());
    endDst.setDate(7 - endDst.getDay());

    // Determine whether the date falls within the daylight saving time period
    const timezone = (dateObj >= startDst && dateObj < endDst) ? "MDT" : "MST";

    // Parse the 'date' and 'time' strings into a Date object with the correct timezone
    const datetimeInMountainTime = new Date(`${date} ${time} ${timezone}`);
    // Convert the Date object to UTC
    const datetimeInUTC = new Date(
      datetimeInMountainTime.getTime() +
        datetimeInMountainTime.getTimezoneOffset() * 60000,
    );

    // Format the UTC Date object into a string
    const utcDatetimeString = datetimeInUTC.toISOString();

    // Create an object with the parsed values
    const parsedPointForecast: CaicData = {
      mountain_id: mountainID,
      datetime: utcDatetimeString,
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
    .upsert(forecastData, { onConflict: "mountain_id, datetime" })
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
  if (authHeader !== `Bearer ${SERVICE_KEY}`) {
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
