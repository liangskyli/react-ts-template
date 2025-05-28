import { getComponentClassConfig } from '@/components/core/class-config';
import type { defaultConfig } from '@/components/core/class-config/default-config.ts';

const currentConfig = getComponentClassConfig(
  'loading',
) as (typeof defaultConfig)['loading'];

const classConfig = {
  mask: currentConfig.mask,
  position: currentConfig.position,
  body: currentConfig.body,
  text: currentConfig.text,
  loadingIcon: currentConfig.loadingIcon,
};

export default classConfig;
