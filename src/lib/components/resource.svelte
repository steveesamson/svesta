<script lang="ts">
	import type { StoreState, IStore, StoreMeta, SvelteComponentAsProp } from '../types/index.js';
	import { relative } from '../resource-action.js';
	import LoaderWithText from './loader-with-text.svelte';
	type T = $$Generic;
	interface $$Slots {
		default: { items: T[]; error: string | undefined; loading: boolean; meta: StoreMeta };
	}

	export let store: IStore<T>;
	export let LoaderComponent: SvelteComponentAsProp = {
		component: LoaderWithText,
		props: { text: 'Loading...' }
	};
	export let busy: 'blocked' | 'inline' | 'silent' = 'silent';
	export let meta: StoreMeta;

	$: storeDetail = $store as StoreState<T>;
	$: error = storeDetail.error ?? '';
	$: loading = storeDetail.loading ?? false;
	$: items = storeDetail.data ?? [];

	$: if (storeDetail) {
		meta = { page: storeDetail.page, pages: storeDetail.pages };
	}
</script>

<slot {items} {loading} {error} {meta} />
{#if loading}
	{#if busy === 'blocked'}
		<aside use:relative aria-busy="true">
			<svelte:component this={LoaderComponent.component} {...LoaderComponent.props} />
		</aside>
	{:else if busy === 'inline'}
		<svelte:component this={LoaderComponent.component} {...LoaderComponent.props} />
	{/if}
{/if}
{#if !!error}
	<p>{error}</p>
{/if}

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
