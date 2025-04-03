/* eslint-disable @typescript-eslint/no-explicit-any */
// import type NetworkStatus from "$lib/components/network-status.svelte";
import type { Snippet } from "svelte";
import type { Fetch, InternalTransportType, WithID } from "./internal.js";
// import type { ComponentType } from "svelte";

export type HTTPMethod =
    | 'GET'
    | 'POST'
    | 'DELETE'
    | 'PUT'
    | 'HEAD'
    | 'OPTIONS'
    | 'PATCH'
    | 'get'
    | 'post'
    | 'delete'
    | 'put'
    | 'head'
    | 'options'
    | 'patch';


export type Order = 'asc' | 'desc' | string;

export type Params<T = any> = {
    [key: string]: T;
};
export type UseEvent<T> = {
    is: (value: T) => boolean;
    get value(): T;
    set value(data: T);
    clear: () => void;
    get error(): string;
    set error(err: string);
}
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

export type StoreResult<T> = {
    data: T[];
    recordCount: number;
    pages: number;
    page: number;
    limit?: number;
    loading?: boolean;
    error?: string | null | undefined;
}
export type StoreState<T> = {
    data: T[];
    recordCount: number;
    pages: number;
    page: number;
    limit?: number;
    loading?: boolean;
    error?: string | null | undefined;
    params?: Params;
}
export type StoreEvent = 'refresh' | 'create' | 'destroy' | 'update';
export type StoreResultTransformer = <T>(response: any) => StoreResult<T>;
export type StoreQueryTransformer = (response: any) => Params;

export interface Store<T> {
    result: StoreResult<T>;
    sync: (init?: StoreState<T>) => void;
    more: () => void;
    pageTo: (page: number) => void;
    next: () => void;
    prev: () => void;
    on: (event: StoreEvent, handler: EventHandler) => void;
    search: (searchTerm: string) => void;
    destroy: (where: WithID) => Promise<TransportResponse<T>>;
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
}
export type TransportConfig = {
    BASE_URL: string;
    fetch?: Fetch;
    DEBUG?: boolean;
    context?: string;
    realTime?: SocketIOConfig;
    init?: RequestInit;
}

export type TransportType = {
    status: NetworkStatus;
    upload: <T = Params>(url: string, body: Params) => Promise<TransportResponse<T>>;
    get: <T = Params>(url: string, params?: Params) => Promise<TransportResponse<T>>;
    delete: <T = Params>(url: string, params?: Params) => Promise<TransportResponse<T>>;
    post: <T = Params>(url: string, body: Params) => Promise<TransportResponse<T>>;
    put: <T = Params>(url: string, body: Params) => Promise<TransportResponse<T>>;
    patch: <T = Params>(url: string, body: Params) => Promise<TransportResponse<T>>;
    options: (url: string, body: Params) => Promise<TransportResponse>;
}
export type TransportInstanceProps = {
    fetch: Fetch;
    context?: string;

}
export type TransportFactory = {
    configure: (config: TransportConfig) => InternalTransportType;
    instance: (context?: string | TransportInstanceProps) => InternalTransportType;
}

export type StoreProps<T> = {
    params?: Params;
    orderAndBy?: Order;
    namespace?: string;
    initData?: StoreState<T>;
    transportContext?: string;
    includes?: string;
    resultTransformer?: StoreResultTransformer;
    queryTransformer?: StoreQueryTransformer;
};

export type NetworkStatus = {
    online: boolean;
}

export type Network = {
    status: NetworkStatus;
    qeueuRefresh: () => void;
};