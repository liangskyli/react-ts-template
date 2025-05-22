import { defaultConfig } from './default-config';
import { twConfig } from './tw-config';

type IComponentName = keyof typeof defaultConfig;

let currentConfig = { ...defaultConfig };

const getComponentClassConfig = (componentName: IComponentName) => {
  return currentConfig[componentName];
};

const updateClassConfig = (config: typeof defaultConfig) => {
  currentConfig = config;
};

export { getComponentClassConfig, updateClassConfig, twConfig };
