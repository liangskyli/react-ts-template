import { LRUCache } from 'lru-cache';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  createLRUCache,
  getLRUCacheInstance,
  getLRUCacheNamespaceInstance,
} from '@/components/core/components/cache';

describe('LRU Cache Manager', () => {
  // 在每个测试前清理所有实例
  beforeEach(() => {
    // 重置单例实例
    const instanceDefault = getLRUCacheNamespaceInstance();
    instanceDefault?.clearNamespaceCache();
    const instanceTest = getLRUCacheNamespaceInstance('test');
    instanceTest?.clearNamespaceCache();
  });

  describe('createLRUCache', () => {
    it('应该创建新的缓存实例', () => {
      const cache = createLRUCache<string, string>('test-cache', {
        namespace: 'test',
        managerOptions: { max: 10 },
        keyOptions: { max: 5 },
      });

      expect(cache).toBeInstanceOf(LRUCache);
      expect(cache.max).toBe(5);
    });

    it('应该使用默认选项创建缓存', () => {
      const cache = createLRUCache<string, string>('test-cache-default');
      expect(cache).toBeInstanceOf(LRUCache);
      expect(cache.max).toBe(50); // 默认值
    });
  });

  describe('缓存操作', () => {
    it('应该能够设置和获取缓存值', () => {
      const cache = createLRUCache<string, string>('test-cache', {
        namespace: 'test',
        managerOptions: { max: 10 },
      });

      cache.set('key1', 'value1');
      expect(cache.get('key1')).toBe('value1');
    });

    it('应该支持同一个实例不同key使用不同类型的值', () => {
      const cache1 = createLRUCache<string, string>('test-cache', {
        namespace: 'test',
      });
      const cache2 = createLRUCache<string, number>('test-cache', {
        namespace: 'test',
      });

      cache1.set('keyString', 'value1');
      expect(cache1.get('keyString')).toBe('value1');
      cache2.set('keyNumber', 1);
      expect(cache2.get('keyNumber')).toBe(1);
      expect(cache1.size).toBe(cache2.size);
      expect(cache1).toStrictEqual(cache2);
    });

    it('应该能够删除缓存值', () => {
      const cache = createLRUCache<string, string>('test-cache', {
        namespace: 'test',
        managerOptions: { max: 10 },
      });

      cache.set('key1', 'value1');
      expect(cache.get('key1')).toBe('value1');
      cache.delete('key1');
      expect(cache.get('key1')).toBeUndefined();
    });

    it('应该遵守最大容量限制（支持key配置不同的最大容量限制）', () => {
      const cache1 = createLRUCache<string, string>('test-cache-1', {
        namespace: 'test',
        managerOptions: { max: 1 },
      });
      expect(cache1.max).toBe(1);

      const cache2 = createLRUCache<string, string>('test-cache-2', {
        namespace: 'test',
        keyOptions: { max: 2 },
      });
      expect(cache2.max).toBe(2);

      const cache3 = createLRUCache<string, string>('test-cache-3', {
        namespace: 'test',
      });
      expect(cache3.max).toBe(1);

      cache1.set('key1', 'value1');
      cache1.set('key2', 'value2'); // 应该移除 key1

      expect(cache1.get('key1')).toBeUndefined();
      expect(cache1.get('key2')).toBe('value2');

      cache2.set('key1', 'value1');
      cache2.set('key2', 'value2');
      cache2.set('key3', 'value3'); // 应该移除 key1

      expect(cache2.get('key1')).toBeUndefined();
      expect(cache2.get('key2')).toBe('value2');
      expect(cache2.get('key3')).toBe('value3');

      cache3.set('key1', 'value1');
      cache3.set('key2', 'value2'); // 应该移除 key1

      expect(cache3.get('key1')).toBeUndefined();
      expect(cache3.get('key2')).toBe('value2');

      const cache1Repeat = createLRUCache<string, string>('test-cache-1', {
        namespace: 'test',
        managerOptions: { max: 5 },
      });
      expect(cache1Repeat.get('key2')).toBe('value2');
      expect(cache1).toStrictEqual(cache1Repeat);
    });
  });

  describe('缓存key是number类型,值是数组类型操作', () => {
    it('应该能够设置和获取缓存值', () => {
      const cache = createLRUCache<number, string[]>('test-cache', {
        namespace: 'test',
        managerOptions: { max: 10 },
      });

      cache.set(1, ['value1']);
      expect(cache.get(1)).toStrictEqual(['value1']);
    });

    it('应该能够删除缓存值', () => {
      const cache = createLRUCache<number, string[]>('test-cache', {
        namespace: 'test',
        managerOptions: { max: 10 },
      });

      cache.set(1, ['value1']);
      expect(cache.get(1)).toStrictEqual(['value1']);
      cache.delete(1);
      expect(cache.get(1)).toBeUndefined();
    });

    it('应该遵守最大容量限制', () => {
      const cache = createLRUCache<number, string[]>('test-cache', {
        namespace: 'test',
        managerOptions: { max: 10 },
        keyOptions: { max: 2 },
      });
      expect(cache.max).toBe(2);

      cache.set(1, ['value1']);
      cache.set(2, ['value2']);
      cache.set(3, ['value3']); // 应该移除 key1

      expect(cache.get(1)).toBeUndefined();
      expect(cache.get(2)).toStrictEqual(['value2']);
      expect(cache.get(3)).toStrictEqual(['value3']);
    });
  });

  describe('缓存管理器操作', () => {
    it('创建前应该不能够获取缓存管理器实例', () => {
      const instance = getLRUCacheInstance('test');
      expect(instance).toBeUndefined();
    });

    it('应该能够移除特定的缓存', () => {
      const cache = createLRUCache<string, string>('test-cache', {
        namespace: 'test',
        managerOptions: { max: 10 },
      });

      const instance = getLRUCacheInstance('test-cache', 'test');
      expect(instance).toBeDefined();

      cache.set('key1', 'value1');
      expect(cache.get('key1')).toBe('value1');
      expect(instance!.getCache('key1')).toBe('value1');
      expect(cache).toStrictEqual(instance!.cache);

      instance!.removeCache('key1');
      expect(cache.get('key1')).toBeUndefined();
      expect(instance).toBeDefined();
      expect(cache).toStrictEqual(instance!.cache);
    });

    it('应该能够清理命名空间下所有缓存', () => {
      const cache1 = createLRUCache<string, string>('test-cache-1', {
        namespace: 'test',
      });
      const cache2 = createLRUCache<string, string>('test-cache-2', {
        namespace: 'test',
      });

      cache1.set('key1', 'value1');
      cache2.set('key2', 'value2');

      const instance = getLRUCacheNamespaceInstance('test');
      instance!.clearNamespaceCache();

      expect(cache1.get('key1')).toBeUndefined();
      expect(cache2.get('key2')).toBeUndefined();
      expect(getLRUCacheInstance('test-cache-1', 'test')).toBeUndefined();
      expect(instance).toBeDefined();
      const cacheInstance1 = getLRUCacheInstance('test-cache-1', 'test');
      const cacheInstance2 = getLRUCacheInstance('test-cache-2', 'test');
      expect(cacheInstance1).toBeUndefined();
      expect(cacheInstance2).toBeUndefined();
    });

    it('应该能够清理instanceId下所有缓存', () => {
      const cache1 = createLRUCache<string, string>('test-cache-1', {
        namespace: 'test',
        managerOptions: { max: 10 },
      });
      const cache2 = createLRUCache<string, string>('test-cache-2', {
        namespace: 'test',
        managerOptions: { max: 10 },
      });

      cache1.set('key1', 'value1');
      cache2.set('key2', 'value2');

      const cacheInstance1 = getLRUCacheInstance('test-cache-1', 'test');
      const cacheInstance2 = getLRUCacheInstance('test-cache-2', 'test');

      cacheInstance1!.clearCache();
      expect(cache1.get('key1')).toBeUndefined();
      expect(cache2.get('key2')).toBeDefined();

      cacheInstance2!.clearCache();
      expect(cache2.get('key2')).toBeUndefined();
      expect(getLRUCacheInstance('test-cache-2', 'test')).toBeDefined();

      cacheInstance2!.clearInstance();
      expect(getLRUCacheInstance('test-cache-2', 'test')).toBeUndefined();
      expect(cacheInstance2).toBeDefined();
      expect(cacheInstance2?.getCache('test-cache-1')).toBeUndefined();
      expect(cacheInstance2?.getCache('test-cache-2')).toBeUndefined();
    });
  });

  describe('命名空间隔离', () => {
    it('不同命名空间的缓存应该相互独立', () => {
      const cache1 = createLRUCache<string, string>('test-cache', {
        namespace: 'namespace1',
      });
      const cache2 = createLRUCache<string, string>('test-cache', {
        namespace: 'namespace2',
      });

      cache1.set('key1', 'value1');
      cache2.set('key1', 'value2');

      expect(cache1.get('key1')).toBe('value1');
      expect(cache2.get('key1')).toBe('value2');

      const instance1 = getLRUCacheInstance('test-cache', 'namespace1');
      const instance2 = getLRUCacheInstance('test-cache', 'namespace2');

      instance1!.clearCache();
      expect(cache1.get('key1')).toBeUndefined();
      expect(cache2.get('key1')).toBe('value2');

      instance2!.clearCache();
      expect(cache1.get('key1')).toBeUndefined();
      expect(cache2.get('key1')).toBeUndefined();
    });
  });
});
