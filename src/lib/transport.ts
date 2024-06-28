/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEvents } from './events.svelte.js';
import { networkStatus } from './network-status.js';
import { useRealtime } from './realtime.js';
import type { HTTPMethod, Params, TransportResponse, TransportConfig } from './types/index.js';
import type { Comet, StoreListener, InternalTransportType } from './types/internal.js';


const loading = useEvents<boolean>('loading');
let config: TransportConfig = {
	BASE_URL: '',
	DEBUG: false,
	realTime: false,
	fetch: typeof (window) === 'undefined' ? undefined : window.fetch,
	init: {
		method: 'GET',
		mode: 'cors',
		credentials: 'same-origin',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8'
		}
	}
}
let socket: any = null;

const withFetch = async (
	url: string,
	method: HTTPMethod,
	params: Params | undefined = undefined,
): Promise<TransportResponse> => {
	if (!networkStatus.isOnline) {
		return Promise.resolve({ error: 'You seem to be offline :)', status: 500 });
	}
	const { BASE_URL, init } = config;
	let { fetch: _fetch } = config;
	if (!BASE_URL) {
		console.warn('You did not set the BASE_URL on Transport before invoking methods. I hope this is deliberate and you are passing url as FQDN plus paths.');
	}
	if (!_fetch && typeof window !== 'undefined') {
		_fetch = window.fetch;
	}
	if (!_fetch) {
		return Promise.resolve({ error: 'You seem to be invoking methods on Transport from server; pass down fetch from your view +page.[t/j]s :)', status: 500 });
	}
	const hasBody = ['post', 'put'].includes(method.toLowerCase());

	if (!hasBody) {
		url = params ? [url, new URLSearchParams(params).toString()].join("?") : url;
	}

	const remote = `${BASE_URL}${url}`;
	const body = hasBody ? JSON.stringify(params || {}) : undefined;
	loading.data = true;

	try {

		const reqInit = {
			...init,
			method,
			body
		}
		const resp = await _fetch(remote, reqInit);
		const status = resp.status;
		if (!resp.ok) {
			const error = await resp.text();
			console.log("Error: ", error);
			return { error, status };
		}

		const result = await resp.json();
		return { ...result, status };

	} catch (e: any) {
		const error = e.toString();
		console.log("Fetch error: ", error);
		return { error: "Fetch error", status: 500 };
	}

};


const Transport: InternalTransportType = {
	isOnline: false,
	cometListeners: {},
	config,
	configure(_config: Partial<TransportConfig>) {
		config = {
			...config,
			..._config
		}
	},
	fetch: withFetch,
	sync: withFetch,

	destroy() {
		Transport.sync = withFetch;
		socket = null;
	},
	async switchToRealTime() {
		const { realTime } = config;
		if (realTime && !socket) {
			socket = useRealtime(Transport);
		}
	},
	onCometsNotify(listener: StoreListener) {
		const storeListeners: StoreListener[] = Transport.cometListeners[listener.store] || [];
		if (storeListeners.find((l: StoreListener) => l.listenerID === listener.listenerID)) return;

		storeListeners.push(listener);
		Transport.cometListeners[listener.store] = storeListeners;
	},
	stopCometsOn(listener: StoreListener) {
		const storeListeners: StoreListener[] = Transport.cometListeners[listener.store] || [];
		if (!storeListeners.length) return;
		const others = storeListeners.filter(
			(l: StoreListener) => l.listenerID !== listener.listenerID
		);
		Transport.cometListeners[listener.store] = others;
	},
	onComets(comets: Comet) {
		const { DEBUG } = config;
		if (DEBUG) {
			console.log("IO: ", 'oncomets: ', comets.room, comets.verb, comets.data);
		}
		const listeners = Transport.cometListeners[comets.room] || [];
		if (!listeners.length) return;
		listeners.forEach((listener: StoreListener) => listener.onComets(comets));
	},
	async upload(url: string, body: Params) {
		return await Transport.fetch(url, 'POST', body);
	},
	async post(postUrl: string, param: Params) {
		return await Transport.fetch(postUrl, 'post', param);
	},
	async get(getUrl: string, param?: Params) {
		return await Transport.fetch(getUrl, 'get', param);
	},
	async patch(patchUrl: string, param?: Params) {
		return await Transport.fetch(patchUrl, 'patch', param);
	},
	async put(patchUrl: string, param?: Params) {
		return await Transport.fetch(patchUrl, 'put', param);
	},
	async options(optionsUrl: string, param?: Params) {
		return await Transport.fetch(optionsUrl, 'options', param);
	},
	async delete(deleteUrl: string, param?: Params) {
		return await Transport.fetch(deleteUrl, 'delete', param);
	}
};


export { Transport };
