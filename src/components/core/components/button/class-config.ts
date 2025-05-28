import { cva } from 'class-variance-authority';
import { getComponentClassConfig } from '@/components/core/class-config';
import type { defaultConfig } from '@/components/core/class-config/default-config.ts';

const currentConfig = getComponentClassConfig(
  'button',
) as (typeof defaultConfig)['button'];

const indexConfig = cva(currentConfig.index.base, {
  variants: {
    variant: currentConfig.index.variant,
    block: {
      true: currentConfig.index.block,
    },
  },
});

const classConfig = {
  indexConfig,
  iconsConfig: currentConfig.icons,
};

export default classConfig;
