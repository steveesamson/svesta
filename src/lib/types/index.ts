/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Fetch, WithID } from "./internal.js";
import type { ComponentType } from "svelte";

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

export type SvelteComponentAsProp = {
    component: ComponentType;
    props: Params;
}
export type Params<T = any> = {
    [key: string]: T;
};
export type UseEvent<T> = {
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

export type ResolveSnippet<T> = (to:StoreResult<T>) => void;

/**
 * page, limit, recordCount, pages, data
 */

export type StoreResult<T> = {
    data: T[];
    recordCount: number;
    pages: number;
    page: number;
    limit?: number;
    length:number;
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
export type StoreTransformer = (response: Params) => Params;

export interface IStore<T> {
    result: StoreResult<T>;
    sync: (init?: StoreState<T>) => void;
    more: () => void;
    pageTo: (page: number) => void;
    next: () => void;
    prev: () => void;
    on: (event: StoreEvent, handler: EventHandler) => void;
    search: (searchTerm: string) => void;
    destroy: (where: WithID) => Promise<TransportResponse>;
    save: (delta: T) => Promise<TransportResponse>;
    find: (value: any, key: string) => Promise<T | undefined>;
    post: (path: string, params: Params) => Promise<TransportResponse>;
    get: (path: string, params: Params) => Promise<TransportResponse>;
    despace: (data: Params) => Promise<TransportResponse>;
    upload: (file: Params) => Promise<TransportResponse>;
    // paginate: (offset: number) => Promise<void>;
    filter: (query: Partial<T>) => void;
    remove: (inData: T) => void;
    add: (inData: T) => void;
    patch: (inData: T) => void;
    debug: () => void;
}

export type TransportConfig = {
    DEBUG: boolean;
    BASE_URL: string;
    fetch: Fetch | undefined;
    realTime: boolean;
    init: RequestInit;
}

export type TransportType = {
    isOnline: boolean;
    configure: (_config: Partial<TransportConfig>) => void;
    upload: (url: string, body: Params) => Promise<TransportResponse>;
    get: (url: string, params?: Params) => Promise<TransportResponse>;
    delete: (url: string, params?: Params) => Promise<TransportResponse>;
    post: (url: string, body: Params) => Promise<TransportResponse>;
    put: (url: string, body: Params) => Promise<TransportResponse>;
    patch: (url: string, body: Params) => Promise<TransportResponse>;
    options: (url: string, body: Params) => Promise<TransportResponse>;
}

export type StoreProps<T> = {
    params?: Params;
    orderAndBy?: Order;
    namespace?: string;
    initData?: StoreState<T>;
    includes?: string;
    resultTransformer?: StoreTransformer;
    queryTransformer?: StoreTransformer;
};