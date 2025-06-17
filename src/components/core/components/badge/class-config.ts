import { cva } from 'class-variance-authority';
import { getComponentClassConfig } from '@/components/core/class-config';
import type { defaultConfig } from '@/components/core/class-config/default-config.ts';

const currentConfig = getComponentClassConfig(
  'badge',
) as (typeof defaultConfig)['badge'];

const badgeConfig = cva(currentConfig.index.base, {
  variants: {
    isDot: {
      true: currentConfig.index.dot,
    },
  },
});

const classConfig = {
  wrapConfig: currentConfig.index.wrap,
  badgeConfig,
  onlyBadgeConfig: currentConfig.index.onlyBadge,
};

export default classConfig;
