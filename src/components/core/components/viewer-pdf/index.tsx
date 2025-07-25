import { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

export type ViewerPdfProps = {
  url: string;
  errText: string;
};

const ViewerPdf = (props: ViewerPdfProps) => {
  const { url, errText } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1.0);
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 渲染页面的函数
  const renderPage = async (pageNum: number, doc = pdfDoc) => {
    if (!doc) return;

    try {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const context = canvas.getContext('2d');
      if (!context) return;

      // 清除画布
      context.clearRect(0, 0, canvas.width, canvas.height);

      const page = await doc.getPage(pageNum);

      // 获取容器宽度
      const containerWidth = container.clientWidth - 40;

      // 获取原始尺寸
      const originalViewport = page.getViewport({ scale: 1.0 });

      // 计算缩放比例以适应容器宽度
      const initialScale = containerWidth / originalViewport.width;
      const viewport = page.getViewport({ scale: initialScale * scale });

      // 设置 canvas 尺寸
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      // 渲染页面
      await page.render({
        canvasContext: context,
        viewport,
        background: 'white',
        intent: 'display',
      }).promise;

      setIsLoading(false);
    } catch (error) {
      console.error('Error rendering page:', error);
      showError();
    }
  };

  // 加载 PDF 文档
  useEffect(() => {
    let isMounted = true;

    const loadPDF = async () => {
      try {
        setIsLoading(true);
        // 设置 worker 路径
        pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
          'pdfjs-dist/build/pdf.worker.min.mjs',
          import.meta.url
        ).toString();

        // 加载 PDF 文档
        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;

        if (!isMounted) return;

        setPdfDoc(pdf);
        setNumPages(pdf.numPages);
        await renderPage(1, pdf);
      } catch (error) {
        console.error('Error loading PDF:', error);
        showError();
      }
    };

    if (url) {
      loadPDF();
    }

    return () => {
      isMounted = false;
      if (pdfDoc) {
        pdfDoc.cleanup();
        setPdfDoc(null);
      }
    };
  }, [url]);

  const showError = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    canvas.width = 800;
    canvas.height = 100;
    context.fillStyle = '#f5f5f5';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#666';
    context.font = '14px Arial';
    context.fillText(errText || '加载 PDF 失败', 20, 50);
    setIsLoading(false);
  };

  const handlePrevPage = async () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      await renderPage(currentPage - 1);
    }
  };

  const handleNextPage = async () => {
    if (currentPage < numPages) {
      setCurrentPage(prev => prev + 1);
      await renderPage(currentPage + 1);
    }
  };

  const handleZoomIn = async () => {
    setScale(prev => {
      const newScale = prev + 0.1;
      renderPage(currentPage);
      return newScale;
    });
  };

  const handleZoomOut = async () => {
    setScale(prev => {
      const newScale = Math.max(0.1, prev - 0.1);
      renderPage(currentPage);
      return newScale;
    });
  };

  // 处理窗口大小变化
  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout;

    const handleResize = () => {
      // 使用防抖处理resize
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        renderPage(currentPage);
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [currentPage, scale]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        backgroundColor: '#f5f5f5',
        padding: '20px',
      }}
    >
      <div style={{
        marginBottom: '20px',
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <button
          onClick={handlePrevPage}
          disabled={currentPage <= 1 || isLoading}
          style={{ padding: '5px 10px' }}
        >
          上一页
        </button>
        <span>第 {currentPage} 页 / 共 {numPages} 页</span>
        <button
          onClick={handleNextPage}
          disabled={currentPage >= numPages || isLoading}
          style={{ padding: '5px 10px' }}
        >
          下一页
        </button>
        <button
          onClick={handleZoomOut}
          disabled={isLoading}
          style={{ padding: '5px 10px', marginLeft: '20px' }}
        >
          缩小
        </button>
        <span>{Math.round(scale * 100)}%</span>
        <button
          onClick={handleZoomIn}
          disabled={isLoading}
          style={{ padding: '5px 10px' }}
        >
          放大
        </button>
      </div>
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          padding: '10px 20px',
          borderRadius: '4px',
        }}>
          加载中...
        </div>
      )}
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: 'auto',
          backgroundColor: '#fff',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}
      />
    </div>
  );
};

export default ViewerPdf;
