<script lang="ts">
	import type { Params, StoreProps } from '$lib/types/index.js';
	import { useStore } from '$lib/store.svelte.js';
	import { resultTransformer } from "./demo-assets/transformer.js";
	import Loader from '$lib/components/block-loader.svelte';
	import Resource from '$lib/components/resource.svelte';
	import UserList from './demo-assets/users.svelte';
	import type { User } from './demo-assets/types.js';


	const usersProps: StoreProps<User> = {
		resultTransformer,
		queryTransformer: (raw: Params) => {
			return raw;  
		}
	};
	const users = useStore<User>( 'users', usersProps );

	$effect(() => {
		users.sync();
	});
</script>


{#snippet resolve({ data, page, pages, loading }) }
	
	<UserList users={ data } />	
	{#if loading}
		<Loader color='tomato'/>
	{/if}
	{#if data}
		<div class="buttons">
			<button onclick={ users.prev } disabled={ page === 1 }> 
				Previous page
			</button>
			<button onclick={ users.next } disabled={ page === pages }> 
				Next page
			</button>
			<button onclick={ users.more } disabled={ page === pages }>
				More(append to view)...
			</button>
		</div>
	{/if}
{/snippet}

<h1 class="header">
	<strong>Svesta</strong> Demo
</h1>

<Resource store={users} { resolve }/>

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
