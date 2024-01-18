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
	import { type StoreMeta, type StoreProps, type StoreState, Transport, useStore, Resource } from 'svesta';

	import { resultTransformer } from './sample/transformer.js';
	import Users from './sample/users.svelte';
	import Item from './sample/item.svelte';
	import type { User } from './sample/types.js';

	let meta: StoreMeta;

    const usersProps:StoreProps<User> = {
		resultTransformer
	};
	const users = useStore<User>('users', usersProps);

	const handleNext = () => users.pageTo(meta.page + 1);

	const handlePrev = () => users.pageTo(meta.page - 1);

	const onMore = () => users.next();
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

	import { type StoreMeta, type StoreProps, type StoreState, useStore, Resource } from 'svesta';

	import { resultTransformer } from './sample/transformer.js';
	import Users from './sample/users.svelte';
	import Item from './sample/item.svelte';
	import type { User } from './sample/types.js';

	export let data: PageData;

	let meta: StoreMeta;

    const usersProps:StoreProps<User> = {
		initData: data as StoreState<User>,
		resultTransformer
	};
	const users = useStore<User>('users', usersProps);

	const handleNext = () => users.pageTo(meta.page + 1);

	const handlePrev = () => users.pageTo(meta.page - 1);

	const onMore = () => users.next();
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

There are 5 major exported components in `svesta`, they are:

- `Transport`: A proxy for `fetch`, which starts as `fetch` but could migrate to `WebSocket`, especially, when using `useStore` with `Transport` `configure`d with `{ realTime: true }`.
- `useStore`: The main component of `svesta`. It is responsible for providing a `REST`ful interface for any `REST` API while supporting real-time data exchanges.
- `useEvents`: A `svelte store` that allows views exchange informations in a reliable manner.
- `networkStatus`: Another `svelte store` that allows the determination of network states like `true = online` and `false = offline`.
- `Resource`: A `svelte` component, which helps manage the network and resolution of promises to notify of `loading`, `errors` or `data` availability on success.

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
const { error, data } = await Trasport.post('/users', { name: 'Name', address: 'Some address' });
```

`Transport` also exposes an `isOnline` field indicative of whether network connection is available or not. This field changes with every network changes.

### 2. useStore

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

`useStore` maintains its internally structure as a `StoreState<T>`. In our example above, `T` is `User`. The structure as as shown below:

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

export const resultTransformer = (raw: Params = {}) => {
	const { page, per_page: limit, total: recordCount, total_pages: pages, data } = raw;
	return { page, limit, recordCount, pages, data };
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

- `.pageTo`: This synchronizes the store by fetching the `next/previous` page from the resource depending on `page` passed. This is typically a `GET` scoped to the resource only. When this executes, it populates the store and notifies all views depending on the store for appropriate view updates.
  > This is asynchronous, therefore, if you need the population before something else, you must `await` its call. Important to note also is that previous store data are replaced by the new result.

```ts
import { useStore, Resource, type StoreMeta } from 'svesta';
import type Account from '...';

let meta: StoreMeta;
const accounts = useStore<Account>('accounts',...);
const onNext = () => accounts.pageTo(meta.page + 1);
const onPrev = () => accounts.pageTo(meta.page - 1);
const onMore = () => accounts.next();
```

```html
<Resource store="{accounts}" let:items bind:meta busy="blocked">
	{#each items as account}
	<Item {...account} />
	{/each} {#if meta}
	<div class="buttons">
		<button on:click="{onPrev}" disabled="{meta.page === 1}">Previous page</button>
		<button on:click="{onNext}" disabled="{meta.page === meta.pages}">Next page</button>
		<button on:click="{onMore}" disabled="{meta.page === meta.pages}">
			more(append to view)...
		</button>
	</div>
	{/if}
</Resource>
```

- `.paginate`: This synchronizes the store by fetching the `next/previous` page from the resource depending on `offset` passed. This work with offsets. This is typically a `GET` scoped to the resource only. When this executes, it populates the store and notifies all views depending on the store for appropriate view updates.
  > This is asynchronous, therefore, if you need the population before something else, you must `await` its call. Important to note also is that previous store data are replaced by the new result.
- `.next`: This synchronizes the store by fetching the `next` page from the resource but rather than replace the store data like in the case of `.pageTo`, it appends result to the existing store data, useful in endless loading. This is typically a `GET` scoped to the resource only. When this executes, it populates the store and notifies all views depending on the store for appropriate view updates.

  > This is asynchronous, therefore, if you need the population before something else, you must `await` its call. Important to note also is that the new result is added/appended to the previous store data not replaced.

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
const { error, message, data, status } = await accounts.destroy({id:12345678});
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
onMount(async () =>{
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
onMount(async () =>{
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

### 3. Resource

Like mentioned earlier, `Resource`, a `svelte` component, which helps manage the network requests while using `useStore` to manage REST resources. `Resource` also handles resolution of promises and notify of `loading` during an on-going network request, `errors` on events of HTTP errors or `data` availability on success.

`Resource` accepts 4 props:

- `store`: An instance of `IStore<T>`, which by all means is a `svelte store`. This prop is required.
- `LoaderComponent`: This is an object of `SvelteComponentAsProp` type that is used to customize `Resource` loader component:

```ts
const loaderComponent: SvelteComponentAsProp = {
	component: LoaderWithText,
	props: { text: 'Loading...' }
};
```

`component` is of type svelte `ComponentType` while `props` is any object describing all the props of the `component`. `Resource` comes with a default `LoaderComponent` that is used when none is provided.

- `busy`: A string which can be any of `blocked`, `inline`, `silent`. The default is `silent`. `silent` indicates, do nothing while `Resource` is in `loading` state. `inline`, on the other hand, will display a
  `blocked` indicates that the component be blocked(disabled) for action when `Resource` is in `loading` state. This will typically draw an overlay over the content, displaying the `LoaderComponent`.
- `meta`: An object of type `StoreMeta` that exposes `page` i.e current page number of `Resource` store and `pages`, i.e total pages in a `Resource` store . It is shaped like:

```ts
import { type StoreMeta } from 'svesta';

export let meta: StoreMeta = { page: 1, pages: 1 };
```

Besides these props, `Resource` exposes the following `slot` props:

- `items`: An array of items in a `Resource` store when `Resource` resolves with no `error`.
- `loading`: A `boolean` indicative of on-going network request or not.
- `error`: A `string` that is non-empty whenever `Resource` resolves with some error.
- `meta`: `meta` was described as a prop but it is also exposed as a `slot` prop.

`Resource` is just a `svelte` component used as below:

```ts
// svelte file
<script>
import { type StoreMeta, useStore } from 'svesta';
import type Account from '...';

let meta: StoreMeta;
const accounts = useStore<Account>('some');

</script>
```

```html
<Resource store="{accounts}" let:items let:loading let:error let:meta bind:meta busy="blocked">
	<!-- make use of  -->
</Resource>
```

# TODO

At the moment, `Transport.configure` sets an app-wide settings for `svesta`, I love to implement a none-global configuration, a per-need type.
