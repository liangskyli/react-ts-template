import { getComponentClassConfig } from '@/components/core/class-config';
import type { defaultConfig } from '@/components/core/class-config/default-config.ts';

const currentConfig = getComponentClassConfig(
  'searchBar',
) as (typeof defaultConfig)['searchBar'];

const classConfig = {
  containerConfig: currentConfig.container,
  searchConfig: currentConfig.search,
  searchIconConfig: currentConfig.searchIcon,
  clearButtonConfig: currentConfig.clearButton,
  input: currentConfig.input,
};

export default classConfig;
