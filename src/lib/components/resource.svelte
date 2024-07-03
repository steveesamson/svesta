<script lang="ts" generics="T">
	import type { Snippet } from 'svelte';
	import type { IStore, StoreResult } from '../types/index.js';

	let { 
		store, 
		resolve, 
	} = $props<{
		resolve: Snippet<[StoreResult<T>]>;	
		store:IStore<T>;
	}>();

</script>

{#if store && store.result}
	{@render resolve(store.result)}
{/if}
