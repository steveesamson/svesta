import type { Params } from "$lib/index.js";

export type User = {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    avatar: string;
}

export type IngressType = {
	page: number;
	per_page: number;
	total: number;
	total_pages: number;
	data: Params;
};