import { getComponentClassConfig } from '@/components/core/class-config';
import type { defaultConfig } from '@/components/core/class-config/default-config.ts';

const currentConfig = getComponentClassConfig(
  'virtualTable',
) as (typeof defaultConfig)['virtualTable'];

const classConfig = {
  containerConfig: currentConfig.container,
  rightHeaderClassConfig: currentConfig.rightHeaderClass,
  rightBodyClassConfig: currentConfig.rightBodyClass,
  headerCellClassConfig: currentConfig.headerCellClass,
  bodyCellClassConfig: currentConfig.bodyCellClass,
};

export default classConfig;
