/* eslint-disable @typescript-eslint/no-explicit-any */
import type { UseEvent, UseEventProps } from './types/index.js';

const eventMap = new Map();

export const useEvents = <T = any>(type: string, defaultValue?: T): UseEvent<T> => {
	if (eventMap.has(type)) {
		return eventMap.get(type);
	}

	let events = $state<UseEventProps<T>>({ type, data: defaultValue, error: undefined });
	const exported = {
		is(value: T): boolean {
			const { data } = events;
			return data === value;
		},
		get value(): T {
			return events.data as T;
		},
		set value(data: T) {
			events = { type, data };
		},
		get error(): string {
			return events.error as string;
		},
		set error(err: string) {
			events = { type, error: err };
		},
		clear() {
			events = { type };
		},
	};

	eventMap.set(type, exported);
	return exported;
};
