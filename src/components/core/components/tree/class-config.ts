import { getComponentClassConfig } from '@/components/core/class-config';
import type { defaultConfig } from '@/components/core/class-config/default-config.ts';

const currentConfig = getComponentClassConfig(
  'tree',
) as (typeof defaultConfig)['tree'];

const classConfig = {
  nodeConfig: currentConfig.node,
  nodeContentConfig: currentConfig.nodeContent,
  childrenConfig: currentConfig.children,
  treeRadioConfig: currentConfig.treeRadio,
};

export default classConfig;
