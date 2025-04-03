import type { Params, StoreResult } from "$lib/index.js";

export function resultTransformer<User>(raw: Params): StoreResult<User>{

    const { page, per_page: limit, total: recordCount, total_pages: pages, data } = raw;
    return { page, limit, recordCount, pages, data } as StoreResult<User>;
    
};
