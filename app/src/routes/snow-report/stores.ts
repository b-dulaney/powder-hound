import type { BackcountryDetail, BackcountryOverview, ResortDetail, ResortOverview } from '$lib/supabase.types';
import { writable, type Writable } from 'svelte/store';
export const resortSearchInput = writable('');
export const backcountrySearchInput = writable('');
export const resortColumnSort = writable({ name: 'location', asc: true });
export const backcountryColumnSort = writable({ name: 'location', asc: true });
export const selectedMountain: Writable<ResortOverview | BackcountryOverview | ResortDetail | BackcountryDetail | null> = writable();
