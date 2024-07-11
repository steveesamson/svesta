// from sveltekit
import { Transport } from '$lib/transport.js';
import type { PageLoad } from './$types.js';
import { resultTransformer } from './demo-assets/transformer.js';

export const load:PageLoad = async ({ fetch }) => {

	// This is happening on the server and we have a ref to a fetch
	// implementation, let's use it by passing it to the configure
	// method of Transport

	const transport  = Transport.instance({fetch});

	const { error , ...rest } = await transport.get('/users');

	return { ...resultTransformer(rest), error };

};