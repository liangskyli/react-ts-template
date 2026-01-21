import { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import type { DocumentProps, PageProps } from 'react-pdf';
import classConfig from '@/components/core/components/viewer-pdf/class-config.ts';
import {
  DefaultZoomInIcon,
  DefaultZoomOutIcon,
} from '@/components/core/components/viewer-pdf/icons.tsx';

const classConfigData = classConfig();

// 设置 worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

type IToolBar =
  | boolean
  | {
      /** 工具栏类名 */
      className?: string;
      /** 缩放按钮类名 */
      zoomButtonClassName?: string;
      /** 重置缩放按钮类名 */
      resetZoomButtonClassName?: string;
    };

export type ViewerPdfProps = Pick<
  DocumentProps,
  'file' | 'loading' | 'error'
> & {
  /** 页属性 */
  pageProps?: Pick<PageProps, 'className' | 'scale'>;
  /** 工具栏 */
  toolBar?: IToolBar;
  /** 容器类名 */
  className?: string;
  /** 文档类名 */
  documentClassName?: string;
};

const SCALE_STEP = 0.1;
const MIN_SCALE = 0.5;
const MAX_SCALE = 2.0;
const DEFAULT_SCALE = 1.0;

const ViewerPdf = (props: ViewerPdfProps) => {
  const {
    file,
    error = '加载PDF失败',
    loading = '加载中...',
    className,
    toolBar,
    documentClassName,
  } = props;
  const { scale: initialScale = DEFAULT_SCALE, ...otherPageProps } =
    props.pageProps || {};
  const isShowToolBar = Boolean(toolBar);
  const toolBarConfig = toolBar === true ? {} : toolBar || {};
  const [numPages, setNumPages] = useState<number>(0);
  const [pageWidth, setPageWidth] = useState<number | undefined>(undefined);
  const [scale, setScale] = useState(initialScale);
  const documentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const resize = () => {
      const containerWidth = documentRef.current?.clientWidth;
      setPageWidth(containerWidth);
    };
    resize();

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  const onDocumentLoadSuccess: Required<DocumentProps>['onLoadSuccess'] = (
    document,
  ) => {
    const { numPages } = document;
    setNumPages(numPages);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('Error loading PDF:', error);
  };

  const handleZoomIn = () => {
    setScale((prevScale) =>
      Math.min(parseFloat((prevScale + SCALE_STEP).toFixed(1)), MAX_SCALE),
    );
  };

  const handleZoomOut = () => {
    setScale((prevScale) =>
      Math.max(parseFloat((prevScale - SCALE_STEP).toFixed(1)), MIN_SCALE),
    );
  };

  const handleResetZoom = () => {
    setScale(DEFAULT_SCALE);
  };

  return (
    <div
      className={classConfigData.container({ className })}
      data-tool-bar={isShowToolBar ? true : undefined}
    >
      {isShowToolBar && (
        <div
          className={classConfigData.toolBarWrap({
            className: toolBarConfig.className,
          })}
        >
          <button
            onClick={handleZoomOut}
            className={classConfigData.toolBarZoomButton({
              className: toolBarConfig.zoomButtonClassName,
            })}
            title="缩小"
            disabled={scale <= MIN_SCALE}
            data-disabled={scale <= MIN_SCALE ? true : undefined}
          >
            <DefaultZoomOutIcon />
          </button>
          <button
            onClick={handleResetZoom}
            className={classConfigData.toolBarResetZoomButton({
              className: toolBarConfig.resetZoomButtonClassName,
            })}
          >
            {Math.round(scale * 100)}%
          </button>
          <button
            onClick={handleZoomIn}
            className={classConfigData.toolBarZoomButton({
              className: toolBarConfig.zoomButtonClassName,
            })}
            title="放大"
            disabled={scale >= MAX_SCALE}
            data-disabled={scale >= MAX_SCALE ? true : undefined}
          >
            <DefaultZoomInIcon />
          </button>
        </div>
      )}
      <Document
        className={classConfigData.document({ className: documentClassName })}
        inputRef={documentRef}
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        loading={loading}
        error={error}
      >
        {Array.from(new Array(numPages), (_, index) => {
          return (
            <Page
              key={`page_${index + 1}`}
              className={classConfigData.page({
                className: otherPageProps.className,
              })}
              pageNumber={index + 1}
              width={pageWidth}
              scale={scale}
              renderAnnotationLayer={false}
              renderTextLayer={false}
              loading={loading}
            />
          );
        })}
      </Document>
    </div>
  );
};

export default ViewerPdf;
