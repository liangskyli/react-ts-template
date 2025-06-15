import { cva } from 'class-variance-authority';
import { getComponentClassConfig } from '@/components/core/class-config';
import type { defaultConfig } from '@/components/core/class-config/default-config.ts';

const currentConfig = getComponentClassConfig(
  'skeleton',
) as (typeof defaultConfig)['skeleton'];

const skeletonConfig = cva(currentConfig.skeleton.base, {
  variants: {
    animation: {
      true: currentConfig.skeleton.animation,
    },
  },
});

const classConfig = {
  skeletonConfig,
  paragraphConfig: currentConfig.paragraph,
  circularConfig: currentConfig.circular,
};

export default classConfig;
