import { LRUCache } from 'lru-cache';

/* eslint-disable @typescript-eslint/no-empty-object-type */

type ICacheOptions<K extends {}, V extends {}, FC = unknown> =
  | LRUCache.Options<K, V, FC>
  | LRUCache<K, V, FC>;

type IOptions<K extends {}, V extends {}, FC = unknown> = {
  /** 命名空间，用于隔离不同缓存 */
  namespace?: string;
  /** instanceId下的缓存管理器选项,初始化缓存时使用 */
  managerOptions?: ICacheOptions<K, V, FC>;
  /** 单个缓存键选项，覆盖instanceId下的缓存管理器选项 */
  keyOptions?: ICacheOptions<K, V, FC>;
  /** 缓存键instanceId集合选项 */
  instanceIdsOptions?: ICacheOptions<K, V, FC>;
};

type InstancesValue<K extends {} = {}, V extends {} = {}, FC = unknown> = {
  managerOptions: ICacheOptions<K, V, FC>;
  instanceIdsCache: LRUCache<string, LRUCache<K, V, FC>>;
};

type InstanceResponse<K extends {} = {}, V extends {} = {}, FC = unknown> = {
  /** instanceId下的所有缓存 */
  cache: LRUCache<K, V, FC> | undefined;
  /** 获取instanceId下的key缓存 */
  getCache: <K extends {}, V extends {}, FC = unknown>(
    key: string,
  ) => LRUCache<K, V, FC> | undefined;
  /** 移除instanceId下的key缓存 */
  removeCache: (key: string) => boolean | undefined;
  /** 清理instanceId下的所有缓存 */
  clearCache: () => void;
  /** 清理instanceId下的所有缓存,包含实例 */
  clearInstance: () => void;
};

type NamespaceInstanceResponse = {
  /** 清理namespace下的所有缓存,包含实例instanceId */
  clearNamespaceCache: () => void;
};

class LRUCacheManager {
  private static instances = new Map<string, InstancesValue>();

  private constructor() {}

  static initInstance<K extends {}, V extends {}, FC = unknown>(
    instanceId: string,
    options?: IOptions<K, V, FC>,
  ) {
    const defaultOptions: ICacheOptions<K, V, FC> = { max: 50 };
    const managerOptions = options?.managerOptions ?? defaultOptions;
    const instanceIdsOptions = options?.instanceIdsOptions ?? defaultOptions;
    const namespace = options?.namespace ?? 'default';

    const namespaceData = this.instances.get(namespace);
    if (!namespaceData) {
      new LRUCacheManager();

      const instanceIdsCacheValue = new LRUCache(
        instanceIdsOptions,
      ) as unknown as LRUCache<string, LRUCache<{}, {}>>;

      const keyOptions = options?.keyOptions ?? managerOptions;
      instanceIdsCacheValue.set(
        instanceId,
        new LRUCache(keyOptions as LRUCache<K, V>) as unknown as LRUCache<
          {},
          {}
        >,
      );
      const namespaceValue: InstancesValue = {
        managerOptions: managerOptions as InstancesValue['managerOptions'],
        instanceIdsCache: instanceIdsCacheValue,
      };

      this.instances.set(namespace, namespaceValue);
    } else {
      if (!namespaceData.instanceIdsCache.has(instanceId)) {
        const keyOptions = options?.keyOptions ?? namespaceData.managerOptions;

        namespaceData.instanceIdsCache.set(
          instanceId,
          new LRUCache(keyOptions as LRUCache<K, V>) as unknown as LRUCache<
            {},
            {}
          >,
        );
      }
    }
  }

  static getInstance<K extends {}, V extends {}, FC = unknown>(
    instanceId: string,
    namespace: string = 'default',
  ) {
    const namespaceData = this.instances.get(namespace);
    if (!namespaceData) {
      return undefined;
    }
    const cache = namespaceData.instanceIdsCache.get(instanceId);
    if (!cache) {
      return undefined;
    }

    return {
      cache: namespaceData.instanceIdsCache.get(instanceId),
      getCache: (key) =>
        namespaceData.instanceIdsCache.get(instanceId)?.get(key),
      removeCache: (key) =>
        namespaceData.instanceIdsCache.get(instanceId)?.delete(key),
      clearCache: () => {
        namespaceData.instanceIdsCache.get(instanceId)?.clear();
      },
      clearInstance: () => {
        namespaceData.instanceIdsCache.get(instanceId)?.clear();
        namespaceData.instanceIdsCache.delete(instanceId);
      },
    } as InstanceResponse<K, V, FC>;
  }

  static removeNamespaceInstance(namespace: string = 'default'): void {
    this.instances.delete(namespace);
  }

  static getNamespaceInstance(namespace: string = 'default') {
    const namespaceData = this.instances.get(namespace);
    if (!namespaceData) {
      return undefined;
    }
    return {
      clearNamespaceCache: () => {
        namespaceData.instanceIdsCache.forEach((keyCache) => {
          keyCache.clear();
        });
        namespaceData.instanceIdsCache.clear();
        this.removeNamespaceInstance(namespace);
      },
    } as NamespaceInstanceResponse;
  }
}

export function createLRUCache<K extends {}, V extends {}, FC = unknown>(
  instanceId: string,
  options?: IOptions<K, V, FC>,
): LRUCache<K, V, FC> {
  LRUCacheManager.initInstance(instanceId, options);
  return LRUCacheManager.getInstance<K, V, FC>(instanceId, options?.namespace)!
    .cache!;
}

export function getLRUCacheNamespaceInstance(namespace?: string) {
  return LRUCacheManager.getNamespaceInstance(namespace);
}

export function getLRUCacheInstance<K extends {}, V extends {}, FC = unknown>(
  instanceId: string,
  namespace?: string,
) {
  return LRUCacheManager.getInstance<K, V, FC>(instanceId, namespace);
}
