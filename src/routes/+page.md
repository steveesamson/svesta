<svelte:head>

<title>Svesta Home & Docs</title>
<meta property="og:type" content="svesta home" />
<meta property="og:title" content="Svesta home" />
</svelte:head>

# Svesta Docs

`svesta` - is a tiny `sve`lte `sta`te management library for `svelte/sveltekit`.

## Installation

```bash

# In your project directory
npm install svesta

```

or

```bash

# In your project directory
yarn add svesta

```

## Usage

Once you've added `svesta` to your project, use it as shown below, in your project:

### +page.svelte (without page.ts for data)

```ts

<script>

	import { onMount } from 'svelte';
	import { 
		type StoreProps, 
		Transport, 
		useStore, 
		Resource } 
		from 'svesta';

	import { resultTransformer } from './sample/transformer.js';
	import UserLists from './sample/users.svelte';
	import Item from './sample/item.svelte';
	import type { User } from './sample/types.js';


    const usersProps:StoreProps<User> = {
		resultTransformer
	};
	const users = useStore<User>('users', usersProps);

	const handleNext = () => users.next();
	const handlePrev = () => users.prev();
	const onMore = () => users.more();

	onMount(() => {
		// Ensure BASE_URL is already set on Transport
		// It is better done one time inside +layout.ts
		// instead of inside every view like the following
		Transport.configure({ BASE_URL: 'https://reqres.in/api'});
		users.sync();
	})
	
</script>

```

### +page.svelte (using page.ts for data)

```ts

<script>
    // from sveltekit
	import type { PageData } from './$types.js';

	import {  
		type StoreProps, 
		type StoreState, 
		useStore, 
		Resource 
		} from 'svesta';

	import { resultTransformer } from './sample/transformer.js';
	import UserLists from './sample/users.svelte';
	import Item from './sample/item.svelte';
	import type { User } from './sample/types.js';

	export let data: PageData;


    const usersProps:StoreProps<User> = {
		initData: data as StoreState<User>,
		resultTransformer
	};

	const users = useStore<User>('users', usersProps);

	const handleNext = () => users.next();
	const handlePrev = () => users.prev();
	const onMore = () => users.more();

</script>

```

### +page.ts

```ts

// from sveltekit
import type { PageLoad } from './$types.js';

import { Transport } from 'svesta';
import { resultTransformer } from './sample/transformer.js';

export const load: PageLoad = async ({ fetch }) => {

	// This is happening on the server and we have a ref to a fetch
	// implementation, let's use it by passing it to the configure
	// method of Transport

	Transport.configure({ BASE_URL: 'https://reqres.in/api', fetch });
	const { error, ...rest } = await Transport.get('/users');
	return { ...resultTransformer(rest), error };

};

```

```html

{#snippet resolve({ data, loading, error, page, pages })}

	<UserList users={data} />

	{#if loading}

		<p>Loading data...</p>

	{/if}

	{#if data}
	<div class="buttons">
		<button onclick={ handlePrev } disabled={ page === 1}> 		
			Previous page
		</button>
		<button onclick={ handleNext } disabled={ page === pages}> 
			Next page
		</button>
		<button onclick={ onMore } disabled={ page === pages }>
			more(append to view)...
		</button>
	</div>
	{/if}

	{#if error}

		<h4>Oh, error?</h4>
		<p>{error}</p>

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

There are 5 major exported components in `svesta`, they are:

- `Transport`: A proxy for `fetch`, which starts as `fetch` but could migrate to `WebSocket`, especially, when using `useStore` with `Transport` `configure`d with `{ realTime: true }`.
- `Resource`: A `svelte` component, which helps manage the network and resolution of promises to notify of `loading`, `errors` or `data` availability on success.
- `useStore`: The main component of `svesta`. It is responsible for providing a `REST`ful interface for any `REST` API while supporting real-time data exchanges.
- `useEvents`: A `svelte runes` that allows views exchange informations in a reliable manner.
- `networkStatus`: Another `svelte store` that allows the determination of network states like `true = online` and `false = offline`.


Let us examine each component in detail.

### 1. Transport

`Transport` is useful in requesting any arbitrary HTTP(S) endpoint. `Transport` exposes a `configure` method that allows the customization of HTTP(S) requests. Such customization could be achieved as below:

```ts
import { type TransportConfig, Transport } from 'svesta';
const configOptions:TransportConfig = {
    // Log out details or not. Default is false.
    DEBUG: true;
    // Set the base URL. Default is ''.
    BASE_URL: 'https://some-base-url';
    // External fetch implementation could be passed.
    // Default is undefined.
    // Either window.fetch or fetch from
    // +page.[t|j]s' onload as shown in our example.
    fetch: window.fetch;
    // Allow or disallow migration to web socket.
    // Default is false.
    realTime: false;
    // Allows the override of the base fetch RequestInit.
    // Default is undefined.
    init: RequestInit;

};
Transport.configure(configOptions);
```

`Transport` competently handles `GET`, `POST`, `PUT`, `PATCH`, `OPTIONS` and `DELETE` HTTP methods via the exposed methods: `.get`, `.post`, `.put`, `.patch`, `.delete`, `.options` and `.upload`. An example could look like the following:

```ts

const { error, data } = await Trasport.post(
	'/users', 
	{ name: 'Name', address: 'Some address' }
);

```

`Transport` also exposes an `isOnline` field indicative of whether network connection is available or not. This field changes with every network changes.

### 2. Resource

As mentioned earlier, `Resource`, is a `svelte` component, which helps manage the network requests while using `store` to manage REST resources. `Resource` also handles resolution of promises and notify of `result` during an on-going network request, `errors` on events of HTTP `errors` or `data` availability on success.

`Resource` accepts 2 props:

- `store`: A type of `IStore<T>`, which by all means is an instance of `useStore`. This prop is required.
- `resolve`: A `svelte runes snippet` that get called when `Resource` resolves the `store` passed to it. It is responsible for rendering the data from `store` when store resolves. This prop is required.

See example in demo app.


`Resource` is just a `svelte` component used as below:

```ts
// svelte file
<script>
import { useStore } from 'svesta';
import type Account from '...';

const accounts = useStore<Account>('some');

</script>

```

```html

{#snippet resolve({ data, loading, error, page, pages })}

	<AccountList users={data} />

	{#if loading}

		<p>Loading data...</p>

	{/if}

	{#if data}
	<div class="buttons">
		<button onclick={ accounts.prev } disabled={ page === 1}> 		
			Previous page
		</button>
		<button onclick={ accounts.next } disabled={ page === pages}> 
			Next page
		</button>
		<button onclick={ accounts.more } disabled={ page === pages }>
			more(append to view)...
		</button>
	</div>
	{/if}

	{#if error}

		<h4>Oh, error?</h4>
		<p>{error}</p>

	{/if}

{/snippet}

<Resource store={accounts} resolve={resolve} />

```

### 3. useStore

If the target of requests are `REST`ful APIs, then the appropriate component from `svesta` is the `useStore`. `useStore` defines 2 parameters:

- `resourceName`: This is a `string` that represents the name (not path please) of REST resource. This is required.
- `storeOption`: This is a `StoreProps<T>`, explained in detail below. This is optional.

> Note: `useStore` uses `Transport` under the hood, therefore, configurations set on `Transport` also affect `useStore`.

```ts
import { type StoreProps, useStore } from 'svesta';

// Create a store props
const usersProps: StoreProps<User> = {
	// Parameters. Default {}
	params: {},
	// Query order asc, desc or [asc|desc]|<field>
	// e.g "desc|id". Default is 'asc'
	orderAndBy: 'asc',
	// namespace allows you proxy a resource with another name
	// E.g. 'profile' could still be used as 'users' namespace.
	// That is profile is not known to you system but 'users'
	// namespace defaults to ''.
	namespace: '',
	// You can pre-populate a store by passing `initData`.
	// It defaults to {}
	initData: {},
	// includes helps control what fields are returned
	// It is pipe-separated string of resource names.
	// resource name is comma-saparate string of fields
	// E.g. 'users:name, age, gender | accounts: accountId, balance' where
	// users and accounts are resource names and their fields are listed after `:`
	// The above example is for when there are relationship
	// in multiple resources(join).
	// It defaults to ''.
	includes: '',
	// resultTransformer is a function you can pass
	// to intercept and convert the data from your API to what
	// `useStore` understands, the StoreState type.
	// This is important when using the `.sync` method of store
	// to synchronize/fetch data from your APIs.
	// It accepts the raw data from your API and
	// returns the transformed data. See transformer.js above.
	// It defaults to undefined
	resultTransformer: undefined,
	// queryTransformer is a function you can pass
	// to intercept and convert your query to what your API expects.
	// This is important when using the `.sync` method of store
	// to synchronize/fetch data from your APIs.
	// It accepts the raw query and
	// returns the transformed query for your API.
	// It defaults to undefined
	queryTransformer: undefined
};
// Let's create a users store
const users = useStore(
	// resource name, not path please. Required
	'users',
	// store props. Optional
	usersProps
);

// Of all the store arguments, the `resource name` is mandatory
// StoreProps is optional and could be omitted, for instance:
const people = useStore('users');
```

`useStore` maintains its internal structure as a `StoreState<T>`. In our example above, `T` is `User`. The structure as as shown below:

```ts
type StoreState<T> = {
	// result target
	data: T[];
	// total record count
	recordCount: number;
	// Number of pages for limit per page
	pages?: number;
	// What page number are we on?
	page?: number;
	// Record per page
	limit?: number;
	// Are we processing network?
	loading?: boolean;
	// Are there error based on request
	error?: string | null | undefined;
	// Params that produced result or error
	params?: Params;
};
```

The reason for a `resultTransformer`, is to convert API responses that do not conform to `StoreState<T>`. Look at the API in our example, that is, [regres.in](https://reqres.in/api). `regres.in` API returns its response as:

```ts
type IngressType = {
	page: number;
	per_page: number;
	total: number;
	total_pages: numbers;
	data: unknow;
};
```

However, `useStore` cannot store data like this, hence, the need to implement a result transformer to convert as below:

```ts
export const resultTransformer = (raw: Params = {}) => {
	// raw is what comes from regres.in
	const { page, per_page: limit, total: recordCount, total_pages: pages, data } = raw;
	// return what conforms to StoreState
	return { page, limit, recordCount, pages, data };
};
```

`useStore` exposes `result`, which is a state object comprising of:
- `loading`: A `boolean` indicative of on-going network request or not.
- `error`: A `string` that is non-empty whenever `store` request resolves with some error.
- `data`: An object of type `T[]` representing the data from API when store request resolves with no `error`.

Typically, `store` is just as follows, without the use of `Resource` and `Snippets`:

```ts

import { useStore } from 'svesta';

const { sync, result: { loading, data, error } } = useStore("users");
$effect(() =>{
	sync();
});

```

```html
	<header>Users</header>
	{#if loading}
		<p>Loading users...</p>
	{/if}
	{#if !!error}
		<p>Error:{error}</p>
	{/if}
	{#if data }
		{#each users as user}
			<p>Name: {user.first_name} {user.last_name} </p>
		{/each}
	{/if}
```

`useStore` exposes the following methods:
- `.sync`: This synchronizes the store by fetching the first page from the resource. This could also be used to pre-populate the store by passing data. This is typically a `GET` scoped to the resource only. When this executes, it populates the store and notifies all views depending on the store for appropriate view updates.
  > This is asynchronous, therefore, if you need the population before something else, you must `await` its call.

```ts
import { useStore } from 'svesta';
import type Account from '...';

const accounts = useStore<Account>('accounts',...);
// force sync
accounts.sync();
// or with initial data
// initData is of type StoreState<Account>
accounts.sync(initData)
```

- `.next`: This synchronizes the store by fetching the `next` page from the resource depending. This is typically a `GET` scoped to the resource only. When this executes, it populates the store and notifies all views depending on the store for appropriate view updates.
  > This is asynchronous, therefore, if you need the population before something else, you must `await` its call. Important to note also is that previous store data are replaced by the new result.

- `.prev`: This synchronizes the store by fetching the `previous` page from the resource depending. This is typically a `GET` scoped to the resource only. When this executes, it populates the store and notifies all views depending on the store for appropriate view updates.
  > This is asynchronous, therefore, if you need the population before something else, you must `await` its call. Important to note also is that previous store data are replaced by the new result.

- `.more`: This synchronizes the store by fetching `more` pages from the resource but rather than replace the store data like in the case of `.next` or `.prev`, it appends result to the existing store data, useful in endless loading. This is typically a `GET` scoped to the resource only. When this executes, it populates the store and notifies all views depending on the store for appropriate view updates.

  > This is asynchronous, therefore, if you need the population before something else, you must `await` its call. Important to note also is that the new result is added/appended to the previous store data not replaced.
```ts
import { useStore, Resource } from 'svesta';
import type Account from '...';

const accounts = useStore<Account>('accounts',...);
const onNext = () => accounts.next();
const onPrev = () => accounts.prev();
const onMore = () => accounts.more();
```

```html

{#snippet resolve({ loading, data, error, page, pages })}
	{#if data}
		<AccountList users={data} />
		<div class="buttons">

			<button onclick={ handlePrev } disabled={ page === 1 }> 
				Previous page
			</button>
			<button onclick={ handleNext } disabled={ page === pages }> 
				Next page
			</button>
			<button onclick={ onMore } disabled={ page === pages }>
				More(append to view)...
			</button>
			
		</div>
	{/if}
	{#if loading}
		<p class='spinner'>Fetching data...</p>
	{if}
	{#if error}
		<p class='danger'>Error: {error}</p>
	{if}
	
{/snippet}

<Resource store={accounts} {resolve} />

```

- `.pageTo`: This synchronizes the store by fetching the `next/previous` page from the resource depending on `offset` passed. This work with offsets. This is typically a `GET` scoped to the resource only. When this executes, it populates the store and notifies all views depending on the store for appropriate view updates.
  > This is asynchronous, therefore, if you need the population before something else, you must `await` its call. Important to note also is that previous store data are replaced by the new result.


- `.save`: This does a scoped `POST` or `PUT` based on resource. For new data, i.e, data without `id`, it does `POST` otherwise, it does a `PUT`. When this executes, it updates the store and notifies all views depending on the store for appropriate view updates. It returns a `Promise<TransportResponse<T>>`.
  > This is asynchronous, therefore, if you need the saving before something else, you must `await` its call.

```ts
import { useStore } from 'svesta';
import type Account from '...';

const accounts = useStore<Account>('accounts',...);
// Fire and forget
accounts.save({accountName:'Account Name', accountNo:1234});

// Fire and inspect
const { error, message, data, status } = await accounts.save({accountName:'Account Name', accountNo:1234});
// Do something with fields

```

- `.destroy`: This does a scoped `DELETE` based on resource. It expects a `WithID` type that must contain the `id`. When this executes, it updates the store and notifies all views depending on the store for appropriate view updates. It returns a `Promise<TransportResponse<T>>`.
  > This is asynchronous, therefore, if you need the saving before something else, you must `await` its call.

```ts
import { useStore } from 'svesta';
import type Account from '...';

const accounts = useStore<Account>('accounts',...);
// Fire and forget
accounts.destroy({id:12345678});

// Fire and inspect
const { 
	error, 
	message, 
	data, 
	status 
	} = await accounts.destroy({id:12345678});
// Do something with fields

```

- `.search`: This does a scoped `GET` based on resource but appends a `&search=<searchTerm>` to the endpoint. It expects a `searchTerm`, a string. When this executes, it updates the store and notifies all views depending on the store for appropriate view updates. It returns a `Promise<void>`.

```ts
import { useStore } from 'svesta';
import type Account from '...';

const accounts = useStore<Account>('accounts',...);
// Fire and forget
// Seach can be added and customized via `queryTransformer`
accounts.search('google');
```

- `.get`: This does a scoped `GET` based on resource but appends the passed `path` to resource `url`. When this executes, it does not updates the store. It returns a `Promise<TransportResponse<T>>`.

```ts
import { onMount } from 'svelte';
import { useStore } from 'svesta';
import type Account from '...';

const accounts = useStore<Account>('accounts',...);
onMount(async () => {
    // The following will make a GET request to `/accounts/checking`
    // path using the passed params
    const { data, error} = await accounts.get('/checking',{...});
})
```

- `.post`: This does a scoped `POST` based on resource but appends the passed `path` to resource `url`. When this executes, it does not updates the store. It returns a `Promise<TransportResponse<T>>`.

```ts
import { onMount } from 'svelte';
import { useStore } from 'svesta';
import type Account from '...';

const accounts = useStore<Account>('accounts',...);
onMount(async () => {
    // The following will make a request to POST `/accounts/checking`
    // path using the passed params
    const { data, error} = await accounts.post('/checking',{...});
})
```

- `.find`: This does searches the store to locate the first item that match the search `value`, using the passed `key` or `undefined` when there are no match. `HTTP` request could be involved, especially if store was not `sync`ed yet. It returns a `Promise<T | undefined>`.
  > This is asynchronous, therefore, you must `await` its call.

```ts
import { useStore } from 'svesta';
import type Account from '...';

const accounts = useStore<Account>('accounts',...);
// Seach for `12345` on the `accountId` field
const targetAccount = await accounts.find(key:'accountId', value:12345);
// Check and use targetAccount
```

- `.filter`: This does filtering based on passed `query` param of type `Partial<T>`. `HTTP` request is involved. It returns a `void`. When this executes, it updates the store and notifies all views depending on the store for appropriate view updates.

```ts
import { useStore } from 'svesta';
import type Account from '...';

const accounts = useStore<Account>('accounts',...);
// Filters for  `accountName` that equals 'Steve Samson'
 accounts.filter({accountName:'Steve Samson'});
```

- `.on`: This does allows the registering of event listeners on stores so we can react to those events should they fire. Possible events are `refresh`, `create`, `destroy`, `update`.

```ts
import { type EventHandler, useStore } from 'svesta';
import type Account from '...';

const accounts = useStore<Account>('accounts',...);
const onAccountUpdate:EventHandler = (account:Account) =>{
    console.log(`${account} was updated!`);
};

// onAccountUpdate will be called when update
// happens on any account in the store
accounts.on('update',onAccountUpdate);
```

- `.debug`: This logs store info to the console. Useful during dev.
  The following methods of store do not make network requests when used but they propagate changes to the view. They are added for the purpose of prototyping without persistence. These methods are:
- `.add`: Add items to store
- `.remove`: Removes specific item from store
- `.patch`: Updates specific item in store

```ts

import { type EventHandler, useStore } from 'svesta';
import type Account from '...';

const accounts = useStore<Account>('accounts',...);
// id is required
const account = {accountName:'Account Name', accountNo:2345566, id:new Date().getTime()};
accounts.add(account);
accounts.patch({...account, accountName:'Updated Account Name'});
accounts.remove(account);
```



# TODO

At the moment, `Transport.configure` sets an app-wide settings for `svesta`, I love to implement a none-global configuration, a per-need type.
