/* eslint-disable @typescript-eslint/no-explicit-any */

import type { TransportResponse, HTTPMethod, Params, StoreEvent, TransportConfig } from "./index.js";

export type WithID = {
    id: any;
}

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

export type InternalTransportType = {
    isOnline: () => void;
    cometListeners: StoreListenerList;
    config: TransportConfig;
    destroy: () => void;
    switchToRealTime: () => void;
    configure: (_config: Partial<TransportConfig>) => void;
    onCometsNotify: (listener: StoreListener) => void;
    stopCometsOn: (listener: StoreListener) => void;
    onComets: (comets: Comet) => void;
    fetch: (url: string, method: HTTPMethod, params?: Params) => Promise<TransportResponse>;
    sync: (url: string, method: HTTPMethod, params?: Params) => Promise<TransportResponse>;
    upload: (url: string, body: Params) => Promise<TransportResponse>;
    get: (url: string, params?: Params) => Promise<TransportResponse>;
    delete: (url: string, params?: Params) => Promise<TransportResponse>;
    post: (url: string, body: Params) => Promise<TransportResponse>;
    put: (url: string, body: Params) => Promise<TransportResponse>;
    patch: (url: string, body: Params) => Promise<TransportResponse>;
    options: (url: string, body: Params) => Promise<TransportResponse>;
}