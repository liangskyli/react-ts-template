import { getComponentClassConfig } from '@/components/core/class-config';
import type { defaultConfig } from '@/components/core/class-config/default-config.ts';

const currentConfig = getComponentClassConfig(
  'viewerPdf',
) as (typeof defaultConfig)['viewerPdf'];

const classConfig = {
  containerConfig: currentConfig.container,
  toolBarConfig: currentConfig.toolBar,
  documentConfig: currentConfig.document,
  pageConfig: currentConfig.page,
};

export default classConfig;
