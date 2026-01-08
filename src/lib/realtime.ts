/* eslint-disable @typescript-eslint/no-explicit-any */
import { network } from './network.svelte.js';
import type { Params, HTTPMethod, TransportResponse } from './types/index.js';
import type { InternalTransportType } from './types/internal.js';

export const useRealtime = async (transport: InternalTransportType) => {
	try {
		const ioClient = await import('socket.io-client');
		const { io } = ioClient;
		const { BASE_URL, DEBUG, realTime = undefined } = transport.config;
		 if(!realTime){
            return;
        }
		const url = new URL(BASE_URL);
        const { REALTIME_BASE_URL = url.origin, ...rt} = realTime;
        const socket = io(`${REALTIME_BASE_URL}`, rt); //['polling','websocket'];

		socket.on('connect', function () {
			transport.syncer = function<K = Params>(url: string, method: HTTPMethod, params?: Params) {
				if (!network.status.online) {
					network.qeueuRefresh();
					return Promise.resolve({ error: 'You seem to be offline :)', status: 404 });
				}
				return new Promise((resolve) => {
					try {
						const data = { ...params, __client_time: new Date().toISOString() };
						socket.emit(method, { path: url, data }, (m: TransportResponse<K>) => {
							if (DEBUG) {
                                console.log('RealTime Result: ', { m, url, method, data });
                            }
							resolve(m as Response);
						});
					} catch (e: any) {
						if (DEBUG) {
                            console.log('RealTime Error: ', { error: e.toString(),  url, method,  params} );
                        }
						resolve({ error: e.toString(), status: 500 });
					}
				});
			};
		});
		socket.on('comets', transport.onComets);
		return socket;
	} catch (err) {
		console.log('RealTime initialization error: ', err);
	}
};
