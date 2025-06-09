import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useCreateLRUCache } from '@/components/core/components/cache';
import { getLRUCacheNamespaceInstance } from '@/components/core/components/cache/lru-cache.ts';

describe('useCreateLRUCache', () => {
  // 在每个测试前清理所有缓存
  beforeEach(() => {
    // 重置所有缓存
    const instanceTest = getLRUCacheNamespaceInstance('test');
    instanceTest?.clearNamespaceCache();
  });

  it('应该创建新的缓存实例', () => {
    const { result } = renderHook(() =>
      useCreateLRUCache('test-cache', {
        namespace: 'test',
      }),
    );

    expect(result.current).toBeDefined();
  });

  it('应该正确更新缓存值', () => {
    const { result } = renderHook(() =>
      useCreateLRUCache<string, string>('test-cache', {
        namespace: 'test',
      }),
    );

    act(() => {
      result.current.set('key1', 'value1');
    });

    expect(result.current.get('key1')).toBe('value1');

    // 重新渲染，应该保持更新后的值
    const { result: reRenderResult } = renderHook(() =>
      useCreateLRUCache('test-cache', {
        namespace: 'test',
      }),
    );

    expect(reRenderResult.current.get('key1')).toBe('value1');

    result.current.delete('key1');
    expect(result.current.get('key1')).toBeUndefined();
    expect(reRenderResult.current.get('key1')).toBeUndefined();
  });
});
