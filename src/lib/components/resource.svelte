<script lang="ts" generics="T">
	import type { IStore, StoreResult } from '../types/index.js';
	// import type { Snippet } from 'svelte';

	type StoreType<T> = {
		resolve: (payload:StoreResult<T>) => void;	
		// resolve: Snippet<StoreResult<T>>;	giving error atm...
		store:IStore<T>;
	}

	let { 
		store, 
		resolve, 
	}:StoreType<T> = $props();
</script>

{#if store && store.result}
	{@render resolve(store.result)}
{/if}
