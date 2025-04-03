import type { LayoutLoad } from './$types.js';
import pkg from "../../package.json" with { type: "json" };;
export const prerender = true;
export const load: LayoutLoad = () => {
    return { version: pkg.version };
};