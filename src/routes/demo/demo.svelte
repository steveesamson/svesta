<script lang="ts">
	import { onMount } from 'svelte';
	import type { StoreMeta, Params, StoreProps } from '$lib/types/index.js';
	import { useStore } from '$lib/store.js';
	import Resource from '$lib/components/resource.svelte';
	import { resultTransformer } from './demo-assets/transformer.js';
	import Users from './demo-assets/users.svelte';
	import Item from './demo-assets/item.svelte';
	import type { User } from './demo-assets/types.js';

	let meta: StoreMeta;

	const usersProps: StoreProps<User> = {
		resultTransformer,
		queryTransformer: (raw: Params) => {
			return raw;
		}
	};
	const users = useStore<User>('users', usersProps);
	const handleNext = () => users.pageTo(meta.page + 1);

	const handlePrev = () => users.pageTo(meta.page - 1);

	const onMore = () => {
		users.next();
	};
	onMount(() => {
		users.sync();
	});
</script>

<h1 class="header"><strong>Svesta</strong> Demo</h1>
<Resource store={users} let:items bind:meta busy="blocked">
	<Users users={items} let:user>
		<Item {...user} />
	</Users>
	{#if meta}
		<div class="buttons">
			<button on:click={handlePrev} disabled={meta.page === 1}> Previous page</button>
			<button on:click={handleNext} disabled={meta.page === meta.pages}> Next page</button>
			<button on:click={onMore} disabled={meta.page === meta.pages}>more(append to view)...</button>
		</div>
	{/if}
</Resource>

<style>
	.header {
		padding: 1rem;
	}
	.buttons {
		text-align: center;
	}
	button {
		padding: 0.5rem 1rem;
		border-radius: 5px;
		border: 1px solid #ccc;
		background-color: #fff;
		cursor: pointer;
		font-size: 16px;
	}
</style>
