<script lang="ts" generics="T">
	import type { Snippet } from 'svelte';
	import type { StoreResult, Store } from '$lib/types/index.js';

	type ResourceType<T> = { resolve: Snippet<[StoreResult<T>]>; store: Store<T> };
	let { store, resolve }: ResourceType<T> = $props();
</script>

{#if store && store.result}
	{@render resolve(store.result)}
{/if}
