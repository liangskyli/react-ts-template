import { useState } from 'react';
import { createLRUCache } from '@/components/core/components/cache/lru-cache.ts';

/* eslint-disable @typescript-eslint/no-empty-object-type */
export function useCreateLRUCache<K extends {}, V extends {}, FC = unknown>(
  instanceId: string,
  options?: Parameters<typeof createLRUCache<K, V, FC>>[1],
) {
  const [cache] = useState(() => {
    return createLRUCache<K, V, FC>(instanceId, options);
  });

  return cache;
}
