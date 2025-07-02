import { cx } from 'class-variance-authority';
import type { ClassValue } from 'class-variance-authority/types';
import { extendTailwindMerge } from 'tailwind-merge';
import { createLRUCache, getLRUCacheInstance } from '../components/cache';
import { defaultConfig } from './default-config.ts';
import { twConfig } from './tw-config.ts';

type IComponentName = keyof typeof defaultConfig;

let currentConfig = { ...defaultConfig };

const getComponentClassConfig = (componentName: IComponentName) => {
  return currentConfig[componentName];
};

const updateClassConfig = (config: typeof defaultConfig) => {
  currentConfig = config;
};

const defaultTwMerge = (className: string) => {
  return extendTailwindMerge({})(className);
};
type ITwMerge = (className: string) => string;
let twMerge: ITwMerge = defaultTwMerge;

// 创建LRU缓存实例
const CN_CACHE_ID = 'cn-cache';
const CN_CACHE_NAMESPACE = 'class-config';
createLRUCache(CN_CACHE_ID, {
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
const cn = (...inputs: ClassValue[]) => {
  // 生成缓存 key
  const cacheKey = JSON.stringify(inputs);

  const cache = getLRUCacheInstance<string, string>(
    CN_CACHE_ID,
    CN_CACHE_NAMESPACE,
  )?.cache;

  // 检查缓存中是否存在结果
  const cachedResult = cache?.get(cacheKey);
  if (cachedResult !== undefined) {
    return cachedResult;
  }

  // 如果缓存中没有，计算结果并存储
  const result = twMerge(cx(inputs));
  cache?.set(cacheKey, result);

  return result;
};

export {
  getComponentClassConfig,
  updateClassConfig,
  twConfig,
  updateTwMergeFunction,
  defaultTwMerge,
  cn,
  cx,
};
