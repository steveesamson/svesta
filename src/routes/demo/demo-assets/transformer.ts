import type { Params } from "$lib/index.js";


export const resultTransformer = (raw: Params = {}) => {
    const { page, per_page: limit, total: recordCount, total_pages: pages, data } = raw;
    return { page, limit, recordCount, pages, data };
};
