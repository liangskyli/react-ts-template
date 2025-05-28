import { getComponentClassConfig } from '@/components/core/class-config';
import type { defaultConfig } from '@/components/core/class-config/default-config.ts';

const currentConfig = getComponentClassConfig(
  'switch',
) as (typeof defaultConfig)['switch'];

const classConfig = {
  switchConfig: currentConfig.switch,
  switchTrackConfig: currentConfig.switchTrack,
  switchChildrenWrapConfig: currentConfig.switchChildrenWrap,
  switchCheckedTextConfig: currentConfig.switchCheckedText,
  switchThumbConfig: currentConfig.switchThumb,
  switchUncheckedTextConfig: currentConfig.switchUncheckedText,
  iconsConfig: currentConfig.icons,
};

export default classConfig;
