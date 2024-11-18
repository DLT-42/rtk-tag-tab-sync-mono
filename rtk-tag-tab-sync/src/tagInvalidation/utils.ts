import type { GetInvalidationTags, InvalidationMap } from './types.js';

export const getInvalidationDetails: GetInvalidationTags<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  InvalidationMap<any>
> = (invalidationMap, key, params, result) =>
  key in invalidationMap && invalidationMap[key]
    ? invalidationMap[key](params, result)
    : null;
