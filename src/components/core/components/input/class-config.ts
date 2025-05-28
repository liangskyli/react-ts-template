import { cva } from 'class-variance-authority';
import { getComponentClassConfig } from '@/components/core/class-config';
import type { defaultConfig } from '@/components/core/class-config/default-config.ts';

const currentConfig = getComponentClassConfig(
  'input',
) as (typeof defaultConfig)['input'];

const indexConfig = cva(currentConfig.index.base, {
  variants: {
    readOnly: {
      false: currentConfig.index.noReadOnly,
    },
  },
});

const classConfig = {
  indexConfig,
};

export default classConfig;
