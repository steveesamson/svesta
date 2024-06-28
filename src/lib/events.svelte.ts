/* eslint-disable @typescript-eslint/no-explicit-any */
import type { UseEvent } from './types/index.js';
// import { writable, get as g } from 'svelte/store';

const eventMap = new Map();

export const useEvents = <T = any>(type: string):UseEvent<T> => {

	if (!eventMap.has(type)) {
		const event = $state<UseEvent<T>>({ type, data: undefined, error: undefined });
		eventMap.set(type, event);
	}
	
	return eventMap.get(type);
};
