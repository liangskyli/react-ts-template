import { cva } from 'class-variance-authority';
import { getComponentClassConfig } from '@/components/class-config';
import type { defaultConfig } from '@/components/class-config/default-config.ts';

const currentConfig = getComponentClassConfig(
  'list',
) as (typeof defaultConfig)['list'];

const listConfig = cva(currentConfig.list.base, {
  variants: {
    isScroll: {
      true: currentConfig.list.isScroll,
    },
  },
});

const classConfig = {
  listConfig,
  itemConfig: currentConfig.item,
  itemPrefixConfig: currentConfig.itemPrefix,
  itemSuffixConfig: currentConfig.itemSuffix,
  itemContentConfig: currentConfig.itemContent,
  infiniteScrollContentConfig: currentConfig.infiniteScrollContent,
};

export default classConfig;
