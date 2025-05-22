import { getComponentClassConfig } from '@/components/class-config';
import type { defaultConfig } from '@/components/class-config/default-config.ts';

const currentConfig = getComponentClassConfig(
  'checkbox',
) as (typeof defaultConfig)['checkbox'];

const classConfig = {
  checkboxConfig: currentConfig.checkbox,
  boxConfig: currentConfig.box,
  checkedConfig: currentConfig.checked,
  labelConfig: currentConfig.label,
  groupConfig: currentConfig.group,
  iconConfig: currentConfig.icon,
};

export default classConfig;
