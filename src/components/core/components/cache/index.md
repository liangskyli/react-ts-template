# Cache 缓存

提供基于 LRU (最近最少使用) 策略的缓存管理功能，包括缓存创建、实例管理和 React Hook 实现。

## 代码演示

### 基础用法 - 创建 LRU 缓存

```tsx
import { createLRUCache } from '@/components/core/components/cache';

// 创建一个缓存实例，指定实例ID
const cache = createLRUCache<string, any>('my-cache-id');

// 设置缓存
cache.set('key1', { data: 'value1' });

// 获取缓存
const value = cache.get('key1'); // { data: 'value1' }

// 检查键是否存在
const exists = cache.has('key1'); // true

// 删除缓存
cache.delete('key1');

// 清空所有缓存
cache.clear();
```

### 使用命名空间隔离缓存

```tsx
import { createLRUCache } from '@/components/core/components/cache';

// 在不同命名空间创建相同ID的缓存
const userCache = createLRUCache<string, any>('data-cache', {
  namespace: 'user'
});

const productCache = createLRUCache<string, any>('data-cache', {
  namespace: 'product'
});

// 两个缓存相互独立
userCache.set('items', ['user1', 'user2']);
productCache.set('items', ['product1', 'product2']);

console.log(userCache.get('items')); // ['user1', 'user2']
console.log(productCache.get('items')); // ['product1', 'product2']
```

### 缓存实例管理

```tsx
import { 
  createLRUCache, 
  getLRUCacheInstance,
  getLRUCacheNamespaceInstance 
} from '@/components/core/components/cache';

// 创建缓存
const cache = createLRUCache<string, any>('app-cache', {
  namespace: 'app',
  managerOptions: { max: 100 }
});

// 获取缓存实例
const cacheInstance = getLRUCacheInstance<string, any>('app-cache', 'app');

// 使用实例管理缓存
if (cacheInstance) {
  // 清除特定缓存
  cacheInstance.clearCache();
  
  // 清除实例及其所有缓存
  cacheInstance.clearInstance();
}

// 获取命名空间实例
const namespaceInstance = getLRUCacheNamespaceInstance('app');

// 清除整个命名空间的所有缓存
if (namespaceInstance) {
  namespaceInstance.clearNamespaceCache();
}
```

### React Hook 用法

```tsx
import { useCreateLRUCache } from '@/components/core/components/cache';

const CacheExample = () => {
  // 创建一个缓存Hook，指定实例ID和选项
  const cache = useCreateLRUCache<string, any>('user-data', {
    namespace: 'users',
    managerOptions: { max: 50 }
  });
  
  // 使用缓存
  const handleSaveUser = (userId, userData) => {
    cache.set(userId, userData);
  };
  
  const handleGetUser = (userId) => {
    const userData = cache.get(userId);
    console.log(userData);
  };
  
  return (
    <div>
      <button onClick={() => handleSaveUser('user1', { name: 'John' })}>
        保存用户
      </button>
      <button onClick={() => handleGetUser('user1')}>
        获取用户
      </button>
      <button onClick={() => cache.delete('user1')}>
        删除用户缓存
      </button>
      <button onClick={() => cache.clear()}>
        清空所有用户缓存
      </button>
    </div>
  );
};
```

## API

### createLRUCache

创建一个 LRU 缓存实例。

```ts
function createLRUCache<K extends {}, V extends {}, FC = unknown>(
  instanceId: string,
  options?: IOptions<K, V, FC>
): LRUCache<K, V, FC>
```

| 参数                           | 说明              | 类型                        | 默认值           |
|------------------------------|-----------------|---------------------------|---------------|
| `instanceId`                 | 缓存实例的唯一标识符      | `string`                  | -             |
| `options`                    | 缓存配置选项          | `IOptions<K, V, FC>`      | -             |
| `options.namespace`          | 命名空间，用于隔离不同缓存   | `string`                  | `'default'`   |
| `options.managerOptions`     | 缓存管理器选项         | `ICacheOptions<K, V, FC>` | `{ max: 50 }` |
| `options.keyOptions`         | 单个缓存键选项，覆盖管理器选项 | `ICacheOptions<K, V, FC>` | -             |
| `options.instanceIdsOptions` | 缓存键实例ID集合选项     | `ICacheOptions<K, V, FC>` | -             |

### getLRUCacheInstance

获取指定实例ID和命名空间的缓存实例。

```ts
function getLRUCacheInstance<K extends {}, V extends {}, FC = unknown>(
  instanceId: string,
  namespace?: string
): InstanceResponse<K, V, FC> | undefined
```

| 参数           | 说明         | 类型       | 默认值         |
|--------------|------------|----------|-------------|
| `instanceId` | 缓存实例的唯一标识符 | `string` | -           |
| `namespace`  | 命名空间       | `string` | `'default'` |

返回值 `InstanceResponse` 包含以下属性和方法：

| 属性/方法           | 说明         | 类型                                                 |
|-----------------|------------|----------------------------------------------------|
| `cache`         | 缓存实例       | `LRUCache<K, V, FC> \| undefined`                  |
| `getCache`      | 获取指定键的缓存   | `(key: string) => LRUCache<K, V, FC> \| undefined` |
| `removeCache`   | 移除指定键的缓存   | `(key: string) => boolean \| undefined`            |
| `clearCache`    | 清理实例下的所有缓存 | `() => void`                                       |
| `clearInstance` | 清理实例及其所有缓存 | `() => void`                                       |

### getLRUCacheNamespaceInstance

获取指定命名空间的缓存实例管理器。

```ts
function getLRUCacheNamespaceInstance(
  namespace?: string
): NamespaceInstanceResponse | undefined
```

| 参数          | 说明   | 类型       | 默认值         |
|-------------|------|----------|-------------|
| `namespace` | 命名空间 | `string` | `'default'` |

返回值 `NamespaceInstanceResponse` 包含以下方法：

| 方法                    | 说明              | 类型           |
|-----------------------|-----------------|--------------|
| `clearNamespaceCache` | 清理命名空间下的所有缓存和实例 | `() => void` |

### useCreateLRUCache

React Hook，用于在组件中创建和使用 LRU 缓存。

```ts
function useCreateLRUCache<K extends {}, V extends {}, FC = unknown>(
  instanceId: string,
  options?: IOptions<K, V, FC>
): LRUCache<K, V, FC>
```

| 参数           | 说明                        | 类型                   | 默认值           |
|--------------|---------------------------|----------------------|---------------|
| `instanceId` | 缓存实例的唯一标识符                | `string`             | -             |
| `options`    | 缓存配置选项，同 `createLRUCache` | `IOptions<K, V, FC>` | `{ max: 50 }` |

## 使用场景

- 频繁访问的数据缓存
- API 响应数据缓存
- 表单数据临时存储
- 用户界面状态缓存
- 计算结果缓存
- 多模块间共享缓存数据

## 注意事项

1. 缓存实例通过 `instanceId` 和 `namespace` 唯一标识
2. 不同命名空间的相同 `instanceId` 缓存相互独立
3. 缓存在达到容量上限时，会自动删除最久未使用的项
4. 缓存仅在内存中有效，页面刷新后会丢失
5. 使用 `clearNamespaceCache` 可以清理整个命名空间的所有缓存
6. 对于需要持久化的数据，建议结合 sessionStorage 或其他存储方式使用