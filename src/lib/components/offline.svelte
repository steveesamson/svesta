<script lang="ts">
	import { network } from '../network.svelte.js';
	import type { Snippet } from 'svelte';
    let { children } = $props<{ children: Snippet<[HTMLElement]> }>();
    
</script>

{#if !network.status.online }
    {@render children() }
{/if}
