<script lang="ts" generics="T extends WithID">
	import type { Snippet } from 'svelte';
	import type { StoreResult, Store } from '$lib/types/index.js';
	import type { WithID } from '$lib/types/internal.js';

	type ResourceType<R extends WithID> = {
		resolve: Snippet<[StoreResult<R>]>;
		store: Store<R>;
	};
	let { store, resolve }: ResourceType<T> = $props();
</script>

{#if store.result}
	{@render resolve(store.result)}
{/if}
