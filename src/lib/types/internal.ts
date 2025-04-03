/* eslint-disable @typescript-eslint/no-explicit-any */

import type {
	TransportResponse,
	HTTPMethod,
	Params,
	StoreEvent,
	TransportConfig,
	UseEvent
} from './index.js';

export type WithID = {
	id: any;
};

type Data<T = any> = {
	[key: string]: T | T[];
};

export type Comet = {
	verb: StoreEvent;
	data: Data;
	room: string;
};

export type StoreListener = {
	store: string;
	listenerID: string;
	onComets: (comet: Comet) => void;
};

export type StoreListenerList = {
	[key: string]: StoreListener[];
};

export type Fetch = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export interface InternalTransportType {
	loading: UseEvent<boolean>;
	cometListeners: StoreListenerList;
	config: TransportConfig;
	// instance:(ctx:string) => InternalTransportType | undefined;
	destroy: () => void;
	switchToRealTime: () => Promise<void>;
	// configure: (_config: Partial<TransportConfig>) => void;
	onCometsNotify: (listener: StoreListener) => void;
	stopCometsOn: (listener: StoreListener) => void;
	onComets: (comets: Comet) => void;
	fetch: <K>(url: string, method: HTTPMethod, params?: Params) => Promise<TransportResponse<K>>;
	sync: (url: string, method: HTTPMethod, params?: Params) => Promise<TransportResponse>;
	upload: (url: string, body: Params) => Promise<TransportResponse>;
	get: <K>(url: string, params?: Params) => Promise<TransportResponse<K>>;
	delete: <K>(url: string, params?: Params) => Promise<TransportResponse<K>>;
	post: <K>(url: string, body: Params) => Promise<TransportResponse<K>>;
	put: <K>(url: string, body: Params) => Promise<TransportResponse<K>>;
	patch: <K>(url: string, body: Params) => Promise<TransportResponse<K>>;
	options: (url: string, body: Params) => Promise<TransportResponse>;
}
