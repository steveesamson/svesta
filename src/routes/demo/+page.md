<script lang='ts'>
	import type { PageData } from "./$types.js"
	import Demo from './demo.svelte';
	const { data } = $props<{ data: PageData }>();
</script>

<svelte:head>

<title>Svesta Demo</title>
<meta property="og:type" content="svesta demo" />
<meta property="og:title" content="Svesta demo" />
</svelte:head>

<Demo {data}/>

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

	import { type StoreProps, useStore, Resource, Loader, type StoreResult } from 'svesta';
	import { resultTransformer } from "./demo-assets/transformer.js";

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

```

###

```html

{#snippet resolve({ data, page, pages, loading }:StoreResult<User>)}

	<UserList users={data} />

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
				more(append to view)...
			</button>
		</div>

	{/if}

{/snippet}

<h1 class="header">
	<strong>Svesta</strong> Demo
</h1>

<Resource store={users} {resolve} />

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
	import Item from './item.svelte';

	let { users } = $props<{ users:User[] }>();

</script>

```

```html

<ul class="directories">

	{#if users}

		{#each users as user, i }
			<Item {...user} />
		{/each}

	{/if}

</ul>

```

### item.svelte

```ts

<script>
	import type { User } from "./types.js";

	let { avatar, first_name, last_name, email } = $props<User>();
</script>

```

```html

<li class="directory">
	<div class="image">
		<img src={avatar} alt="user avatar" loading="lazy" />
	</div>
	<div class="detail">
		<strong>{first_name} {last_name}</strong>
		<em>{email}</em>
	</div>
</li>

```
