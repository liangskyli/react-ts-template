import { cva } from 'class-variance-authority';
import { getComponentClassConfig } from '@/components/class-config';
import type { defaultConfig } from '@/components/class-config/default-config.ts';

const currentConfig = getComponentClassConfig(
  'textarea',
) as (typeof defaultConfig)['textarea'];

const textareaConfig = cva(currentConfig.textarea.base, {
  variants: {
    readOnly: {
      false: currentConfig.textarea.noReadOnly,
    },
  },
});

const classConfig = {
  textareaWrapConfig: currentConfig.textareaWrap,
  textareaConfig,
  countConfig: currentConfig.count,
};

export default classConfig;
