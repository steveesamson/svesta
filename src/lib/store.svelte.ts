// import { type Writable, writable, get as g } from 'svelte/store';
import { Transport } from './transport.js';
import { debounce, makeName } from './utils.js';
import type {
	StoreState,
	Params,
	StoreProps,
	StoreResultTransformer,
	StoreQueryTransformer,
	Store,
	StoreEvent,
	StoreResult,
	TransportResponse
} from './types/index.js';
import type { Comet, InternalTransportType, WithID } from './types/internal.js';
import { network } from './network.svelte.js';

type GetStore<T> = {
	name: string;
	params: Params;
	order: string;
	orderBy: string;
	store: StoreState<T>;
	resultKey: string;
	namespace: string;
	reverse: boolean;
	LIMIT: number;
	transportContext: string;
	includes: string;
	resultTransformer: StoreResultTransformer;
	queryTransformer: StoreQueryTransformer;
};

const stores: Params = {};

const getStore = <T extends WithID>({
	name,
	params = {},
	order = 'asc',
	orderBy,
	store,
	resultKey,
	namespace,
	reverse = false,
	LIMIT,
	transportContext = 'default',
	includes = '',
	resultTransformer,
	queryTransformer
}: GetStore<T>): Store<T> => {
	const { data: initData = [] } = store;

	let offset = 0,
		query = {},
		searchTerm = '',
		insync = initData.length > 0,
		infinite = false,
		page = 1;

	const transport: InternalTransportType | undefined = Transport.instance(transportContext);
	if (!transport) {
		throw Error('Unknown transport context: ' + transportContext);
	}

	const storeName = name,
		listeners: Params = {},
		url = `/${name}`;

	const isLoading = (loading: boolean) => {
		store.loading = loading;
	};
	const search = (s: string) =>
		debounce(() => {
			if (!network.status.online) return;
			insync = false;
			offset = 0;
			page = 1;
			///Watch the above in case of endless ...
			searchTerm = s;
			sync();
		}, 500)();

	const filter = (q: Partial<T>) => {
		if (!network.status.online) return;
		insync = false;
		offset = 0;
		page = 1;
		query = q;
		sync();
	};

	const next = async (): Promise<void> => {
		if (!network.status.online) return;
		const { recordCount, page: curPage } = store;
		const nextPage = curPage + 1;
		const _offset = (nextPage - 1) * LIMIT;
		if (_offset >= recordCount) {
			return;
		}

		offset = _offset;
		insync = false;
		infinite = false;
		query = { ...query, page: nextPage };
		await sync();
		const { error } = store;
		if (!error) {
			page = nextPage;
		}
	};
	const prev = async (): Promise<void> => {
		if (!network.status.online) return;
		const { recordCount, page: curPage } = store;
		const nextPage = curPage - 1;
		const _offset = (nextPage - 1) * LIMIT;
		if (_offset >= recordCount) {
			return;
		}

		offset = _offset;
		insync = false;
		infinite = false;
		query = { ...query, page: nextPage };
		await sync();
		const { error } = store;
		if (!error) {
			page = nextPage;
		}
	};
	const pageTo = async (nextPage: number): Promise<void> => {
		if (!network.status.online) return;
		const _offset = (nextPage - 1) * LIMIT;
		const { recordCount } = store;
		if (_offset >= recordCount) {
			return;
		}

		offset = _offset;
		insync = false;
		infinite = false;
		query = { ...query, page: nextPage };
		await sync();
		const { error } = store;
		if (!error) {
			page = nextPage;
		}
	};

	const more = async (): Promise<void> => {
		if (!insync) {
			return console.log('Store not prefetched!');
		}
		if (!network.status.online) return;

		const _offset = page * LIMIT;
		const { recordCount, loading } = store;
		if (_offset >= recordCount || loading) {
			return;
		}
		const nextPage = page + 1;
		offset = _offset;
		insync = false;
		infinite = true;
		query = { ...query, page: nextPage };
		await sync();
		const { error } = store;
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

	const mutateMany = (dataIn: StoreResult<T>) => {
		const { recordCount, data, page, pages: _pgs, limit } = dataIn;
		if (limit && limit !== LIMIT) {
			// Use limit from API
			LIMIT = limit;
		}
		if (reverse) {
			data.reverse();
		}
		const { data: staleData } = store;
		const newData = infinite
			? reverse
				? [...data, ...(staleData || [])]
				: [...(staleData || []), ...data]
			: data;

		const pages = _pgs ? _pgs : recordCount ? Math.ceil(recordCount / LIMIT) : 0;
		store.data = newData;
		store.page = page;
		store.pages = pages;
		store.loading = false;
		store.error = null;
		store.recordCount = recordCount;
		insync = true;
	};
	const mutateRemove = async (inData: T) => {
		if (!insync) {
			return;
		}

		const exists = await find(inData.id);
		if (exists) {
			const { data: oldData, recordCount: oldRecordCount } = store;
			const recordCount = oldRecordCount - 1;
			const data = oldData.filter((e: T) => e.id != inData.id);
			const pages = recordCount ? Math.ceil(recordCount / LIMIT) : 0;
			store.data = data;
			store.page = page;
			store.pages = pages;
			store.loading = false;
			store.recordCount = recordCount;
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
		const { data: staleData, recordCount: oldRecordCount } = store;
		const data = reverse
			? [...(staleData || []), inData]
			: order === 'asc'
				? [...(staleData || []), inData]
				: [inData, ...(staleData || [])];
		const recordCount = oldRecordCount + 1;
		const pages = recordCount ? Math.ceil(recordCount / LIMIT) : 0;
		store.data = data;
		store.page = page;
		store.pages = pages;
		store.loading = false;
		store.recordCount = recordCount;
	};
	const mutatePatch = (inData: T) => {
		if (!insync) {
			return;
		}
		const { data: staleData } = store;
		const data = (staleData || []).map((rec: T) =>
			rec.id == inData.id ? { ...rec, ...inData } : rec
		);
		store.data = data;
	};

	const sync = async (initData?: StoreResult<T>) => {
		if (initData) {
			return mutateMany(initData);
		}
		if (!network.status.online) return;
		if (insync) return;
		const qry = prepQuery();
		isLoading(true);
		const { error, ...others } = await transport.sync(url, 'get', { ...qry });
		isLoading(false);
		if (error) {
			store.error = error;
			store.loading = false;
		}
		if (!error && others) {
			const res = resultTransformer(others) as StoreState<T>;
			mutateMany(res);
		}
	};

	const post = async <K>(postUrl: string, param: Params): Promise<TransportResponse<K>> => {
		return await transport.post<K>(`${url}${postUrl}`, param);
	};
	const get = async <K>(getUrl: string, param: Params): Promise<TransportResponse<K>> => {
		return await transport.get<K>(`${url}${getUrl}`, param);
	};
	const destroy = async (where: WithID) => {
		const _url = `${url}/${where.id}`;
		const { error, status, data } = await transport.sync(_url, 'delete', where);
		if (!error && data) {
			mutateRemove(data as T);
			const message = `${makeName(storeName)} was successfully destroyed.`;
			return { data: data as T, status, message };
		}
		return { error, status };
	};
	const save = async (delta: T): Promise<TransportResponse<T>> => {
		const mtd = delta.id ? 'put' : 'post',
			_url = delta.id ? `${url}/${delta.id}` : url;

		const { error, status, data } = await transport.sync(_url, mtd, delta);

		let message;

		if (!error && data) {
			if (mtd === 'put') {
				mutatePatch(data as T);
				message = `${makeName(storeName)} was successfully updated.`;
			} else {
				mutateAdd(data as T);
				message = `${makeName(storeName)} was successfully created.`;
			}
		}
		return { error, data: data as T, status, message };
	};

	const find = async (value: string, key = 'id'): Promise<T | undefined> => {
		if (!insync) {
			await sync();
		}
		const { data = [] } = store;
		return data.find((v: Params) => v[key] == value);
	};
	const despace = (_data: Params) => transport.post(`${url}/despace`, _data);
	const upload = (file: Params) => transport.upload(`${url}/upload`, file);
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
		transport.onCometsNotify(storeTracker);
	};
	const { realTime } = transport.config;
	if (realTime) {
		transport.switchToRealTime();
		startListening();
	}

	return {
		get result() {
			return store;
		},
		sync,
		on,
		search,
		next,
		prev,
		more,
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

export const useStore = <T extends WithID>(
	resourceName: string = '',
	props?: StoreProps<T>
): Store<T> => {
	const {
		params,
		namespace,
		orderAndBy,
		initData,
		resultTransformer,
		queryTransformer,
		transportContext,
		includes
	}: StoreProps<T> = {
		...{
			params: {},
			namespace: resourceName,
			orderAndBy: 'asc',
			transportContext: 'default',
			includes: '',
			initData: {} as StoreResult<T>,
			resultTransformer: <T>(raw: Params) => {
				return raw as StoreResult<T>;
			},
			queryTransformer: <T>(raw: Params) => {
				return raw as T;
			}
		},
		...(props ?? {})
	};

	let orderBy = '',
		order;
	const reverse = resourceName.indexOf('~') === 0;
	resourceName = resourceName.indexOf('/') === 0 ? resourceName.substring(1) : resourceName;

	if (orderAndBy) {
		const [ord = 'asc', by = ''] = orderAndBy.split('|');
		order = ord;
		orderBy = by;
	}

	order = (order || 'asc').toLowerCase();
	const keyMap = { order, orderBy, transportContext, ...params };
	if (orderBy) {
		keyMap.orderBy = orderBy;
	}

	const resultKey = `/${resourceName}/${JSON.stringify(keyMap)}/${includes}`;
	const store = stores[resultKey];

	resourceName = resourceName.replace('~', '');
	const nsp = namespace.indexOf('/') === 0 ? namespace.substring(1) : namespace;
	const NS = nsp.replace('~', '');

	if (store) {
		const { limit = 25 } = store as StoreState<T>;
		return getStore<T>({
			name: resourceName,
			params,
			order,
			orderBy,
			store,
			resultKey,
			namespace: NS,
			reverse,
			LIMIT: limit,
			transportContext,
			includes,
			resultTransformer,
			queryTransformer
		});
	}
	const defaultStoreData = {
		data: [] as T[],
		recordCount: 0,
		pages: 0,
		page: 1,
		limit: 25,
		loading: false,
		error: null
	} as StoreResult<T>;

	const fusedState = { ...defaultStoreData, ...initData };
	const newStore: StoreState<T> = $state<StoreState<T>>(fusedState);
	stores[resultKey] = newStore;
	const { limit = 25 } = fusedState;

	return getStore<T>({
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
		transportContext,
		resultTransformer,
		queryTransformer
	});
};
