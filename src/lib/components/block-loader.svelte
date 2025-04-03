<script lang="ts">
	import { relative } from '../resource-action.svelte.js';
	import Loader from './loader.svelte';
	type Props = { text?: string; size?: number };

	let { size = 18, text = 'Loading...' }: Props = $props();
</script>

<aside use:relative aria-busy="true">
	<Loader {...{ size, text }} />
</aside>

<style>
	aside {
		position: absolute;
		inset: 0;
		backdrop-filter: blur(3px);
		display: grid;
		place-items: center;
		transition: transform 0.37s ease-in-out;
		transform: scale(0);
	}
</style>
