import { cva } from 'class-variance-authority';
import { getComponentClassConfig } from '@/components/core/class-config';
import type { defaultConfig } from '@/components/core/class-config/default-config.ts';

const currentConfig = getComponentClassConfig(
  'popover',
) as (typeof defaultConfig)['popover'];

const popupMaskConfig = cva(currentConfig.index.popup.mask.base, {
  variants: {
    maskClickable: {
      true: currentConfig.index.popup.mask.maskClickable,
      false: currentConfig.index.popup.mask.noMaskClickable,
    },
  },
});
const floatingArrowDirectionConfig = cva(
  currentConfig.index.popup.floatingArrowDirection.base,
  {
    variants: {
      direction: currentConfig.index.popup.floatingArrowDirection.direction,
    },
  },
);
const floatingWrapConfig = cva(currentConfig.index.popup.floatingWrap.base, {
  variants: {
    direction: currentConfig.index.popup.floatingWrap.direction,
  },
});

const classConfig = {
  popoverConfig: currentConfig.index.base,
  popupConfig: currentConfig.index.popup.base,
  popupMaskConfig,
  popupBodyConfig: currentConfig.index.popup.body,
  floatingConfig: currentConfig.index.popup.floating,
  floatingWrapConfig,
  floatingContentConfig: currentConfig.index.popup.floatingContent,
  floatingArrowConfig: currentConfig.index.popup.floatingArrow,
  floatingArrowDirectionConfig,
};

export default classConfig;
