<script lang="ts">
	import { relative } from "$lib/resource-action.js";
    import LoaderWithText from "./loader.svelte";

	let { size = 18, text = 'Loading...', color = "#333333" } = $props();

</script>
<aside use:relative aria-busy="true">
    <svelte:component this={LoaderWithText} {...{ size, text, color} } />
</aside>

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

