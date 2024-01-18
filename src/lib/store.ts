import { type Writable, writable, get as g } from 'svelte/store';
import { Transport } from './transport.js';
import { debounce, makeName } from './utils.js';
import type {
	StoreState,
	Params,
	StoreProps,
	StoreTransformer,
	IStore,
	StoreEvent
} from './types/index.js';

import type { Comet, WithID } from './types/internal.js';

type GetStore<T> = {
	name: string;
	params: Params;
	order: string;
	orderBy: string;
	store: Writable<StoreState<T>>;
	resultKey: string;
	namespace: string;
	reverse: boolean;
	LIMIT: number;
	includes: string;
	resultTransformer: StoreTransformer;
	queryTransformer: StoreTransformer;
}

const { realTime } = Transport.config;
const stores: Params = {};


const getStore = <T extends WithID>(
	{ name,
		params = {},
		order = 'asc',
		orderBy,
		store,
		resultKey,
		namespace,
		reverse = false,
		LIMIT,
		includes = '',
		resultTransformer,
		queryTransformer }: GetStore<T>
): IStore<T> => {
	const { data: initData = [] } = g(store);

	let offset = 0,
		query = {},
		searchTerm = '',
		insync = initData.length > 0,
		infinite = false,
		page = 1;

	const storeName = name,
		listeners: Params = {},
		url = `/${name}`;

	const isLoading = (loading: boolean) => {
		store.update((staleState: StoreState<T>) => ({ ...staleState, loading }));
	};
	const search = (s: string) =>
		debounce(() => {
			insync = false;
			offset = 0;
			page = 1;
			///Watch the above in case of endless ...
			searchTerm = s;
			sync();
		}, 500)();

	const filter = (q: Partial<T>) => {
		insync = false;
		offset = 0;
		page = 1;
		query = q;
		sync();
	};
	const value = () => {
		return g(store);
	};
	const paginate = async (_offset: number) => {
		if (+_offset + 1 === page) return;
		offset = +_offset * LIMIT;
		page = +_offset + 1;
		insync = false;
		sync();
	};
	const pageTo = async (nextPage: number): Promise<void> => {
		const _offset = (nextPage - 1) * LIMIT;
		const { recordCount } = value();
		if (_offset >= recordCount) {
			return;
		}

		offset = _offset;
		insync = false;
		infinite = false;
		query = { ...query, page: nextPage };
		await sync();
		const { error } = value();
		if (!error) {
			page = nextPage;
		}
	};

	const next = async (): Promise<void> => {
		if (!insync) {
			return console.log('Store not prefetched!');
		}
		const _offset = page * LIMIT;
		const { recordCount, loading } = value();
		if (_offset >= recordCount || loading) {

			return;
		}
		const nextPage = page + 1;
		offset = _offset;
		insync = false;
		infinite = true;
		query = { ...query, page: nextPage };
		await sync();
		const { error } = value();
		if (!error) {
			page = nextPage;
		}
	};

	const prepQuery = (): Params => {
		let newQuery: Params = { ...params, limit: LIMIT, offset, ...query, orderDirection: order };
		if (orderBy) {
			newQuery.orderBy = orderBy;
		}
		if (includes) {
			newQuery.includes = includes;
		}
		if ('limit' in params && !params.limit) {
			delete newQuery.limit;
		}

		if (searchTerm) {
			newQuery = { ...newQuery, search: searchTerm };
		}
		query = {};
		return queryTransformer(newQuery);
	};

	const mutateMany = (dataIn: StoreState<T>) => {
		const { recordCount, data, page, pages: _pgs, limit } = dataIn;
		if (limit && limit !== LIMIT) {
			// Use limit from API
			LIMIT = limit;
		}

		store.update(({ data: staleData }: StoreState<T>) => {
			if (reverse) {
				data.reverse();
			}
			const newData = infinite
				? reverse
					? [...data, ...(staleData || [])]
					: [...(staleData || []), ...data]
				: data;
			const pages = _pgs ? _pgs : (recordCount ? Math.ceil(recordCount / LIMIT) : 0);
			return { data: newData, recordCount, page, pages, loading: false, error: null };
		});
		insync = true;
	};
	const mutateRemove = async (inData: T) => {
		if (!insync) {
			return;
		}

		const exists = await find(inData.id);
		if (exists) {
			store.update(({ data: oldData, recordCount: oldRecordCount }: StoreState<T>) => {
				const recordCount = oldRecordCount - 1;
				const data = oldData.filter((e: T) => e.id != inData.id);
				const pages = recordCount ? Math.ceil(recordCount / LIMIT) : 0;
				return {
					page,
					data,
					recordCount,
					pages,
					loading: false
				};
			});
		}
	};

	const mutateAdd = async (inData: T) => {
		if (!insync) {
			return;
		}
		const exists = await find(inData.id);
		if (exists) {
			return;
		}
		inData = { ...inData, isNew: true };
		store.update(({ data: staleData, recordCount: oldRecordCount }: StoreState<T>) => {
			const data = reverse
				? [...(staleData || []), inData]
				: order === 'asc'
					? [...(staleData || []), inData]
					: [inData, ...(staleData || [])];
			const recordCount = oldRecordCount + 1;
			const pages = recordCount ? Math.ceil(recordCount / LIMIT) : 0;
			return { data, recordCount, page, pages, loading: false };
		});
	};
	const mutatePatch = (inData: T) => {
		if (!insync) {
			return;
		}
		store.update(({ data: staleData, ...rest }: StoreState<T>) => {
			const data = (staleData || []).map((rec: T) => (rec.id == inData.id ? { ...rec, ...inData } : rec));
			return {
				...rest,
				data
			};
		});
	};

	const sync = async (initData?: StoreState<T>) => {
		if (initData) {
			return mutateMany(initData);
		}
		if (insync) return;
		const qry = prepQuery();
		isLoading(true);
		const { error, ...others } = await Transport.sync(url, 'get', { ...qry });
		isLoading(false);
		if (error) {
			return store.update((oldState: StoreState<T>) => {
				return {
					...oldState,
					loading: false,
					error
				};
			});
		}
		if (others) {
			const res = resultTransformer(others) as StoreState<T>;
			mutateMany(res);
		}
	};

	const post = async (postUrl: string, param: Params) => {
		return await Transport.post(`${url}${postUrl}`, param);
	};
	const get = async (getUrl: string, param: Params) => {
		return await Transport.get(`${url}${getUrl}`, param);
	};
	const destroy = async (where: WithID) => {
		const _url = `${url}/${where.id}`;
		const { error, status, data } = await Transport.sync(_url, 'delete', where);
		if (!error && !!data) {
			mutateRemove(data as T);
			const message = `${makeName(storeName)} was successfully destroyed.`;
			return { data, status, message };
		}
		return { error, status };
	};
	const save = async (delta: T) => {
		const mtd = delta.id ? 'put' : 'post',
			_url = delta.id ? `${url}/${delta.id}` : url;

		const { error, status, data } = await Transport.sync(_url, mtd, delta);

		let message;

		if (!error) {
			if (mtd === 'put') {
				mutatePatch(data as T);
				message = `${makeName(storeName)} was successfully updated.`;
			} else {
				mutateAdd(data as T);
				message = `${makeName(storeName)} was successfully created.`;
			}
		}
		return { error, data, status, message };
	};

	const find = async (value: string, key = 'id'): Promise<T | undefined> => {
		if (!insync) {
			await sync();
		}
		const { data = [] } = g(store) as StoreState<T>;
		return data.find((v: Params) => v[key] == value);
	};
	const despace = (_data: Params) => Transport.post(`${url}/despace`, _data);
	const upload = (file: Params) => Transport.upload(`${url}/upload`, file);
	const on = (event: StoreEvent, handler: (data: T) => void) => {
		const events = listeners[event] || [];
		const index = events.length;
		events[index] = handler;
		listeners[event] = events;
		return () => listeners[event].splice(index, 1);
	};

	const notify = (event: StoreEvent, data: T) => {
		(listeners[event] || []).forEach((f: (data: T) => void) => f(data));
	};
	const startListening = () => {
		const canAdd = (_data: Params) => {
			const reducer = (accum: boolean, next: string) => accum && params[next] == _data[next];

			return Object.entries(params).length > 0 ? Object.keys(params).reduce(reducer, true) : true;
		};
		const storeTracker = {
			store: namespace,
			listenerID: resultKey,
			async onComets(comet: Comet) {
				if (comet.room !== namespace) {
					return console.log(`${comet.room} is not ${namespace}`);
				}
				let exists;
				switch (comet.verb) {
					case 'refresh':
						mutateMany(comet.data as StoreState<T>);
						notify(comet.verb, comet.data.data); //on hold
						break;
					case 'update':
						// console.log('onComets: ', comet.room, comet.verb, comet.data, params);
						exists = await find(comet.data.id);
						if (exists) {
							mutatePatch(comet.data as T);
							notify(comet.verb, comet.data as T);
						}
						break;

					case 'create':
						// console.log('onComets: ', comet.room, comet.verb, comet.data, params);
						if (canAdd(comet.data)) {
							exists = await find(comet.data.id);
							if (!exists) {
								mutateAdd(comet.data as T);
								notify(comet.verb, comet.data as T);
							}
						}
						break;

					case 'destroy':
						exists = await find(comet.data.id);
						if (exists) {
							mutateRemove(comet.data as T);
							notify(comet.verb, comet.data as T);
						}
						break;
				}
			}
		};
		Transport.onCometsNotify(storeTracker);
	};
	if (realTime) {
		startListening();
	}
	const noOp = () => { };

	return {
		set: noOp,
		update: noOp,
		subscribe: store.subscribe,
		sync,
		next,
		on,
		search,
		paginate,
		pageTo,
		post,
		get,
		destroy,
		save,
		find,
		add: mutateAdd,
		patch: mutatePatch,
		remove: mutateRemove,
		filter,
		despace,
		upload,
		debug: () => console.log(params, order)
	};
};

if (realTime) {
	Transport.switchToRealTime();
}

export const useStore = <T extends WithID>(
	resourceName: string = '',
	props?: StoreProps<T>
): IStore<T> => {
	const {
		params,
		namespace,
		orderAndBy,
		initData,
		resultTransformer,
		queryTransformer,
		includes
	}: StoreProps<T> = {
		...{
			params: {},
			namespace: resourceName,
			orderAndBy: 'asc',
			includes: '',
			initData: {} as StoreState<T>,
			resultTransformer: (raw: Params) => {
				return raw;
			},
			queryTransformer: (raw: Params) => {
				return raw;
			}
		},
		...(props ?? {})
	};

	let orderBy = '', order;
	const reverse = resourceName.indexOf('~') === 0;

	if (orderAndBy) {
		const [ord = 'asc', by = ''] = orderAndBy.split('|');
		order = ord;
		orderBy = by;
	}

	order = (order || 'asc').toLowerCase();
	const keyMap = { order, orderBy, ...params };
	if (orderBy) {
		keyMap.orderBy = orderBy;
	}

	const resultKey = `/${resourceName}/${JSON.stringify(keyMap)}/${includes}`;
	const store = stores[resultKey];

	resourceName = resourceName.replace('~', '');
	const NS = namespace.replace('~', '');

	if (store) {
		const { limit = 25 } = g(store) as StoreState<T>;
		return getStore(
			{
				name: resourceName,
				params,
				order,
				orderBy,
				store,
				resultKey,
				namespace: NS,
				reverse,
				LIMIT: limit,
				includes,
				resultTransformer,
				queryTransformer
			}
		);
	}
	const defaultStoreData = {
		data: [] as T[],
		recordCount: 0,
		pages: 0,
		page: 1,
		limit: 25,
		loading: false,
		error: null
	} as StoreState<T>;

	const fusedState = { ...defaultStoreData, ...initData };
	const newStore = writable<StoreState<T>>(fusedState);
	stores[resultKey] = newStore;
	const { limit = 25 } = fusedState;
	return getStore(
		{
			name: resourceName,
			params,
			order,
			orderBy,
			store: newStore,
			resultKey,
			namespace: NS,
			reverse,
			LIMIT: limit,
			includes,
			resultTransformer,
			queryTransformer
		}
	);
};
