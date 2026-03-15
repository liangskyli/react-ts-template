import type { ReactNode } from 'react';
import { createPluginRegistration } from '@embedpdf/core';
import { EmbedPDF } from '@embedpdf/core/react';
import { usePdfiumEngine } from '@embedpdf/engines/react';
import {
  DocumentContent,
  DocumentManagerPluginPackage,
} from '@embedpdf/plugin-document-manager/react';
import {
  RenderLayer,
  RenderPluginPackage,
} from '@embedpdf/plugin-render/react';
import type { ScrollPluginConfig } from '@embedpdf/plugin-scroll/react';
import { ScrollPluginPackage, Scroller } from '@embedpdf/plugin-scroll/react';
// Import the essential plugins
import type { ViewportPluginConfig } from '@embedpdf/plugin-viewport/react';
import {
  Viewport,
  ViewportPluginPackage,
} from '@embedpdf/plugin-viewport/react';
import type { ZoomPluginConfig } from '@embedpdf/plugin-zoom/react';
import { ZoomMode, ZoomPluginPackage } from '@embedpdf/plugin-zoom/react';
import classConfig from './class-config.ts';
import type { ZoomToolbarProps } from './zoom-toolbar.tsx';
import { ZoomToolbar } from './zoom-toolbar.tsx';

const classConfigData = classConfig();

type PluginsProps = {
  url: string;
  viewportPluginConfig?: Partial<ViewportPluginConfig>;
  scrollPluginConfig?: Partial<ScrollPluginConfig>;
  zoomPluginConfig?: Partial<ZoomPluginConfig>;
};
type CommonProps = {
  className?: string;
  documentWrapClassName?: string;
  viewportClassName?: string;
  toolBar?: boolean | ZoomToolbarProps['toolBarClassName'];
  loadingText?: ReactNode;
  loadError?: ReactNode;
};
type PDFViewerProps = CommonProps & PluginsProps;

// 1. Register the plugins you need
const getPlugins = (config: PluginsProps) => {
  const { url, viewportPluginConfig, scrollPluginConfig, zoomPluginConfig } =
    config;
  return [
    createPluginRegistration(DocumentManagerPluginPackage, {
      initialDocuments: [{ url: url }],
    }),
    createPluginRegistration(ViewportPluginPackage, viewportPluginConfig),
    createPluginRegistration(ScrollPluginPackage, scrollPluginConfig),
    createPluginRegistration(RenderPluginPackage),
    // Add the zoom plugin to the array
    createPluginRegistration(ZoomPluginPackage, zoomPluginConfig),
  ];
};
const defaultZoomPluginConfig = {
  defaultZoomLevel: ZoomMode.FitWidth,
  minZoom: 0.2,
  maxZoom: 2,
};

const PdfViewer = (props: PDFViewerProps) => {
  const {
    className,
    documentWrapClassName,
    viewportClassName,
    toolBar,
    loadingText = '加载中...',
    loadError = '加载PDF失败',
    url,
    viewportPluginConfig = { viewportGap: 10 },
    scrollPluginConfig = { defaultPageGap: 10 },
    zoomPluginConfig,
  } = props;
  const mergedConfig = {
    ...defaultZoomPluginConfig,
    ...zoomPluginConfig,
  };
  const isShowZoomToolBar = Boolean(toolBar);
  const toolBarClassName = toolBar === true ? undefined : toolBar || undefined;
  // 2. Initialize the engine with the React hook
  const { engine, isLoading, error } = usePdfiumEngine();

  if (isLoading || !engine) {
    return <div className={classConfigData.loadingText()}>{loadingText}</div>;
  }
  if (error) {
    return loadError;
  }

  // 3. Wrap your UI with the <EmbedPDF> provider
  return (
    <div className={className}>
      <EmbedPDF
        engine={engine}
        plugins={getPlugins({
          url,
          viewportPluginConfig,
          scrollPluginConfig,
          zoomPluginConfig: mergedConfig,
        })}
      >
        {({ activeDocumentId }) =>
          activeDocumentId && (
            <div
              className={classConfigData.documentWrap({
                className: documentWrapClassName,
              })}
            >
              {isShowZoomToolBar && (
                <ZoomToolbar
                  documentId={activeDocumentId}
                  zoomPluginConfig={mergedConfig}
                  toolBarClassName={toolBarClassName}
                />
              )}
              <DocumentContent documentId={activeDocumentId}>
                {({ isLoaded, isError, isLoading }) => {
                  if (isLoading) {
                    return loadingText;
                  }
                  if (isError) {
                    return loadError;
                  }
                  return (
                    isLoaded && (
                      <Viewport
                        documentId={activeDocumentId}
                        className={classConfigData.viewport({
                          className: viewportClassName,
                        })}
                      >
                        <Scroller
                          documentId={activeDocumentId}
                          renderPage={({ width, height, pageIndex }) => (
                            <div style={{ width, height }}>
                              {/* The RenderLayer is responsible for drawing the page */}
                              <RenderLayer
                                documentId={activeDocumentId}
                                pageIndex={pageIndex}
                              />
                            </div>
                          )}
                        />
                      </Viewport>
                    )
                  );
                }}
              </DocumentContent>
            </div>
          )
        }
      </EmbedPDF>
    </div>
  );
};
export default PdfViewer;
