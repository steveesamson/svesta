import type { Params, StoreResult } from '$lib/index.js';
import { type User } from './types.js';

export function resultTransformer(raw: Params): StoreResult<User> {
	const { page, per_page: limit, total: recordCount, total_pages: pages, data } = raw;
	return { page, limit, recordCount, pages, data } as StoreResult<User>;
}
