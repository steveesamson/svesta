<script lang="ts">
	import type { User } from './types.js';
	import Item from './item.svelte';
	type Props = { users: User[] };
	let { users }: Props = $props();
</script>

<ul class="directories">
	{#if users}
		{#each users as user, i}
			<Item {...user} />
		{/each}
	{/if}
</ul>

<style>
	.directories {
		position: relative;
		border: none;
		list-style: none;
		padding: 0;
		margin: 16px auto;
	}

	@media screen and (min-width: 400px) {
		.directories {
			padding: 0 1rem;
		}
	}
	@media screen and (min-width: 600px) {
		.directories {
			display: grid;
			gap: 2px;
			grid-template-columns: repeat(2, minmax(auto, 1fr));
		}
	}
	@media screen and (min-width: 900px) {
		.directories {
			grid-template-columns: repeat(3, minmax(auto, 1fr));
		}
	}
</style>
