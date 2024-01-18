<script>
	import Demo from './demo.svelte';
</script>

<svelte:head>

<title>Svesta Demo</title>
<meta property="og:type" content="svesta demo" />
<meta property="og:title" content="Svesta demo" />
</svelte:head>

<Demo />

## Source code for svesta demo

### +layout.ts

```ts
import { Transport } from 'svesta';
// This is a one-off, available throughtout app.
Transport.configure({ BASE_URL: 'https://reqres.in/api' });
```

### +page.svelte (no +page.ts)

```ts
<script>
	import { onMount } from 'svelte';
	import { type StoreMeta, type StoreProps, type StoreState, Transport, useStore, Resource } from 'svesta';

	import { resultTransformer } from './transformer.js';
	import Users from './users.svelte';
	import Item from './item.svelte';
	import type { User } from './types.js';

	let meta: StoreMeta;

    const usersProps:StoreProps<User> = {
		resultTransformer
	};
	const users = useStore<User>('users', usersProps);

	const handleNext = () => users.pageTo(meta.page + 1);

	const handlePrev = () => users.pageTo(meta.page - 1);

	const onMore = () => users.next();
	onMount(() => {
		users.sync();
	})
</script>
```

###

```html
<h1 class="header"><strong>Svesta</strong> Docs</h1>

<Resource store="{users}" let:items bind:meta busy="blocked">
	<Users users="{items}" let:user>
		<Item {...user} />
	</Users>
	{#if meta}
	<div class="buttons">
		<button on:click="{handlePrev}" disabled="{meta.page === 1}">Previous page</button>
		<button on:click="{handleNext}" disabled="{meta.page === meta.pages}">Next page</button>
		<button on:click="{onMore}" disabled="{meta.page === meta.pages}">
			more(append to view)...
		</button>
	</div>
	{/if}
</Resource>
```

### transformer.js

```ts
import type { Params } from 'svesta';

export const resultTransformer = (raw: Params = {}) => {
	const { page, per_page: limit, total: recordCount, total_pages: pages, data } = raw;
	return { page, limit, recordCount, pages, data };
};
```

### types.ts

```ts
export type User = {
	id: number;
	email: string;
	first_name: string;
	last_name: string;
	avatar: string;
};
```

### users.svelte

```ts
<script>
	import type { User } from './types.js';
	export let users: User[];
</script>
```

```html
<ul class="directories">
	{#if users} {#each users as user, i}
	<slot {user} />
	{/each} {/if}
</ul>
```

### item.svelte

```ts
<script>
	export let avatar: string = '';
	export let first_name: string = '';
	export let last_name: string = '';
	export let email: string = '';
</script>
```

```html
<li class="directory">
	<div class="image">
		<img src="{avatar}" alt="user avatar" loading="lazy" />
	</div>
	<div class="detail">
		<strong>{first_name} {last_name}</strong>
		<em>{email}</em>
	</div>
</li>
```
