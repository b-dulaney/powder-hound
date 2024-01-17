import { writable } from 'svelte/store';
export const resortSearchInput = writable('');
export const backcountrySearchInput = writable('');
export const resortColumnSort = writable({ name: 'location', asc: true });
export const backcountryColumnSort = writable({ name: 'location', asc: true });
