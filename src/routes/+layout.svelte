<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import type { LayoutProps } from './$types.js';
	import Offline from '$lib/components/offline.svelte';

	let { children, data }: LayoutProps = $props();

	let path = page.url.pathname;
</script>

<header>
	<nav>
		<div>
			<strong>Svesta</strong>
			<em>Svelte state library: v{data.version}</em>
		</div>
		<a href={`${base}/`} title="Svesta Docs" class={{ active: path === '/' }}>Svesta Docs</a>
		<a href={`${base}/demo`} title="Svesta Demo" class={{ active: path === '/demo' }}>Svesta Demo</a
		>
	</nav>
</header>
<main>
	<Offline>
		<p>You're offline.</p>
	</Offline>
	{@render children()}
</main>

<style>
	header {
		background-color: #adbbc8;
		/* background-color: #b5bccb; */
	}
	nav {
		display: flex;
		align-items: center;
		padding: 0.5rem 1rem;
	}
	nav a {
		color: #142f49;
		text-decoration: none;
		transition: all 0.37s ease-in-out;
		font-weight: 600;
	}
	nav a.active,
	nav a:hover {
		text-decoration: underline;
	}
	nav a:first-of-type {
		margin-inline-start: 1rem;
	}
	nav a:last-of-type {
		margin-inline-start: 1rem;
	}

	nav div strong {
		font-size: 2em;
		font-weight: 700;
		color: #142f49;
	}
	nav div em {
		display: block;
		text-align: center;
		font-style: normal;
	}
	:global(body) {
		/* background-color: #cbced5; */
		padding: 0;
		margin: 0;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		background-color: #efefef;
		width: 100%;
		text-align: center;
	}
	:global(pre) {
		padding: 1.5rem;
		margin-block: 1.5rem;
		margin-inline: 1rem;
		max-inline-size: 100%;
		border-radius: 0px;
		tab-size: 2;
		overflow-x: auto;
	}
	nav,
	main {
		margin-inline: auto;
		width: 100%;
		text-align: left;
	}
	main {
		position: relative;
		padding-block: 1rem;
	}

	:global(p),
	:global(li) {
		line-height: 1.65;
		font-size: 1rem;
	}
	:global(p > code),
	:global(li > code) {
		font-weight: 600;
		/* background-color: #b5bccb; */
		background-color: #cbd4dc;
		padding: 0.2rem 0.25rem;
		border-radius: 5px;
	}
	:global(h1),
	:global(h2),
	:global(h3) {
		margin-block-start: 3rem;
		margin-inline: 1rem;
	}

	@media screen and (min-width: 600px) {
		main,
		nav {
			width: min(100%, 60em);
		}
		nav {
			padding: 0.5rem 3rem;
		}
		nav div strong {
			font-size: 3em;
		}
		nav a:first-of-type {
			margin-inline-start: auto;
		}

		:global(pre) {
			border-radius: 8px;
		}

		:global(h1),
		:global(h2),
		:global(h3) {
			margin-inline: 0;
		}
	}
</style>
