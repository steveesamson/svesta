<svelte:head>

<title>Svesta Home & Docs</title>
<meta property="og:type" content="svesta home" />
<meta property="og:title" content="Svesta home" />
</svelte:head>

# svesta

`svesta` - is a tiny `sve`lte `sta`te management library for `svelte/sveltekit`.

## Installation

```bash
# In your project directory
npm install svesta

or

# In your project directory
yarn add svesta
```

There are 6 major exported components in `svesta`, they are:

- `Transport`: This allows the creation of requests, which starts as `fetch` but could migrate to `WebSocket`, especially, when `Transport` is `configure`d with a realTime as in `{ realTime: { transport:['websocket','polling'],... } }`. `realTime` accepts valid valid `socket.io-client` props.

- `useStore`: The main component of `svesta`. It is responsible for creating reactive stores for providing a `REST`ful interface for any `REST` API while supporting real-time data exchanges.

- `Resource`: `Resource` is a `svelte` component, which helps manage the network and resolution of promises to notify of `loading`, `errors` or `data` availability on success.

- `useEvents`: This allows components exchange informations in a reliable manner, using events.

- `network`: `network` allows the determination of network states. It exposed a `status` attribute that helps you do that. For instance, when `network.status.online` is `true => online` and `false => offline`.

- `Offline`: A `svelte` component, which displays its `children` when `network.status.online` is `false`. It helps in monitoring network activities.

Let us examine each component in detail.

### 1. Transport

`Transport` is useful in requesting any arbitrary HTTP(S) endpoint. `Transport` exposes 2 methods, `configure` and `instance`:

- `configure`: It allows the customization of HTTP(S) requests. Such customization could be achieved as below, especially in your `+layout.[t|j]s`:

```ts
import { type TransportConfig, Transport } from 'svesta';

const configOptions: TransportConfig = {
	// Log out details or not. Default is false.
	DEBUG: true,
	// Set the base URL. Default is ''.
	BASE_URL: 'https://some-base-url',
	// External fetch implementation could be passed.
	// Default is undefined.
	// Either window.fetch or fetch from
	// +page.[t|j]s' onload as shown in our example.
	fetch: window.fetch,
	// Allow or disallow migration to web socket.
	// Default is undefined.
	realTime: { transport: ['websocket'] },
	// Allows the override of the base fetch RequestInit.
	// Default is undefined.
	init: RequestInit,
	// If you do not want the transport to be a top-level(default)
	// one, tag it with a context
	// This allows you have multiple transport instances.
	context: 'news' // This is used in accessing the instance later
	// A function that allows user set headers before sending requests
	beforeSend(headers:Params){
	}
};

Transport.configure(configOptions);
```

> Best practices favors doing all your Transport configuration in the `+layout.[t|j]s` in a manageable way. While `Transport.configure` could be done within your view's `$effect` or in your `+page.[j|t]s`, the recommended place to do the setupu is the `+layout.[j|t]s` like below:

#### In +layout.ts

```ts
import { Transport } from 'svesta';

// This is configured on the default context
Transport.configure({ BASE_URL: 'https://reqres.in/api' });

export const prerender = true;
```

- `instance`: By default, `Transport` creates a `default` instance, which gets returned when no argument is passed to `instance`. If you do not want the transport to be a top-level(default) one, tag it with a context. This allows you have multiple transport instances. The field is also used in accessing the instance later. `instance` accepts either a `TransportInstanceProps` type.

```ts
import { Transport } from 'svesta';

// Just for news, as configured above
const newsTransport = Transport.instance('news');
```

#### In +page.[t|j]s

Transport `instance` plays well with `+page.[t|j]s` allowing us to specify what `fetch` to use.

##### Default context

```ts
// from sveltekit
import { Transport } from 'svesta';
import type { PageLoad } from './$types.js';
import { resultTransformer } from '..';

export const load: PageLoad = async ({ fetch }) => {
	// This is happening on the server and we have a ref to a fetch
	// implementation, let's use it by passing it to the configure
	// method of Transport

	//Default transport
	const transport = Transport.instance({ fetch });

	const { error, ...rest } = await transport.get('/users');

	return { ...resultTransformer(rest), error };
};
```

##### News context

```ts
// from sveltekit
import { Transport } from 'svesta';
import type { PageLoad } from './$types.js';
import { resultTransformer } from '..';

export const load: PageLoad = async ({ fetch }) => {
	// This is happening on the server and we have a ref to a fetch
	// implementation, let's use it by passing it to the configure
	// method of Transport

	// Scoped only for news
	// Must have been configured too

	// Let's even use beforeSend
	const token = 'some-token';
	const beforeSend = (headers: Params) => {
		headers['authorization'] = `Bearer ${token}`;
	};
	const transport = Transport.instance({ context: 'news', fetch, beforeSend });

	const { error, ...rest } = await transport.get('/users');

	return { ...resultTransformer(rest), error };
};
```

`Transport` competently handles `GET`, `POST`, `PUT`, `PATCH`, `OPTIONS` and `DELETE` HTTP methods via the exposed methods: `.get`, `.post`, `.put`, `.patch`, `.delete`, `.options` and `.upload`. An example could look like the following:

```ts
// Using the default instance
const { error, data } = await Trasport.instance().post('/users', {
	name: 'Name',
	address: 'Some address'
});
```

```ts
// Using some context(news) instance
const newsTransport = Transport.instance('news');
const { error, data } = await newsTransport.post('/users', {
	name: 'Name',
	address: 'Some address'
});
```

> Note that you must have configured the `news` transport `context` before using it like so:

```ts
Transport.configure({context:'news',....});
```

`Transport` also exposes a `loading`, which actually, is a field indicative of whether an active request is happening.

### 3. useStore

If the target of requests are `REST`ful APIs, then the appropriate component from `svesta` is the `useStore`. `useStore` defines 2 parameters:

- `resourceName`: This is a `string` that represents the name or path of REST resource. This is required.
- `storeOption`: This is a `StoreProps<T>`, explained in detail below. This is optional.

> Note: `useStore` uses `Transport` under the hood, therefore, configurations set on `Transport.configure` also affect `useStore`.

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
	// You can pre-populate a store by passing `initData`
	// of StoreState<T> type
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
	// resultTransformer is a StoreResultTransformer type, a function you can pass
	// to intercept and convert the data from your API to what
	// `useStore` understands, the StoreState type.
	// This is important when using the `.sync` method of store
	// to synchronize/fetch data from your APIs.
	// It accepts the raw data from your API and
	// returns the transformed data. See transformer.js above.
	// It defaults to undefined
	resultTransformer: undefined,
	// queryTransformer is a StoreQueryTransformer type, a function you can pass
	// to intercept and convert your query to what your API expects.
	// This is important when using the `.sync` method of store
	// to synchronize/fetch data from your APIs.
	// It accepts the raw query and
	// returns the transformed query for your API.
	// It defaults to undefined
	queryTransformer: undefined,
	//Specifies transport context
	transportContext: undefined
};

// Let's create a users store
const users = useStore(
	// resource name, not path please. Required
	'users',
	// store props. Optional
	usersProps
);

// Of all the store arguments, the `resource name/path` is mandatory
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
	transportContext?: string;
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
export const resultTransformer = <User>(raw: IngressType): StoreResult<User> => {
	// raw is what comes from regres.in
	const { page, per_page: limit, total: recordCount, total_pages: pages, data } = raw;
	// return what conforms to StoreState
	return { page, limit, recordCount, pages, data };
};
```

> Note: You can register a global resultTransformer, by using the `useGlobalResultTransformer` hook.

> You can equally register a global queryTransformer, by using the `useGlobalQueryTransformer` hook.

`useStore` exposes `result`, which is a state object comprising of:

- `loading`: A `boolean` indicative of on-going network request or not.
- `error`: A `string` that is non-empty whenever `store` request resolves with some error.
- `data`: An object of type `T[]` representing the data from API when store request resolves with no `error`.

```ts
import { useStore } from 'svesta';

const {
	sync,
	result: { loading, data, error }
} = useStore('users');
$effect(() => {
	sync();
});
```

```js
<header>Users</header>
{#if loading}
	<p>Loading users...</p>
{/if}

{#if !!error}
	<p>Error:{error}</p>
{/if}

{#if data }
	{#each users as user}
		<p>Name: {user.first_name} {user.last_name}</p>
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
import { useStore, Resource, type StoreResult } from 'svesta';
import type Account from '...';

const accounts = useStore<Account>('accounts',...);
const onNext = () => accounts.next();
const onPrev = () => accounts.prev();
const onMore = () => accounts.more();
```

Using `Resource`(we'll explain next), we can have the following:

```js
{#snippet resolve({ loading, data, error, page, pages }:StoreResult<Account>)}
	{#if data}
		<AccountList users="{data}" />
		<div class="buttons">

			<button onclick={accounts.prev } disabled={page ===1 }>Previous page</button>
			<button onclick={accounts.next } disabled={page===pages }>Next page</button>
			<button onclick={accounts.more } disabled={ page === pages }>
				more(append to view)...
			</button>

		</div>
	{/if}
	{#if loading}
		<p class="spinner">Fetching data...</p>
	{if}
	{#if error}
		<p class="danger">Error: {error}</p>
	{if}
{/snippet}

<Resource store="{accounts}" {resolve} />
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

import { useStore } from 'svesta';
import type Account from '...';

const accounts = useStore<Account>('accounts',...);
$effect(async () => {
    // The following will make a GET request to `/accounts/checking`
    // path using the passed params
    const { data, error} = await accounts.get('/checking',{...});
})
```

- `.post`: This does a scoped `POST` based on resource but appends the passed `path` to resource `url`. When this executes, it does not updates the store. It returns a `Promise<TransportResponse<T>>`.

```ts
import { useStore } from 'svesta';
import type Account from '...';

const accounts = useStore<Account>('accounts',...);
$effect(async () => {
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

The following methods of store do not make network requests when used but they propagate changes to the view. They are added for the purpose of prototyping without persistence. These methods are:

- `.debug`: This logs store info to the console. Useful during dev.
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

As mentioned earlier, `Resource`, is a `svelte` component, which helps manage the network requests while using `store` to manage REST resources. `Resource` also handles resolution of promises and notify of `result` during an on-going network request, `errors` on events of HTTP `errors` or `data` availability on success.

`Resource` accepts 2 props:

- `store`: A type of `Store<T>`, which by all means is an instance of `useStore`. This prop is required.
- `resolve`: A `svelte runes snippet` of type `Snippet<[StoreResult<T>]>` that get called when `Resource` resolves the `store` passed to it. It is responsible for rendering the data from `store` when store resolves. This prop is required.

See example in demo app.

`Resource` is just a `svelte` component used as below:

```ts
// svelte file
<script>
import { useStore, type StoreResult } from 'svesta';
import type Account from '...';

const accounts = useStore<Account>('some');

</script>

```

```js
{#snippet resolve({ data, loading, error, page, pages }:StoreResult<Account>)}

	<AccountList users="{data}" />

	{#if loading}
	<p>Loading data...</p>
	{/if}

	{#if data}
		<div class="buttons">
			<button onclick={accounts.prev } disabled={page ===1 }>Previous page</button>
			<button onclick={accounts.next } disabled={page===pages }>Next page</button>
			<button onclick={accounts.more } disabled={ page === pages }>
				more(append to view)...
			</button>
		</div>
	{/if}
	{#if error}
	<h4>Oh, error?</h4>
	<p>{error}</p>
	{/if}
{/snippet}

<Resource store="{accounts}" resolve="{resolve}" />
```

### 4. useEvents

`useEvents`: This allows components exchange informations in a reliable manner, using events rather than passing props. For instance, see the following:

```ts
 import {type UseEvent, useEvents } from "svesta";
 // Here loading is the scope of the created event
 const loadEvent: UseEvent<boolean> = useEvents<boolean>('loading', false);
 ...
 ...
 function start(){
	loadEvent.value = true;
 }
 function done(){
	loadEvent.value = false;
 }

```

In another component, we can track and use the created `loadEvent` like so:

```ts
<script>
 import {type UseEvent, useEvents } from "svesta";
 // Here loading is the scope of the created event
 const loader: UseEvent<boolean> = useEvents<boolean>('loading', false);
</script>
```

```html
{#if loader.value}
<p>Loading...</p>
{/if}
```

### 5. network

`network` allows the determination of network states. It exposed a `status` attribute that helps you do that. For instance, when `network.status.online` is `true => online` and `false => offline`. This can be used both in view and non-view components. For instance, the `Offline` component was build by using `network`.

### 6. Offline

This is a `svelte` component, which displays its `children` when `network.status.online` is `false`. It helps in monitoring network activities in view components. The usage as as shown below:

```ts
import { Offline } from 'svesta';
```

```html
<Offline>
	<p>Content to show when offline.</p>
</Offline>
```
