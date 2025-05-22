import { cva } from 'class-variance-authority';
import { getComponentClassConfig } from '@/components/class-config';
import type { defaultConfig } from '@/components/class-config/default-config.ts';

const currentConfig = getComponentClassConfig(
  'toast',
) as (typeof defaultConfig)['toast'];

const maskConfig = cva(currentConfig.mask.base, {
  variants: {
    maskClickable: {
      true: currentConfig.mask.maskClickable,
      false: currentConfig.mask.noMaskClickable,
    },
  },
});
const bodyConfig = cva(currentConfig.body.base, {
  variants: {
    position: currentConfig.body.position,
  },
});

const classConfig = {
  toastConfig: currentConfig.toast,
  maskConfig,
  bodyConfig,
  contentConfig: currentConfig.content,
};

export default classConfig;
