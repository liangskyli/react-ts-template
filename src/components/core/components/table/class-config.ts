import { cva } from 'class-variance-authority';
import { getComponentClassConfig } from '@/components/core/class-config';
import type { defaultConfig } from '@/components/core/class-config/default-config.ts';

const currentConfig = getComponentClassConfig(
  'table',
) as (typeof defaultConfig)['table'];

const containerConfig = cva(currentConfig.container.base, {
  variants: {
    defaultHeight: {
      true: currentConfig.container.defaultHeight,
    },
  },
});

const headerRowConfig = cva(currentConfig.header.base);
const headerCellConfig = cva(currentConfig.header.cell);

const bodyRowConfig = cva(currentConfig.body.row.base, {
  variants: {
    hover: {
      true: currentConfig.body.row.hover,
    },
    selected: {
      true: currentConfig.body.row.selected,
    },
  },
});

const bodyCellConfig = cva(currentConfig.body.cell);

const fixedLeftContainerConfig = cva(currentConfig.fixed.left.container);
const fixedRightContainerConfig = cva(currentConfig.fixed.right.container);

const classConfig = {
  containerConfig,
  headerRowConfig,
  headerCellConfig,
  bodyRowConfig,
  bodyCellConfig,
  fixedLeftContainerConfig,
  fixedRightContainerConfig,
  fixedLeftHeaderConfig: currentConfig.fixed.left.header,
  fixedLeftBodyConfig: currentConfig.fixed.left.body,
  fixedRightHeaderConfig: currentConfig.fixed.right.header,
  fixedRightBodyConfig: currentConfig.fixed.right.body,
  scrollbarHorizontalConfig: currentConfig.scrollbar.horizontal,
  scrollbarVerticalConfig: currentConfig.scrollbar.vertical,
  scrollbarThumbConfig: currentConfig.scrollbar.thumb,
};

export default classConfig;
