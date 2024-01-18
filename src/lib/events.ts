/* eslint-disable @typescript-eslint/no-explicit-any */
import type { UseEvent } from './types/index.js';
import { writable, get as g } from 'svelte/store';

const eventMap = new Map();

export const useEvents = <T = any>(type: string) => {

	if (eventMap.has(type)) {
		return eventMap.get(type);
	}

	const events = writable<UseEvent<T>>({ type, data: undefined, error: undefined });
	const exported = {
		is(value: unknown) {
			const { data } = g(events);
			return data === value;
		},
		value() {
			return { ...g(events) };
		},
		setTo(data: T) {
			events.set({ type, data });
		},
		clear() {
			events.set({ type });
		},
		error(err: string) {
			events.set({ type, error: err });
		},
		subscribe(fn: (_event: UseEvent<T>) => void) {
			return events.subscribe((_events) => {
				if (_events) {
					fn(_events);
				}
			});
		}
	};

	eventMap.set(type, exported);
	return exported;
};
