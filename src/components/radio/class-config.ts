import { getComponentClassConfig } from '@/components/class-config';
import type { defaultConfig } from '@/components/class-config/default-config.ts';

const currentConfig = getComponentClassConfig(
  'radio',
) as (typeof defaultConfig)['radio'];

const classConfig = {
  groupConfig: currentConfig.group,
  radioConfig: currentConfig.radio,
  radioBoxConfig: currentConfig.radioBox,
  radioDotConfig: currentConfig.radioDot,
  radioLabelConfig: currentConfig.radioLabel,
};

export default classConfig;
