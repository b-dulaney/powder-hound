import type {
	BackcountryDetail,
	BackcountryOverview,
	ResortDetail,
	ResortOverview
} from '$lib/supabase.types';
import { writable, type Writable } from 'svelte/store';
export const selectedMountain: Writable<
	ResortOverview | BackcountryOverview | ResortDetail | BackcountryDetail | null
> = writable();
