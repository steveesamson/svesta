import { Transport } from '$lib/transport.js';
import { beforeSend } from '$lib/utils.js';


Transport.configure({ BASE_URL: 'https://reqres.in/api', beforeSend });
export const prerender = true;
