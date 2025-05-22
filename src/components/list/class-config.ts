import { cva } from 'class-variance-authority';
import { getComponentClassConfig } from '@/components/class-config';
import type { defaultConfig } from '@/components/class-config/default-config.ts';

const currentConfig = getComponentClassConfig(
  'list',
) as (typeof defaultConfig)['list'];

const listConfig = cva(currentConfig.list.base, {
  variants: {
    virtualScroll: {
      true: currentConfig.list.virtualScroll,
    },
  },
});

const classConfig = {
  listConfig,
  itemConfig: currentConfig.item,
  itemPrefixConfig: currentConfig.itemPrefix,
  itemSuffixConfig: currentConfig.itemSuffix,
  itemContentConfig: currentConfig.itemContent,
};

export default classConfig;
