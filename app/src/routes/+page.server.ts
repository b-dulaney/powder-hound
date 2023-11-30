import { supabase } from "$lib/supabaseClient";

export async function load() {
    const {data, error} = await supabase.from("mountain_overview").select()
    
    if(error) {
      return {
        data: {message: error.message},
      }
    }
    else if(data) {
      return {
        mountainOverviews: data
      }
    }
  }
