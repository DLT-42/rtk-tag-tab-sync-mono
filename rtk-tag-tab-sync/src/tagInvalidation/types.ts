/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Middleware, Store } from '@reduxjs/toolkit';
import type {
  Api,
  ApiEndpointMutation,
  ApiEndpointQuery,
  BaseQueryFn,
  EndpointDefinitions,
  MutationDefinition,
  QueryDefinition,
  TagDescription,
} from '@reduxjs/toolkit/query';

export type InvalidateTagsRecipient =
  | {
      recipientType: 'INCLUDE';
      include: string[];
    }
  | {
      recipientType: 'EXCLUDE';
      exclude: string[];
    }
  | {
      recipientType: 'ALL';
    };

export type InvalidationDetailsTargets = {
  recipient: InvalidateTagsRecipient;
};

export type InvalidationDetails<TagTypes> = {
  tags: TagDescription<TagTypes | FullTagDescription<TagTypes>>[];
} & InvalidationDetailsTargets;

export type InvalidationMap<Endpoints> = {
  [K in keyof Endpoints]?: Endpoints[K] extends ApiEndpointQuery<
    QueryDefinition<infer QueryArg, any, infer TagTypes, infer ResultType, any>,
    EndpointDefinitions
  >
    ?
        | undefined
        | ((
            params: QueryArg,
            result: ResultType,
          ) => InvalidationDetails<TagTypes>[])
    : Endpoints[K] extends ApiEndpointMutation<
        MutationDefinition<
          infer QueryArg,
          any,
          infer TagTypes,
          infer ResultType,
          any
        >,
        EndpointDefinitions
      >
    ?
        | undefined
        | ((
            params: QueryArg,
            result: ResultType,
          ) => InvalidationDetails<TagTypes>[])
    : never;
};

export type GetInvalidationTags<I> = I extends InvalidationMap<any>
  ? <K extends keyof I, F extends I[K]>(
      invalidationMap: I,
      key: K,
      params: F extends (...args: any) => any ? Parameters<F>[0] : never,
      result: F extends (...args: any) => any ? Parameters<F>[1] : never,
    ) => InvalidationDetails<string | FullTagDescription<string>>[] | null
  : never;

export type GetInvalidateTagsMiddleware = {
  <
    BaseQuery extends BaseQueryFn,
    Definition extends EndpointDefinitions,
    ReducerPath extends string = 'api',
    TagTypes extends string = never,
  >(params: {
    api: Api<BaseQuery, Definition, ReducerPath, TagTypes>;

    invalidationMap: InvalidationMap<
      Api<BaseQuery, Definition, ReducerPath, TagTypes>['endpoints']
    >;
    getStore: () => Store;
    tabId: string;
    send?: BroadcastChannel;
    receive?: BroadcastChannel;
  }): Middleware;
};

export type FullTagDescription<TagType> = {
  type: TagType;
  id?: number | string;
};

export type InvalidateTagsMessage<TagType> = {
  type: 'INVALIDATE_TAGS';
  tags: TagDescription<TagType | FullTagDescription<TagType>>[];
} & InvalidateTagsRecipient;
