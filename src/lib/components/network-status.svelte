<script lang="ts">
	import { networkStatus } from '$lib/network-status.svelte.js';
	import type { Snippet } from 'svelte';
    let { children } = $props<{ children: Snippet<[HTMLElement]> }>();
    
    let online = $state<boolean>(networkStatus.isOnline());

    networkStatus.onChange((state:boolean) => online = state)
 
</script>

{#if !online }
    {@render children() }
{/if}
