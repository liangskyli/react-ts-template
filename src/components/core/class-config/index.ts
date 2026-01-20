import { extendTailwindMerge } from 'tailwind-merge';
import type { CnOptions } from 'tailwind-variants/lite';
import { cx } from 'tailwind-variants/lite';
import { createLRUCache, getLRUCacheInstance } from '../components/cache';
import { defaultConfig } from './default-config.ts';

const getComponentClassConfig = <T extends keyof typeof defaultConfig>(
  componentName: T,
) => {
  return defaultConfig[componentName];
};

const defaultTwMerge = (className: string) => {
  return extendTailwindMerge({})(className);
};
type ITwMerge = (className: string) => string;
let twMerge: ITwMerge = defaultTwMerge;

// 创建LRU缓存实例
const CN_CACHE_ID = 'cn-cache';
const CN_CACHE_NAMESPACE = 'class-config';
const cache = createLRUCache<string, string>(CN_CACHE_ID, {
  namespace: CN_CACHE_NAMESPACE,
  managerOptions: {
    max: 1000, // 最大缓存数量
  },
});

const updateTwMergeFunction = (twMergeFunction: ITwMerge) => {
  twMerge = twMergeFunction;
  // 当 twMerge 函数更新时，清空缓存
  getLRUCacheInstance(CN_CACHE_ID, CN_CACHE_NAMESPACE)?.clearCache();
};

// className合并处理方法
const cn = (...inputs: CnOptions) => {
  // 生成缓存 key
  const cacheKey = JSON.stringify(inputs);

  // 检查缓存中是否存在结果
  const cachedResult = cache?.get(cacheKey);
  if (cachedResult !== undefined) {
    return cachedResult;
  }

  // 如果缓存中没有，计算结果并存储
  const result = twMerge(cx(inputs) ?? '');
  cache?.set(cacheKey, result);

  return result;
};

export { getComponentClassConfig, updateTwMergeFunction, defaultTwMerge, cn };
