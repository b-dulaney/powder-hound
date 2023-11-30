import { supabase } from "$lib/supabaseClient";

type MountainAndSnowfall = {
  name: string;
  snowfall24Hours: number;
  snowfall72Hours: number;
}

export async function load() {
    const mountainsAndSnowfall: MountainAndSnowfall[] = []
    const {data: mountains, error: mountainsError} = await supabase.from("mountains").select();
    
    if (mountainsError) console.log("error", mountainsError);

    else if (mountains.length > 0) {
        mountains.sort((a, b) => b.display_name < a.display_name ? 1 : -1)
        for(const mountain of mountains){
            const { data: snowfall72Hours, error: errorSnowfall72Hours } = await supabase.rpc("get_72_hour_snowfall_for_mountain", { id: mountain.mountain_id });
            const { data: snowfall24Hours, error: errorSnowfall24Hours } = await supabase.rpc("get_past_24_hour_snowfall_for_mountain", { id: mountain.mountain_id });

            if (errorSnowfall24Hours || errorSnowfall72Hours) throw new Error("error getting snowfall data");

            mountainsAndSnowfall.push({
                name: mountain.display_name,
                snowfall72Hours: snowfall72Hours,
                snowfall24Hours: snowfall24Hours
            })

            
        }
    
      return {
        mountainsAndSnowfall
      }
    }

}