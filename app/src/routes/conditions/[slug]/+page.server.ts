import { supabase } from "$lib/supabaseClient.js"
import type { MountainDetail } from "$lib/supabase.types"
import { error } from "@sveltejs/kit"
export const prerender = false;

export async function load({params}) {
    const { data } = await supabase.from("mountain_detail").select().eq("slug", params.slug).returns<MountainDetail[]>().single()

    if(data){
        console.log(data)
        return {
            mountainDetails: data
        }
    }

    error(404, "Location not found");
}