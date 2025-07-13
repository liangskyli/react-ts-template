import { getComponentClassConfig } from '@/components/core/class-config';
import type { defaultConfig } from '@/components/core/class-config/default-config.ts';

const currentConfig = getComponentClassConfig(
  'virtualGrid',
) as (typeof defaultConfig)['virtualGrid'];

const classConfig = {
  containerConfig: currentConfig.container,
  headerConfig: currentConfig.header,
  leftHeaderConfig: currentConfig.leftHeader,
  centerHeaderConfig: currentConfig.centerHeader,
  rightHeaderConfig: currentConfig.rightHeader,
  bodyConfig: currentConfig.body,
  leftBodyConfig: currentConfig.leftBody,
  centerBodyConfig: currentConfig.centerBody,
  rightBodyConfig: currentConfig.rightBody,
};

export default classConfig;
