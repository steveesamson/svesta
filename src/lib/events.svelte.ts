/* eslint-disable @typescript-eslint/no-explicit-any */
import type { UseEvent } from './types/index.js';

const eventMap = new Map();

export const useEvents = <T = any>(type: string):UseEvent<T> => {

	if (!eventMap.has(type)) {
		const event = $state<UseEvent<T>>({ type, data: undefined, error: undefined });
		eventMap.set(type, event);
	}
	
	return eventMap.get(type);
};
