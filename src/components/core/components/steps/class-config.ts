import { cva } from 'class-variance-authority';
import { getComponentClassConfig } from '@/components/core/class-config';
import type { defaultConfig } from '@/components/core/class-config/default-config.ts';

const currentConfig = getComponentClassConfig(
  'steps',
) as (typeof defaultConfig)['steps'];

const containerConfig = cva(currentConfig.container.base, {
  variants: {
    direction: currentConfig.container.direction,
  },
});

const itemConfig = cva(currentConfig.item.base, {
  variants: {
    direction: currentConfig.item.direction,
  },
});

const classConfig = {
  containerConfig,
  itemConfig,
  itemInnerConfig: currentConfig.itemInner,
  iconConfig: currentConfig.icon,
  contentConfig: currentConfig.content,
  indicatorContainerConfig: currentConfig.indicatorContainer,
  titleConfig: currentConfig.title,
  descriptionConfig: currentConfig.description,
};

export default classConfig;
