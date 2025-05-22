import { cva } from 'class-variance-authority';
import { getComponentClassConfig } from '@/components/class-config';
import type { defaultConfig } from '@/components/class-config/default-config.ts';

const currentConfig = getComponentClassConfig(
  'popup',
) as (typeof defaultConfig)['popup'];

const bodyConfig = cva(currentConfig.body.base, {
  variants: {
    position: currentConfig.body.position,
  },
});

const classConfig = {
  popupConfig: currentConfig.popup.base,
  maskConfig: currentConfig.mask,
  bodyConfig,
  transitionConfig: currentConfig.transition,
};

export default classConfig;
