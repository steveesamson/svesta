/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEvents } from './events.svelte.js';
import { network } from './network.svelte.js';
import { useRealtime } from './realtime.js';
import type {
	HTTPMethod,
	Params,
	TransportResponse,
	TransportConfig,
	TransportFactory,
	UseEvent,
	TransportInstanceProps
} from './types/index.js';
import type { Comet, StoreListener, InternalTransportType } from './types/internal.js';

const transportsMap: Params<InternalTransportType> = {};

const withFetch =
	(transport: InternalTransportType) =>
	async <K = Params>(
		url: string,
		method: HTTPMethod,
		params: Params | undefined = undefined
	): Promise<TransportResponse<K>> => {
		if (!network.status.online) {
			network.qeueuRefresh();
			return Promise.resolve({ error: 'You seem to be offline :)', status: 404 });
		}
		const { BASE_URL, init } = transport.config;
		let { fetch: _fetch } = transport.config;
		if (!BASE_URL) {
			console.warn(
				'You did not set the BASE_URL on Transport before invoking methods; this might break your requests. I hope this is deliberate and you are passing url as FQDN plus paths.'
			);
		}
		if (!_fetch && typeof window !== 'undefined') {
			_fetch = window.fetch;
		}
		if (!_fetch) {
			return Promise.resolve({
				error:
					'You seem to be invoking methods on Transport from server; pass down fetch from your view +page.[t/j]s :)',
				status: 500
			});
		}
		const hasBody = ['post', 'put'].includes(method.toLowerCase());

		if (!hasBody) {
			url = params ? [url, new URLSearchParams(params).toString()].join('?') : url;
		}

		const remote = `${BASE_URL}${url}`;
		const body = hasBody ? JSON.stringify(params || {}) : undefined;
		transport.loading.value = true;

		try {
			const reqInit = {
				...init,
				method,
				body
			};
			const resp = await _fetch(remote, reqInit);
			const status = resp.status;
			if (!resp.ok) {
				// const error = await resp.text();
				const error = `${url} - ${resp.statusText}`;
				console.log('Error: ', error);
				return { error, status };
			}

			const result = (await resp.json()) as K;
			return { ...result, status };
		} catch (e: any) {
			const error = e.toString();
			console.log('Fetch error: ', error);
			return { error: 'Fetch error', status: 500 };
		}
	};

class TransportImpl implements InternalTransportType {
	loading: UseEvent<boolean> = useEvents<boolean>('loading', false);
	cometListeners: Params = {};

	config: TransportConfig = {
		BASE_URL: '',
		DEBUG: false,
		// realTime: false,
		fetch: typeof window === 'undefined' ? undefined : window.fetch,
		init: {
			method: 'GET',
			mode: 'cors',
			credentials: 'same-origin',
			headers: {
				'Content-Type': 'application/json; charset=UTF-8'
			}
		}
	};

	socket: any = null;

	constructor(config: TransportConfig) {
		this.config = { ...this.config, ...config };
	}

	async fetch<K>(
		url: string,
		method: HTTPMethod,
		params: Params | undefined = undefined
	): Promise<TransportResponse<K>> {
		return withFetch(this)<K>(url, method, params);
	}

	async sync(
		url: string,
		method: HTTPMethod,
		params: Params | undefined = undefined
	): Promise<TransportResponse> {
		return withFetch(this)<Params>(url, method, params);
	}

	destroy() {
		this.sync = withFetch(this);
		this.socket = null;
	}

	async switchToRealTime() {
		const { realTime } = this.config;
		if (realTime && !this.socket) {
			this.socket = await useRealtime(this);
		}
	}

	onCometsNotify(listener: StoreListener): void {
		const storeListeners: StoreListener[] = this.cometListeners[listener.store] || [];
		if (storeListeners.find((l: StoreListener) => l.listenerID === listener.listenerID)) return;

		storeListeners.push(listener);
		this.cometListeners[listener.store] = storeListeners;
	}

	stopCometsOn(listener: StoreListener) {
		const storeListeners: StoreListener[] = this.cometListeners[listener.store] || [];
		if (!storeListeners.length) return;
		const others = storeListeners.filter(
			(l: StoreListener) => l.listenerID !== listener.listenerID
		);
		this.cometListeners[listener.store] = others;
	}

	onComets(comets: Comet) {
		const { DEBUG } = this.config;
		if (DEBUG) {
			console.log('IO: ', 'oncomets: ', comets.room, comets.verb, comets.data);
		}
		const listeners = this.cometListeners[comets.room] || [];
		if (!listeners.length) return;
		listeners.forEach((listener: StoreListener) => listener.onComets(comets));
	}

	async upload(url: string, body: Params) {
		return await this.fetch(url, 'POST', body);
	}
	async post<K>(postUrl: string, param: Params): Promise<TransportResponse<K>> {
		return await this.fetch<K>(postUrl, 'post', param);
	}
	async get<K>(getUrl: string, param?: Params): Promise<TransportResponse<K>> {
		return await this.fetch<K>(getUrl, 'get', param);
	}
	async patch<K>(patchUrl: string, param?: Params): Promise<TransportResponse<K>> {
		return await this.fetch<K>(patchUrl, 'patch', param);
	}
	async put<K>(patchUrl: string, param?: Params): Promise<TransportResponse<K>> {
		return await this.fetch<K>(patchUrl, 'put', param);
	}
	async options(optionsUrl: string, param?: Params) {
		return await this.fetch(optionsUrl, 'options', param);
	}
	async delete<K>(deleteUrl: string, param?: Params): Promise<TransportResponse<K>> {
		return await this.fetch<K>(deleteUrl, 'delete', param);
	}
}

const dt = new TransportImpl({} as TransportConfig);
transportsMap['default'] = dt;

const Transport: TransportFactory = {
	configure(config: TransportConfig) {
		const { context = 'default', ...rest } = config;
		const transport = new TransportImpl(rest);
		transportsMap[context] = transport;
		return transport;
	},
	instance(context?: string | TransportInstanceProps) {
		if (['string', 'undefined'].includes(typeof context)) {
			const cntx = context ? context : 'default';
			const transport = transportsMap[cntx as string];
			if (!transport) {
				throw Error('Invalid transport context: ' + cntx);
			}
			return transport;
		} else {
			const { fetch, context: innerContext = 'default' } = context as TransportInstanceProps;
			const transport = transportsMap[innerContext];
			if (!transport) {
				throw Error('Invalid transport context: ' + innerContext);
			}
			transport.config.fetch = fetch;
			return transport;
		}
	}
};

export { Transport };
