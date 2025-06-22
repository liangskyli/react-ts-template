import { cva } from 'class-variance-authority';
import { getComponentClassConfig } from '@/components/core/class-config';
import type { defaultConfig } from '@/components/core/class-config/default-config.ts';

const currentConfig = getComponentClassConfig(
  'tree',
) as (typeof defaultConfig)['tree'];

const treeConfig = cva(currentConfig.tree.base, {
  variants: {
    virtualScroll: {
      true: [
        currentConfig.tree.defaultScrollHeight,
        currentConfig.tree.isScroll,
      ],
    },
    infiniteScroll: {
      true: currentConfig.tree.isScroll,
    },
  },
});

const classConfig = {
  treeConfig,
  nodeConfig: currentConfig.node,
  nodeContentConfig: currentConfig.nodeContent,
  childrenConfig: currentConfig.children,
};

export default classConfig;
