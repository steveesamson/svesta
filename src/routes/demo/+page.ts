// from sveltekit
import { Transport } from '$lib/transport.js';
import type { PageLoad } from './$types.js';
import { resultTransformer } from './demo-assets/transformer.js';
import type { User } from './demo-assets/types.js';
import type { StoreState } from '$lib/index.js';

export const load: PageLoad = async ({ fetch }): Promise<StoreState<User[]>> => {

	// This could be happening on the server and we have a ref to a fetch
	// implementation, let's use it by passing it to the configure
	// method of Transport

	const transport = Transport.instance({ fetch });

	const { error, ...rest } = await transport.get<User[]>('/users');

	return { ...resultTransformer(rest), error };

};