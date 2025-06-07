import type { Params } from "./types/index.js";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const makeName = function (str: string) {
	str = str + '';
	const index = str.indexOf('_');
	if (index < 0) {
		return str === 'id' ? str.toUpperCase() : str.charAt(0).toUpperCase() + str.substring(1);
	}
	const names = str.split('_');
	let new_name = '';

	names.forEach(function (s) {
		new_name += new_name.length > 0 ? ' ' + makeName(s) : makeName(s);
	});

	return new_name;
};

export const toQueryString = (params?: Params): string => {
	if (!params) return '';

	const flat: Params = {};
	const json: Array<string> = [];

	for (const [k, v] of Object.entries(params)) {
		if (typeof v === 'object') {
			json.push(`${k}=${encodeURIComponent(JSON.stringify(v))}`);
		} else {
			flat[k] = v;
		}
	}

	const qs = new URLSearchParams(flat).toString();
	if (json.length < 1) {
		return qs;
	}

	return qs ? `${qs}&${json.join('&')}` : json.join('&');
};

export const debounce = <T extends unknown[]>(callback: (...args: T) => void, delay: number) => {
	let timeoutTimer: ReturnType<typeof setTimeout>;

	return (...args: T) => {
		clearTimeout(timeoutTimer);

		timeoutTimer = setTimeout(() => {
			callback(...args);
		}, delay);
	};
};


export const beforeSend = (header: Params) => {
	header['x-api-key'] = 'reqres-free-v1';
}