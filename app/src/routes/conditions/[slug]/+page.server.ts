import { supabase } from "$lib/supabaseClient.js"
import type { MountainDetail } from "$lib/supabase.types"
import type { PageServerLoad } from './$types';
import { error } from "@sveltejs/kit"
export const prerender = false;

export const load: PageServerLoad = async ({params}) => {
    const { data } = await supabase.from("mountain_detail").select().eq("slug", params.slug).returns<MountainDetail[]>().single()

    if(data){
        return {
            mountainDetails: data
        }
    }

    error(404, "Location not found");
}