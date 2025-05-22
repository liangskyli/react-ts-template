import { getComponentClassConfig } from '@/components/class-config';
import type { defaultConfig } from '@/components/class-config/default-config.ts';

const currentConfig = getComponentClassConfig(
  'mask',
) as (typeof defaultConfig)['mask'];

const classConfig = {
  transitionConfig: currentConfig.transition,
  contentConfig: currentConfig.content,
};

export default classConfig;
