<script lang="ts">
	import type { StoreResult, StoreProps, StoreState } from '$lib/types/index.js';
	import { useStore } from '$lib/store.svelte.js';
	import { resultTransformer } from "./demo-assets/transformer.js";
	import Loader from '$lib/components/block-loader.svelte';
	import Resource from '$lib/components/resource.svelte';
	import UserList from './demo-assets/users.svelte';
	import type { IngressType, User } from './demo-assets/types.js';
	
	type ViewData = { data: StoreState<User>; }
	const { data }: ViewData = $props();

	const usersProps: StoreProps<User> = {
		resultTransformer,
		initData: data,
		queryTransformer(raw:IngressType){
			return raw;  
		}
	};
	const users = useStore<User>( '/users', usersProps );
	

</script>


{#snippet resolve({ data, page, pages, loading, error }:StoreResult<User>) }
	
	<UserList users={ data } />	

	{#if loading}
		<Loader color='tomato'/>
	{/if}

	{#if error}
		<p>Error:{error}</p>
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
<section>
	<Resource store={users} { resolve }/>
</section>

<style>
	.header {
		padding: 1rem 0;
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
