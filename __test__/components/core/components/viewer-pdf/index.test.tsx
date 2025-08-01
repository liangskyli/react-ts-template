import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cn } from '@/components/core/class-config';
import ViewerPdf from '@/components/core/components/viewer-pdf';
import classConfig from '@/components/core/components/viewer-pdf/class-config';

// Mock react-pdf
vi.mock('react-pdf', () => {
  const MockDocument = vi.fn(
    ({
      children,
      className,
      onLoadSuccess,
      onLoadError,
      loading,
      error,
      file,
      inputRef,
    }) => {
      if (file === 'invalid-file.pdf') {
        onLoadError(new Error('Failed to load PDF'));
      } else if (file instanceof Blob) {
        // 模拟成功加载，设置页数为 3
        setTimeout(() => {
          // 模拟 ref 的设置
          if (inputRef?.current) {
            Object.defineProperty(inputRef.current, 'clientWidth', {
              configurable: true,
              value: 800,
            });
          }
          onLoadSuccess({ numPages: 3 });
        }, 0);
      } else if (file === 'empty.pdf') {
        // 模拟加载一个空的 PDF（0 页）
        setTimeout(() => {
          onLoadSuccess({ numPages: 0 });
        }, 0);
      }
      return (
        <div ref={inputRef} className={className} data-testid="mock-document">
          {loading && <div data-testid="loading-text">{loading}</div>}
          {error && <div data-testid="error-text">{error}</div>}
          {children}
        </div>
      );
    },
  );

  const MockPage = vi.fn(({ className, pageNumber, width }) => {
    return (
      <div
        className={className}
        data-testid={`mock-page-${pageNumber}`}
        data-width={width}
      >
        Page {pageNumber}
      </div>
    );
  });

  return {
    Document: MockDocument,
    Page: MockPage,
    pdfjs: {
      GlobalWorkerOptions: {
        workerSrc: '',
      },
    },
  };
});

// Mock console.error to prevent logging during tests
const mockConsoleError = vi
  .spyOn(console, 'error')
  .mockImplementation(() => {});

// Mock window resize event
const mockResizeEvent = () => {
  const resizeEvent = new Event('resize');
  window.dispatchEvent(resizeEvent);
};

describe('ViewerPdf', () => {
  const mockFile = new Blob(['dummy pdf content'], { type: 'application/pdf' });

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
  });

  afterEach(() => {
    mockConsoleError.mockClear();
  });

  it('应该渲染加载状态', () => {
    const customLoading = '正在加载PDF...';
    render(<ViewerPdf file={null} loading={customLoading} />);
    expect(screen.getByTestId('loading-text')).toHaveTextContent(customLoading);
  });

  it('应该渲染错误状态', () => {
    const customError = 'PDF加载失败了';
    render(<ViewerPdf file={null} error={customError} />);
    expect(screen.getByTestId('error-text')).toHaveTextContent(customError);
  });

  it('应该应用自定义类名', () => {
    const customClassName = 'custom-pdf-viewer';
    const customPageClassName = 'custom-pdf-page';
    render(
      <ViewerPdf
        file={null}
        documentClassName={customClassName}
        pageProps={{ className: customPageClassName }}
      />,
    );

    expect(screen.getByTestId('mock-document')).toHaveClass(
      cn(classConfig.documentConfig, customClassName),
    );
  });

  it('应该处理PDF加载错误', () => {
    render(<ViewerPdf file="invalid-file.pdf" />);
    expect(mockConsoleError).toHaveBeenCalledWith(
      'Error loading PDF:',
      expect.any(Error),
    );
  });

  it('应该正确处理PDF加载成功并渲染页面', async () => {
    render(<ViewerPdf file={mockFile} />);

    // 等待异步的 onLoadSuccess 调用和 resize 事件处理
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
      // 触发一次 resize 事件以确保宽度被设置
      mockResizeEvent();
      // 等待 resize 事件处理完成
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // 验证页面渲染
    for (let i = 1; i <= 3; i++) {
      const pageElement = screen.getByTestId(`mock-page-${i}`);
      expect(pageElement).toBeInTheDocument();
      expect(pageElement).toHaveTextContent(`Page ${i}`);
      // 验证 width 属性被正确设置
      expect(pageElement.getAttribute('data-width')).toBe('800');
    }
  });

  it('应该使用正确的页面配置', async () => {
    const customPageClassName = 'custom-page';
    render(
      <ViewerPdf
        file={mockFile}
        pageProps={{ className: customPageClassName }}
      />,
    );

    // 等待异步的 onLoadSuccess 调用
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
      mockResizeEvent();
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const pageElement = screen.getByTestId('mock-page-1');
    expect(pageElement).toHaveClass(
      cn(classConfig.pageConfig, customPageClassName),
    );
  });

  it('应该在没有提供自定义类名时使用默认类名', () => {
    render(<ViewerPdf file={mockFile} />);

    const documentElement = screen.getByTestId('mock-document');
    expect(documentElement).toHaveClass(classConfig.documentConfig.join(' '));
  });

  it('应该正确处理空PDF（0页）的情况', async () => {
    render(<ViewerPdf file="empty.pdf" />);

    // 等待异步的 onLoadSuccess 调用
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
      mockResizeEvent();
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // 验证没有渲染任何页面
    expect(screen.queryByTestId(/mock-page-/)).not.toBeInTheDocument();
  });

  it('应该响应窗口resize事件', async () => {
    render(<ViewerPdf file={mockFile} />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
      mockResizeEvent();
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const pageElement = screen.getByTestId('mock-page-1');
    expect(pageElement.getAttribute('data-width')).toBe('800');
  });

  describe('工具栏功能', () => {
    it('默认不显示工具栏', () => {
      render(<ViewerPdf file={mockFile} />);
      expect(screen.queryByTitle('缩小')).not.toBeInTheDocument();
      expect(screen.queryByTitle('放大')).not.toBeInTheDocument();
    });

    it('当toolBar为true时显示工具栏', () => {
      render(<ViewerPdf file={mockFile} toolBar={true} />);
      expect(screen.getByTitle('缩小')).toBeInTheDocument();
      expect(screen.getByTitle('放大')).toBeInTheDocument();
    });

    it('应用自定义工具栏样式', () => {
      const customToolBarClass = 'custom-toolbar';
      const customZoomButtonClass = 'custom-zoom-btn';
      const customResetButtonClass = 'custom-reset-btn';

      render(
        <ViewerPdf
          file={mockFile}
          toolBar={{
            className: customToolBarClass,
            zoomButtonClassName: customZoomButtonClass,
            resetZoomButtonClassName: customResetButtonClass,
          }}
        />,
      );

      const toolbar = screen.getByTitle('缩小').closest('div');
      expect(toolbar).toHaveClass(
        cn(classConfig.toolBarConfig.wrap, customToolBarClass),
      );

      const zoomOutButton = screen.getByTitle('缩小');
      expect(zoomOutButton).toHaveClass(
        cn(classConfig.toolBarConfig.zoomButton, customZoomButtonClass),
      );

      const resetButton = screen.getByText(/\d+%/);
      expect(resetButton).toHaveClass(
        cn(classConfig.toolBarConfig.resetZoomButton, customResetButtonClass),
      );
    });

    it('缩放功能工作正常', async () => {
      render(<ViewerPdf file={mockFile} toolBar={true} />);

      // 等待PDF加载完成
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
        mockResizeEvent();
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      const zoomInButton = screen.getByTitle('放大');
      const zoomOutButton = screen.getByTitle('缩小');
      const scaleDisplay = screen.getByText('100%');

      // 测试放大
      fireEvent.click(zoomInButton);
      expect(screen.getByText('110%')).toBeInTheDocument();

      // 测试缩小
      fireEvent.click(zoomOutButton);
      expect(screen.getByText('100%')).toBeInTheDocument();

      // 测试重置
      fireEvent.click(zoomInButton); // 先放大
      fireEvent.click(scaleDisplay); // 点击重置
      expect(screen.getByText('100%')).toBeInTheDocument();
    });

    it('缩放按钮在达到极限值时禁用', async () => {
      render(
        <ViewerPdf
          file={mockFile}
          toolBar={true}
          pageProps={{ scale: 0.5 }} // 从最小比例开始
        />,
      );

      // 等待PDF加载完成
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
        mockResizeEvent();
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      const zoomOutButton = screen.getByTitle('缩小');
      expect(zoomOutButton).toHaveAttribute('data-disabled', 'true');

      // 放大到最大值
      const zoomInButton = screen.getByTitle('放大');
      for (let i = 0; i < 15; i++) {
        // 多点几次确保达到最大值
        fireEvent.click(zoomInButton);
      }

      expect(zoomInButton).toHaveAttribute('data-disabled', 'true');
      expect(screen.getByText('200%')).toBeInTheDocument();
    });
  });
});
