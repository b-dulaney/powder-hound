import type { MountainOverview } from "$lib/supabase.types";
import { supabase } from "$lib/supabaseClient";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    const {data, error} = await supabase.from("mountain_overview").select().returns<MountainOverview[]>();
    if(error) {
      return {
        status: 500,
        error: error.message,
      }
    }
    else {
      return {
        mountainOverviews: data.sort((a, b) => a.display_name > b.display_name ? 1 : -1)
      }
    }
  }
