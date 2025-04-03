<script lang="ts">
	import { network } from '../network.svelte.js';
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
	};
	let { children }: Props = $props();
</script>

{#if !network.status.online}
	{@render children()}
{/if}
