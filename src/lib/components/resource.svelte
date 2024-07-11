<script lang="ts" generics="T">
	import type { ResourceType } from '../types/index.js';
	let { store, resolve }:ResourceType<T> = $props();
</script>

{#if store && store.result}
	{@render resolve(store.result)}
{/if}
