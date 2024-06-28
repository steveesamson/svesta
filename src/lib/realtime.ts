/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Params, HTTPMethod } from './types/index.js';
import type { InternalTransportType } from './types/internal.js';

export const useRealtime = async (Transport: InternalTransportType) => {
    try {
        const ioClient = await import('socket.io-client');
        const { io } = ioClient;
        const { BASE_URL, DEBUG } = Transport.config;

        const socket = io(`${BASE_URL}`, { transports: ['websocket'] }); //['polling','websocket'];
        socket.on('connect', function () {
            Transport.sync = function (url: string, method: HTTPMethod, data?: Params) {
                return new Promise((resolve) => {
                    try {
                        socket.emit(method, { path: url, data }, (m: Params) => {

                            const { status, body } = m;
                            const all: Response = { status, ...(body || {}) };
                            if (DEBUG) {
                                console.log('IO: ', 'result: ', m, 'path: ', url, 'method: ', method, ' args: ', data);
                            }
                            resolve(all);
                        });
                    } catch (e: any) {
                        if (DEBUG) {
                            console.log('IO: ', 'error: ', e.toString(), 'path: ', url, 'method: ', method, ' args: ', data);
                        }
                        resolve({ error: e.toString(), status: 500 });
                    }
                });
            };
        });
        socket.on('comets', Transport.onComets);
        return socket;
    } catch (err) {
        console.log('RealTime initialization error: ', err);
    }
}
