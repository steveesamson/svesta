<script lang='ts'>
	import type { PageProps } from "./$types.js"
	import Demo from './demo.svelte';
	const { data }:PageProps = $props();
</script>

<svelte:head>

<title>Svesta Demo</title>
<meta property="og:type" content="svesta demo" />
<meta property="og:title" content="Svesta demo" />
</svelte:head>

<Demo {data}/>

## Source code for svesta demo

### +layout.ts

While `Transport` setup could be done within your view's `$effect` or in your `+page.[j|t]s`, the recommended place to do the setup is the `+layout.[j|t]s` like below:

```ts
import { Transport } from 'svesta';
// This is configured on the default context
Transport.configure({ BASE_URL: 'https://reqres.in/api' });
export const prerender = true;
```

### +page.ts

```ts
// from sveltekit
import type { PageLoad } from './$types.js';

import { Transport } from 'svesta';
import { resultTransformer } from './demo-assets/transformer.js';

export const load: PageLoad = async ({ fetch }) => {
	// This is happening on the server and we have a ref to a fetch
	// implementation, let's use it by passing it to the configure
	// method of Transport

	// Note that we are using the default transport context here
	const transport = Transport.instance({ fetch });
	const { error, ...rest } = await transport.get('/users');
	return { ...resultTransformer(rest), error };
};
```

### +page.svelte

```ts

<script>
	// svelte
	import type { PageData } from './$types.js';

	import { type StoreProps, useStore, Resource, Loader, type StoreResult } from 'svesta';
	import { resultTransformer } from "./demo-assets/transformer.js";

	import UserList from './demo-assets/users.svelte';
	import type { User, IngressType } from './demo-assets/types.js';

	type ViewData = { data: StoreState<User>; }
	const { data }: ViewData = $props();

	const usersProps: StoreProps<User> = {
		resultTransformer,
		initData: data,
		queryTransformer(raw:IngressType){
			return raw;
		}
	};
	const users = useStore<User>( 'users', usersProps );



</script>

```

```js
{#snippet resolve({ data, page, pages, loading }:StoreResult<User>)}
	<UserList users={data} />

	{#if loading}
		<Loader  />
	{/if}
	{#if data}
		<div class="buttons">
			<button onclick={users.prev } disabled={page ===1 }>Previous page</button>
			<button onclick={users.next } disabled={page===pages }>Next page</button>
			<button onclick={users.more } disabled={ page === pages }>
				more(append to view)...
			</button>
		</div>
	{/if}
{/snippet}
<h1 class="header"><strong>Svesta</strong> Demo</h1>

<Resource store="{users}" {resolve} />
```

### transformer.js

```ts
import { type StoreResult } from 'svesta';
import type { IngressType, User } from './demo-assets/types.js';

export const resultTransformer = <User>(raw: IngressType): StoreResult<User> => {
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

export type IngressType = {
	page: number;
	per_page: number;
	total: number;
	total_pages: number;
	data: Params;
};
```

### users.svelte

```ts

<script>

	import type { User } from './types.js';
	import Item from './item.svelte';

	let { users }:{ users:User[] } = $props();

</script>

```

```js
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

	let { avatar, first_name, last_name, email }:User = $props();
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
