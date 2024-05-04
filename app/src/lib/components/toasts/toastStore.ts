import { writable } from 'svelte/store';
import type { ToastSettings, Toast } from './types';

export const toastStore = writable<Toast[]>([]);

export function addToast(settings: ToastSettings) {
	const newToast: Toast = { id: Date.now(), ...settings };
	toastStore.update((t) => [...t, newToast]);
}
