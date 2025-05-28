import { cx } from 'class-variance-authority';
import type { ClassValue } from 'class-variance-authority/types';
import { extendTailwindMerge } from 'tailwind-merge';
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

const updateTwMergeFunction = (twMergeFunction: ITwMerge) => {
  twMerge = twMergeFunction;
};

// className合并处理方法
const cn = (...inputs: ClassValue[]) => {
  return twMerge(cx(inputs));
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
