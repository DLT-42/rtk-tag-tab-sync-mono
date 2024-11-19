
<p align="center">
  <a href="https://www.npmjs.com/package/rtk-tag-tab-sync"><img alt="npm" src="https://img.shields.io/npm/v/rtk-tag-tab-sync?style=flat-square" /></a>
</p>
<br/>

# rtk-tag-tab-sync

Cross tab RTK Query tag invalidation middleware for Redux Toolkit, and a utility (with an accompanying react hook) for cross tab communication.

### Tag Invalidation Middleware

The main purpose of rtk-tag-tab-sync is to provide cross tab tag invalidation middleware for applications developed with RTK Query. The middleware communicates between tabs using the BroadcastChannel API.

The following documentation will relate to this example API:

```
export const exampleApi = createApi({
	tagTypes: [MessagesTag],
	endpoints: (build) => ({
		createMessage: build.mutation<Id, MessagePayload>({
			...
		}),
		deleteMessage: build.mutation<void, Id>({
			...
		}),
		getMessages: build.query<MessageArray, MessageFilters>({
			...
			providesTags: (result) => [
				...(result
					? result.map(
						({ id }) => ({ type: MessagesTag, id })
					)
					: []),
				{ type: MessagesTag, id: 'LIST' },
			]
		})
	})
})
```

##### Invalidation Map

The tag invalidation middleware is configured with an invalidation map that defines callbacks for each mutation endpoint in the API. The callback for an endpoint returns an array of tag invalidation details, each of which specifies a recipient and the tags to be invalidated for the associated endpoint:

```
export const invalidationMap: InvalidationMap<typeof exampleApi.endpoints> = {
	createMessage: (_, { id }) => {
		return [
			{
				recipient: {
					recipientType: 'ALL',
				},
				tags: [
					{ id: 'LIST', type: MessagesTag },
					{ id, type: MessagesTag },
				],
			},
		];
	},
	deleteMessage: ({ id }) => {
		return [
			{
				recipient: {
					recipientType: 'ALL',
				},
				tags: [
					{ id: 'LIST', type: MessagesTag },
					{ id, type: MessagesTag },
				],
			},
		];
	},
};
```

_Example: Invalidation map for creation and deletion endpoints_

###### _Tag Invalidation Callback_

The request parameters and the response for the mutation are passed too each callback, which can be used to control the returned invalidation details. For CRUD operations in particular the `id` of each mutated entity is of particular use when defining the tags to invalidate.

###### _Tag Invalidation Details_

Tag invalidation details consist of the recipient and the tags that should be invalidated. The recipient type can be one of:

- `'ALL'`
- `'INCLUDE'`
- `'EXCLUDE'`

It is likely that in most cases all tabs should invalidate the same tags when a particular mutation occurs, but for flexibility the `'INCLUDE'` and `'EXCLUDE'` recipient types provide some refinement over which tabs should invalidate the specified tags. If either are used an array of tab identifiers must be specified as part of the recipient configuration.

```
{
	recipient: {
		recipientType: 'INCLUDE',
		include: ['<some tab identifier>']
	},
	tags: [
		{ id: 'LIST', type: MessagesTag },
		{ id, type: MessagesTag },
	],
},
```

_Example: Invalidation details specifying an 'INCLUDE' recipient_

```
{
	recipient: {
		recipientType: 'EXCLUDE',
		exclude: ['<some tab identifier>']
	},
	tags: [
		{ id: 'LIST', type: MessagesTag },
		{ id, type: MessagesTag },
	],
},
```

_Example: Invalidation details specifying an 'EXCLUDE' recipient_

##### Middleware

The tag invalidation middleware can be created by calling `getInvalidateTagsMiddleware` with the following parameters:

- `api` - An API defined using Redux Toolkit
- `invalidationMap` - A map between mutation endpoints in the specified API and callbacks that evaluate the tags to be invalidated
- `getStore` - A callback that returns the Redux Store that the API is attached to
- `tabId` - The identifier for the current tab

```
export const invalidateTagsMiddleware: Middleware = getInvalidateTagsMiddleware({
	api: exampleApi,
	invalidationMap,
	getStore: () => store,
	tabId: tabId || 'MAIN',
});
```

\*Example: Creating an instance of the tag invalidation middleware

To use the tag invalidation middleware an instance needs to be provided to the Redux store during initialisation:

```
export const store = configureStore({
	reducer: rootReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(
			exampleApi.middleware,
			invalidateTagsMiddleware
		)
});
```

\*Example: Applying tag invalidation middleware to a Redux Store

### Cross Tab Communication Utility

The PubSub utility provides a typed, single instance, publish/subscribe mechanism. It is underpinned by BroadcastChannel so messages can be published to other subscribing windows. This utility isn't used by the tag invalidation middleware described above, but it is provided to support development of multi tab applications.

The PubSub instance is returned by a call to `getPubSub`, which requires a single type parameter that defines the types of messages to be used. The type parameter must be a discriminated union of types that share a common `type: string` attribute.

For example:

```
type MyMessageTypes = { type: "A", paramA: string } | { type: "B", paramB: string }

const pubSub: PubSub<MyEventTypes> | null = getPubSub();
```

The PubSub instance provides three functions:

- `publish`
- `subscribe`
- `clearHandlers`

##### PubSub - Subscribe

Subscription for a particular message can be achieved by calling the `subscribe` function. This function requires the following attributes:

- `type` - the message type
- `subscriberId` - an identifier used internally for managing handler registration
- `handler` - the function that will be called when a message is published for the specified type

The handler receives the message defined by the type as well as the ID of both the publisher and the subscriber. The inclusion of the subscriber ID supports reuse of handler functions. The `subscribe` function returns a callback that can be used to unsubscribe the handler.

For example:

```
type MyMessageTypes = { type: "A", paramA: string } | { type: "B", paramB: string }

const pubSub: PubSub<MyEventTypes> | null = getPubSub();

...

const unsubscribe = pubSub.subscribe({
	type: "A",
	subscriberId: "Subscriber1",
	handler: ({ type, paramA, publisherId, subscriberId }) => {
		// Process the message
	}
});
```

##### PubSub - Publish

Messages can be published by calling the `publish` function. This function requires the following attributes:

- `type` - the message type
- `publisherId` - the identifier of the message publisher

Any call to `publish` should also include the attributes defined for the given type.

For example:

```
type MyMessageTypes = { type: "A", paramA: string } | { type: "B", paramB: string }

const pubSub: PubSub<MyEventTypes> | null = getPubSub();

...

pubSub.publish({
	type: "A",
	paramA: "Some Value",
	publisherId: "Publisher1"
});
```

##### PubSub - Clear Handlers

All handlers for a given subscriber ID can be unsubscribed by calling the `clearHandlers` function.

For example:

```
type MyMessageTypes = { type: "A", paramA: string } | { type: "B", paramB: string }

const pubSub: PubSub<MyEventTypes> | null = getPubSub();

...

pubSub.subscribe({
	type: "A",
	subscriberId: "Subscriber1",
	handler: ({ type, paramA, publisherId, subscriberId }) => {
		// Process the message
	}
});

pubSub.subscribe({
	type: "B",
	subscriberId: "Subscriber1",
	handler: ({ type, paramB, publisherId, subscriberId }) => {
		// Process the message
	}
});

...

pubSub.clearHandlers("Subscriber1")
```
