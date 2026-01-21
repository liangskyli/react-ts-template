import { defaultConfig } from './default-config.ts';
import { cn } from './tv-utils.ts';

const getComponentClassConfig = <T extends keyof typeof defaultConfig>(
  componentName: T,
) => {
  return defaultConfig[componentName];
};

export { getComponentClassConfig, cn };
