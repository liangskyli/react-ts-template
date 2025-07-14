import { cva } from 'class-variance-authority';
import { getComponentClassConfig } from '@/components/core/class-config';
import type { defaultConfig } from '@/components/core/class-config/default-config.ts';

const currentConfig = getComponentClassConfig(
  'list',
) as (typeof defaultConfig)['list'];

const listConfig = cva(currentConfig.list.base, {
  variants: {
    defaultScrollHeight: {
      true: currentConfig.list.defaultScrollHeight,
    },
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
  defaultInfiniteScrollContentConfig:
    currentConfig.defaultInfiniteScrollContentConfig,
  virtualGridConfig: currentConfig.virtualGrid,
};

export default classConfig;
