import type { ZoomPluginConfig } from '@embedpdf/plugin-zoom/react';
import { useZoom } from '@embedpdf/plugin-zoom/react';
import classConfig from '@/components/core/components/pdf-viewer/class-config.ts';
import {
  DefaultZoomInIcon,
  DefaultZoomOutIcon,
} from '@/components/core/components/pdf-viewer/icons.tsx';

const classConfigData = classConfig();

type IToolBarClassName = {
  /** 工具栏类名 */
  className?: string;
  /** 缩放按钮类名 */
  zoomButtonClassName?: string;
  /** 重置缩放按钮类名 */
  resetZoomButtonClassName?: string;
};
export type ZoomToolbarProps = {
  documentId: string;
  zoomPluginConfig: ZoomPluginConfig;
  toolBarClassName?: IToolBarClassName;
};

export const ZoomToolbar = (props: ZoomToolbarProps) => {
  const { documentId, zoomPluginConfig, toolBarClassName } = props;
  const { defaultZoomLevel, minZoom, maxZoom } = zoomPluginConfig;
  const { provides: zoom, state } = useZoom(documentId);
  if (!zoom) {
    return null;
  }
  const zoomPercentage = Math.round(state.currentZoomLevel * 100);
  const disabledMinZoom = !!minZoom && zoomPercentage <= minZoom * 100;
  const disabledMaxZoom = !!maxZoom && zoomPercentage >= maxZoom * 100;
  return (
    <div
      className={classConfigData.toolBarWrap({
        className: toolBarClassName?.className,
      })}
    >
      <button
        onClick={zoom.zoomOut}
        className={classConfigData.toolBarZoomButton({
          className: toolBarClassName?.zoomButtonClassName,
        })}
        title="缩小"
        disabled={disabledMinZoom}
        data-disabled={disabledMinZoom ? true : undefined}
      >
        <DefaultZoomOutIcon />
      </button>
      <button
        onClick={() => zoom.requestZoom(defaultZoomLevel)}
        className={classConfigData.toolBarResetZoomButton({
          className: toolBarClassName?.resetZoomButtonClassName,
        })}
      >
        {zoomPercentage}%
      </button>
      <button
        onClick={zoom.zoomIn}
        className={classConfigData.toolBarZoomButton({
          className: toolBarClassName?.zoomButtonClassName,
        })}
        title="放大"
        disabled={disabledMaxZoom}
        data-disabled={disabledMaxZoom ? true : undefined}
      >
        <DefaultZoomInIcon />
      </button>
    </div>
  );
};
