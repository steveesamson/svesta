/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Fetch, InternalTransportType } from './internal.js';

export type HTTPMethod =
	| 'GET'
	| 'POST'
	| 'DELETE'
	| 'PUT'
	| 'HEAD'
	| 'OPTIONS'
	| 'PATCH'
	| 'UPLOAD'
	| 'get'
	| 'post'
	| 'delete'
	| 'put'
	| 'head'
	| 'options'
	| 'patch'
	| 'upload';

export type WithID = { id?: any; } & Params;
export type Order = 'asc' | 'desc' | string;

export type Params<T = any> = {
	[key: string]: T;
};

type ContentType = 'ApplicationJson' | 'FormURLEncoded';
export type ContentTypes = {
	[key in ContentType]: string;
}
export type UseEvent<T> = {
	is: (value: T) => boolean;
	get value(): T;
	set value(data: T);
	clear: () => void;
	get error(): string;
	set error(err: string);
};
export type UseEventProps<T> = {
	type: string;
	data?: T;
	error?: string;
};
export type EventHandler = (data?: Params) => void;

export type TransportResponse<T = unknown> = {
	error?: string;
	data?: T;
	status: number;
	message?: string;
};

export type StoreResult<T extends WithID> = {
	data?: T[];
	recordCount: number;
	pages: number;
	page: number;
	limit?: number;
	loading?: boolean;
	error?: string | null | undefined;
};
export type StoreState<T extends WithID> = {
	data?: T[];
	recordCount: number;
	pages: number;
	page: number;
	limit?: number;
	loading?: boolean;
	error?: string | null | undefined;
	params?: Params;
};
export type StoreEvent = 'refresh' | 'create' | 'destroy' | 'update';
export type StoreResultTransformer<T extends WithID> = (response: any) => StoreResult<T>;
export type StoreQueryTransformer = (response: any) => Params;

export interface Store<T extends WithID> {
	result: StoreResult<T>;
	sync: (init?: StoreState<T>) => Promise<void>;
	more: () => Promise<void>;
	pageTo: (page: number) => Promise<void>;
	next: () => Promise<void>;
	prev: () => Promise<void>;
	on: (event: StoreEvent, handler: EventHandler) => void;
	search: (searchTerm: string) => void;
	destroy: (where: T) => Promise<TransportResponse<T>>;
	save: (delta: T) => Promise<TransportResponse<T>>;
	find: (value: any, key: string) => Promise<T | undefined>;
	post: <K = Params>(path: string, params: Params) => Promise<TransportResponse<K>>;
	get: <K = Params>(path: string, params: Params) => Promise<TransportResponse<K>>;
	despace: (data: Params) => Promise<TransportResponse>;
	upload: (file: Params) => Promise<TransportResponse>;
	// paginate: (offset: number) => Promise<void>;
	filter: (query: Partial<T>) => void;
	remove: (inData: T) => void;
	add: (inData: T) => void;
	patch: (inData: T) => void;
	debug: () => void;
}
export type IOSocketTransport = 'websocket' | 'polling';
export type SocketIOConfig = {
	transports: IOSocketTransport[];
	auth?: (cb: (args: Params) => void) => void;
};
export type TransportConfig = {
	BASE_URL: string;
	fetch?: Fetch;
	DEBUG?: boolean;
	context?: string;
	realTime?: SocketIOConfig;
	init?: RequestInit;
	beforeSend?: (headers: Params) => void;
};

export type TransportType = {
	status: NetworkStatus;
	upload: <T = Params>(url: string, body: Params) => Promise<TransportResponse<T>>;
	get: <T = Params>(url: string, params?: Params) => Promise<TransportResponse<T>>;
	delete: <T = Params>(url: string, params?: Params) => Promise<TransportResponse<T>>;
	post: <T = Params>(url: string, body: Params) => Promise<TransportResponse<T>>;
	put: <T = Params>(url: string, body: Params) => Promise<TransportResponse<T>>;
	patch: <T = Params>(url: string, body: Params) => Promise<TransportResponse<T>>;
	options: (url: string, body: Params) => Promise<TransportResponse>;
};
export type TransportInstanceProps = {
	fetch: Fetch;
	context?: string;
	beforeSend?: (headers: Params) => void;
};
export type TransportFactory = {
	configure: (config: TransportConfig) => InternalTransportType;
	instance: (context?: string | TransportInstanceProps) => InternalTransportType;
};

export type StoreProps<T extends WithID> = {
	params?: Params;
	orderAndBy?: Order;
	namespace?: string;
	initData?: StoreState<T>;
	transportContext?: string;
	includes?: string;
	resultTransformer?: StoreResultTransformer<T>;
	queryTransformer?: StoreQueryTransformer;
};

export type NetworkStatus = {
	online: boolean;
};

export type Network = {
	status: NetworkStatus;
	qeueuRefresh: () => void;
};
