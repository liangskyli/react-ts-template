import { getComponentClassConfig } from '@/components/core/class-config';
import type { defaultConfig } from '@/components/core/class-config/default-config.ts';

const currentConfig = getComponentClassConfig(
  'virtualGrid',
) as (typeof defaultConfig)['virtualGrid'];

const multiGrid=currentConfig.multiGrid;

const classConfig = {
  containerConfig: multiGrid.container,
  headerConfig: multiGrid.header,
  leftHeaderConfig: multiGrid.leftHeader,
  centerHeaderConfig: multiGrid.centerHeader,
  rightHeaderConfig: multiGrid.rightHeader,
  bodyConfig: multiGrid.body,
  leftBodyConfig: multiGrid.leftBody,
  centerBodyConfig: multiGrid.centerBody,
  rightBodyConfig: multiGrid.rightBody,
};

export default classConfig;
