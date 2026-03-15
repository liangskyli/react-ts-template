import type { ZoomPluginConfig } from '@embedpdf/plugin-zoom/react';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PdfViewer from '@/components/core/components/pdf-viewer';

// Mock types
type MockEngine = {
  test: string;
};

type UsePdfiumEngineResult = {
  engine: MockEngine | null;
  isLoading: boolean;
  error?: Error | null;
};

// Setup mock function with proper type
const mockUsePdfiumEngine = vi.fn(
  (): UsePdfiumEngineResult => ({
    engine: { test: 'engine' },
    isLoading: false,
  }),
);

// Control DocumentContent state for testing
let documentContentState = {
  isLoaded: true,
  isError: false,
  isLoading: false,
};

vi.mock('@embedpdf/core', () => ({
  createPluginRegistration: vi.fn(),
}));

vi.mock('@embedpdf/core/react', () => ({
  EmbedPDF: ({
    engine,
    children,
  }: {
    engine: unknown;
    children: (props: { activeDocumentId: string }) => React.ReactNode;
  }) => (
    <div data-testid="embed-pdf" data-engine={JSON.stringify(engine)}>
      {children({
        activeDocumentId: 'test-doc-id',
      })}
    </div>
  ),
}));

vi.mock('@embedpdf/engines/react', () => ({
  usePdfiumEngine: () => mockUsePdfiumEngine(),
}));

vi.mock('@embedpdf/plugin-document-manager/react', () => ({
  DocumentManagerPluginPackage: 'DocumentManagerPluginPackage',
  DocumentContent: ({
    documentId,
    children,
  }: {
    documentId: string;
    children: (props: {
      isLoaded: boolean;
      isError?: boolean;
      isLoading?: boolean;
    }) => React.ReactNode;
  }) => (
    <div data-testid="document-content" data-document-id={documentId}>
      {children(documentContentState)}
    </div>
  ),
}));

vi.mock('@embedpdf/plugin-render/react', () => ({
  RenderPluginPackage: 'RenderPluginPackage',
  RenderLayer: ({
    documentId,
    pageIndex,
  }: {
    documentId: string;
    pageIndex: number;
  }) => (
    <div
      data-testid="render-layer"
      data-document-id={documentId}
      data-page-index={pageIndex}
    >
      Rendered Page
    </div>
  ),
}));

vi.mock('@embedpdf/plugin-scroll/react', () => ({
  ScrollPluginPackage: 'ScrollPluginPackage',
  Scroller: ({
    documentId,
    renderPage,
  }: {
    documentId: string;
    renderPage: (props: {
      width: number;
      height: number;
      pageIndex: number;
    }) => React.ReactNode;
  }) => (
    <div data-testid="scroller" data-document-id={documentId}>
      {renderPage({ width: 800, height: 600, pageIndex: 0 })}
    </div>
  ),
}));

vi.mock('@embedpdf/plugin-viewport/react', () => ({
  ViewportPluginPackage: 'ViewportPluginPackage',
  Viewport: ({
    documentId,
    className,
    children,
  }: {
    documentId: string;
    className?: string;
    children: React.ReactNode;
  }) => (
    <div
      data-testid="viewport"
      data-document-id={documentId}
      className={className}
    >
      {children}
    </div>
  ),
}));

vi.mock('@embedpdf/plugin-zoom/react', () => ({
  ZoomPluginPackage: 'ZoomPluginPackage',
  ZoomMode: {
    Automatic: 'automatic',
    FitPage: 'fit-page',
    FitWidth: 'fit-width',
  },
}));

vi.mock('@/components/core/components/pdf-viewer/zoom-toolbar.tsx', () => ({
  ZoomToolbar: ({
    documentId,
    zoomPluginConfig,
    toolBarClassName,
  }: {
    documentId: string;
    zoomPluginConfig: ZoomPluginConfig;
    toolBarClassName?: {
      className?: string;
      zoomButtonClassName?: string;
      resetZoomButtonClassName?: string;
    };
  }) => (
    <div
      data-testid="zoom-toolbar"
      data-document-id={documentId}
      data-toolbar-classname={toolBarClassName?.className || ''}
    >
      Zoom Toolbar - Min: {zoomPluginConfig.minZoom}, Max:{' '}
      {zoomPluginConfig.maxZoom}
    </div>
  ),
}));

describe('PdfViewer Component', () => {
  const defaultProps = {
    url: 'https://example.com/test.pdf',
  };

  describe('Loading State', () => {
    it('should show loading text when engine is loading', () => {
      mockUsePdfiumEngine.mockReturnValue({
        engine: null,
        isLoading: true,
      });

      render(<PdfViewer {...defaultProps} />);
      expect(screen.getByText('加载中...')).toBeInTheDocument();
    });

    it('should show loading text when engine is not available', () => {
      mockUsePdfiumEngine.mockReturnValue({
        engine: null,
        isLoading: false,
      });

      render(<PdfViewer {...defaultProps} />);
      expect(screen.getByText('加载中...')).toBeInTheDocument();
    });

    it('should show custom loading text', () => {
      mockUsePdfiumEngine.mockReturnValue({
        engine: null,
        isLoading: true,
      });

      render(<PdfViewer {...defaultProps} loadingText="Custom Loading..." />);
      expect(screen.getByText('Custom Loading...')).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should show error text when engine loading fails', () => {
      const mockError = new Error('Engine initialization failed');
      mockUsePdfiumEngine.mockReturnValue({
        engine: { test: 'engine' },
        isLoading: false,
        error: mockError,
      });

      render(<PdfViewer {...defaultProps} />);
      expect(screen.getByText('加载PDF失败')).toBeInTheDocument();
    });

    it('should show custom error text when engine loading fails', () => {
      const mockError = new Error('Engine initialization failed');
      mockUsePdfiumEngine.mockReturnValue({
        engine: { test: 'engine' },
        isLoading: false,
        error: mockError,
      });

      render(<PdfViewer {...defaultProps} loadError="Custom Error Message" />);
      expect(screen.getByText('Custom Error Message')).toBeInTheDocument();
    });

    it('should show custom error element when engine loading fails', () => {
      const mockError = new Error('Engine initialization failed');
      mockUsePdfiumEngine.mockReturnValue({
        engine: { test: 'engine' },
        isLoading: false,
        error: mockError,
      });

      const customErrorElement = (
        <div data-testid="custom-error">Error loading PDF</div>
      );

      render(<PdfViewer {...defaultProps} loadError={customErrorElement} />);
      expect(screen.getByTestId('custom-error')).toBeInTheDocument();
      expect(screen.getByText('Error loading PDF')).toBeInTheDocument();
    });
  });

  describe('Document Content State', () => {
    beforeEach(() => {
      mockUsePdfiumEngine.mockReturnValue({
        engine: { test: 'engine' },
        isLoading: false,
      });
      // Reset to default state before each test
      documentContentState = {
        isLoaded: true,
        isError: false,
        isLoading: false,
      };
    });

    it('should show loading text when document content is loading', () => {
      documentContentState = {
        isLoaded: false,
        isError: false,
        isLoading: true,
      };

      render(<PdfViewer {...defaultProps} />);
      expect(screen.getByText('加载中...')).toBeInTheDocument();
    });

    it('should show error text when document content loading fails', () => {
      documentContentState = {
        isLoaded: false,
        isError: true,
        isLoading: false,
      };

      render(<PdfViewer {...defaultProps} />);
      expect(screen.getByText('加载PDF失败')).toBeInTheDocument();
    });

    it('should show custom error text when document content loading fails', () => {
      documentContentState = {
        isLoaded: false,
        isError: true,
        isLoading: false,
      };

      render(
        <PdfViewer {...defaultProps} loadError="Document failed to load" />,
      );
      expect(screen.getByText('Document failed to load')).toBeInTheDocument();
    });

    it('should show custom loading text when document content is loading', () => {
      documentContentState = {
        isLoaded: false,
        isError: false,
        isLoading: true,
      };

      render(<PdfViewer {...defaultProps} loadingText="Custom loading..." />);
      expect(screen.getByText('Custom loading...')).toBeInTheDocument();
    });
  });

  describe('Basic Rendering', () => {
    beforeEach(() => {
      mockUsePdfiumEngine.mockReturnValue({
        engine: { test: 'engine' },
        isLoading: false,
      });
      // Reset to default state
      documentContentState = {
        isLoaded: true,
        isError: false,
        isLoading: false,
      };
    });

    it('should render EmbedPDF wrapper when engine is ready', () => {
      render(<PdfViewer {...defaultProps} />);
      const embedPdf = screen.getByTestId('embed-pdf');
      expect(embedPdf).toBeInTheDocument();
      expect(embedPdf).toHaveAttribute('data-engine');
    });

    it('should render DocumentContent', () => {
      render(<PdfViewer {...defaultProps} />);
      expect(screen.getByTestId('document-content')).toBeInTheDocument();
      expect(screen.getByTestId('document-content')).toHaveAttribute(
        'data-document-id',
        'test-doc-id',
      );
    });

    it('should render Viewport', () => {
      render(<PdfViewer {...defaultProps} />);
      const viewport = screen.getByTestId('viewport');
      expect(viewport).toBeInTheDocument();
      expect(viewport).toHaveAttribute('data-document-id', 'test-doc-id');
    });

    it('should render Scroller', () => {
      render(<PdfViewer {...defaultProps} />);
      const scroller = screen.getByTestId('scroller');
      expect(scroller).toBeInTheDocument();
      expect(scroller).toHaveAttribute('data-document-id', 'test-doc-id');
    });

    it('should render RenderLayer', () => {
      render(<PdfViewer {...defaultProps} />);
      const renderLayer = screen.getByTestId('render-layer');
      expect(renderLayer).toBeInTheDocument();
      expect(renderLayer).toHaveAttribute('data-document-id', 'test-doc-id');
      expect(renderLayer).toHaveAttribute('data-page-index', '0');
    });
  });

  describe('Toolbar Configuration', () => {
    beforeEach(() => {
      mockUsePdfiumEngine.mockReturnValue({
        engine: { test: 'engine' },
        isLoading: false,
      });
      // Reset to default state
      documentContentState = {
        isLoaded: true,
        isError: false,
        isLoading: false,
      };
    });

    it('should not show toolbar when toolBar is not provided', () => {
      render(<PdfViewer {...defaultProps} />);
      expect(screen.queryByTestId('zoom-toolbar')).not.toBeInTheDocument();
    });

    it('should not show toolbar when toolBar is false', () => {
      render(<PdfViewer {...defaultProps} toolBar={false} />);
      expect(screen.queryByTestId('zoom-toolbar')).not.toBeInTheDocument();
    });

    it('should show toolbar when toolBar is true', () => {
      render(<PdfViewer {...defaultProps} toolBar={true} />);
      const toolbar = screen.getByTestId('zoom-toolbar');
      expect(toolbar).toBeInTheDocument();
      expect(toolbar).toHaveAttribute('data-toolbar-classname', '');
    });

    it('should show toolbar with custom className when toolBar is object', () => {
      const customClassName = 'custom-toolbar-class';
      render(
        <PdfViewer
          {...defaultProps}
          toolBar={{
            className: customClassName,
          }}
        />,
      );
      const toolbar = screen.getByTestId('zoom-toolbar');
      expect(toolbar).toBeInTheDocument();
      expect(toolbar).toHaveAttribute(
        'data-toolbar-classname',
        customClassName,
      );
    });

    it('should pass zoom plugin config to toolbar', () => {
      const customConfig = {
        minZoom: 0.5,
        maxZoom: 3,
      };
      render(
        <PdfViewer
          {...defaultProps}
          toolBar={true}
          zoomPluginConfig={customConfig}
        />,
      );
      const toolbar = screen.getByTestId('zoom-toolbar');
      expect(toolbar).toHaveTextContent('Min: 0.5, Max: 3');
    });

    it('should merge zoom plugin config with default config', () => {
      const customConfig = {
        maxZoom: 4,
      };
      render(
        <PdfViewer
          {...defaultProps}
          toolBar={true}
          zoomPluginConfig={customConfig}
        />,
      );
      const toolbar = screen.getByTestId('zoom-toolbar');
      // Default minZoom is 0.2, custom maxZoom is 4
      expect(toolbar).toHaveTextContent('Min: 0.2, Max: 4');
    });
  });

  describe('Plugin Configuration', () => {
    beforeEach(() => {
      mockUsePdfiumEngine.mockReturnValue({
        engine: { test: 'engine' },
        isLoading: false,
      });
      // Reset to default state
      documentContentState = {
        isLoaded: true,
        isError: false,
        isLoading: false,
      };
    });

    it('should use default viewport config when not provided', () => {
      render(<PdfViewer {...defaultProps} />);
      expect(screen.getByTestId('viewport')).toBeInTheDocument();
    });

    it('should use default scroll config when not provided', () => {
      render(<PdfViewer {...defaultProps} />);
      expect(screen.getByTestId('scroller')).toBeInTheDocument();
    });

    it('should use default zoom config when not provided', () => {
      render(<PdfViewer {...defaultProps} toolBar={true} />);
      const toolbar = screen.getByTestId('zoom-toolbar');
      // Default config: minZoom: 0.2, maxZoom: 2
      expect(toolbar).toHaveTextContent('Min: 0.2, Max: 2');
    });

    it('should accept custom viewport config', () => {
      render(
        <PdfViewer
          {...defaultProps}
          viewportPluginConfig={{
            viewportGap: 20,
          }}
        />,
      );
      expect(screen.getByTestId('viewport')).toBeInTheDocument();
    });

    it('should accept custom scroll config', () => {
      render(
        <PdfViewer
          {...defaultProps}
          scrollPluginConfig={{
            defaultPageGap: 20,
          }}
        />,
      );
      expect(screen.getByTestId('scroller')).toBeInTheDocument();
    });

    it('should accept custom zoom config', () => {
      render(
        <PdfViewer
          {...defaultProps}
          toolBar={true}
          zoomPluginConfig={{
            defaultZoomLevel: 'FitHeight' as never,
            minZoom: 0.5,
            maxZoom: 3,
          }}
        />,
      );
      const toolbar = screen.getByTestId('zoom-toolbar');
      expect(toolbar).toHaveTextContent('Min: 0.5, Max: 3');
    });
  });

  describe('ClassName Customization', () => {
    beforeEach(() => {
      mockUsePdfiumEngine.mockReturnValue({
        engine: { test: 'engine' },
        isLoading: false,
      });
      // Reset to default state
      documentContentState = {
        isLoaded: true,
        isError: false,
        isLoading: false,
      };
    });

    it('should apply custom className to root container', () => {
      const customClass = 'custom-root-class';
      const { container } = render(
        <PdfViewer {...defaultProps} className={customClass} />,
      );
      expect(container.firstChild).toHaveClass(customClass);
    });

    it('should apply document wrap className', () => {
      const customClass = 'custom-document-wrap';
      render(
        <PdfViewer {...defaultProps} documentWrapClassName={customClass} />,
      );
      const documentWrap = screen.getByTestId('document-content').parentElement;
      expect(documentWrap).toHaveClass('custom-document-wrap');
    });

    it('should apply viewport className', () => {
      const customClass = 'custom-viewport';
      render(<PdfViewer {...defaultProps} viewportClassName={customClass} />);
      const viewport = screen.getByTestId('viewport');
      expect(viewport).toHaveClass('custom-viewport');
    });

    it('should apply multiple className layers correctly', () => {
      const { container } = render(
        <PdfViewer
          {...defaultProps}
          className="root-class"
          documentWrapClassName="document-class"
          viewportClassName="viewport-class"
        />,
      );
      expect(container.firstChild).toHaveClass('root-class');
      const documentWrap = screen.getByTestId('document-content').parentElement;
      expect(documentWrap).toHaveClass('document-class');
      expect(screen.getByTestId('viewport')).toHaveClass('viewport-class');
    });
  });

  describe('Props Validation', () => {
    beforeEach(() => {
      mockUsePdfiumEngine.mockReturnValue({
        engine: { test: 'engine' },
        isLoading: false,
      });
      // Reset to default state
      documentContentState = {
        isLoaded: true,
        isError: false,
        isLoading: false,
      };
    });

    it('should render with minimal required props', () => {
      render(<PdfViewer url="test.pdf" />);
      expect(screen.getByTestId('embed-pdf')).toBeInTheDocument();
    });

    it('should accept different URL formats', () => {
      const { rerender } = render(
        <PdfViewer url="https://example.com/test.pdf" />,
      );
      expect(screen.getByTestId('embed-pdf')).toBeInTheDocument();

      rerender(<PdfViewer url="http://example.com/test.pdf" />);
      expect(screen.getByTestId('embed-pdf')).toBeInTheDocument();

      rerender(<PdfViewer url="/relative/path/test.pdf" />);
      expect(screen.getByTestId('embed-pdf')).toBeInTheDocument();
    });

    it('should handle empty className gracefully', () => {
      render(<PdfViewer {...defaultProps} className="" />);
      expect(screen.getByTestId('embed-pdf')).toBeInTheDocument();
    });

    it('should handle undefined optional props', () => {
      render(
        <PdfViewer
          url="test.pdf"
          className={undefined}
          documentWrapClassName={undefined}
          viewportClassName={undefined}
        />,
      );
      expect(screen.getByTestId('embed-pdf')).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    beforeEach(() => {
      mockUsePdfiumEngine.mockReturnValue({
        engine: { test: 'engine' },
        isLoading: false,
      });
      // Reset to default state
      documentContentState = {
        isLoaded: true,
        isError: false,
        isLoading: false,
      };
    });

    it('should maintain correct DOM hierarchy', () => {
      const { container } = render(<PdfViewer {...defaultProps} />);
      const root = container.firstChild as HTMLElement;
      const embedPdf = root.querySelector('[data-testid="embed-pdf"]');
      const documentContent = embedPdf?.querySelector(
        '[data-testid="document-content"]',
      );
      const viewport = documentContent?.querySelector(
        '[data-testid="viewport"]',
      );
      const scroller = viewport?.querySelector('[data-testid="scroller"]');

      expect(root).toBeInTheDocument();
      expect(embedPdf).toBeInTheDocument();
      expect(documentContent).toBeInTheDocument();
      expect(viewport).toBeInTheDocument();
      expect(scroller).toBeInTheDocument();
    });

    it('should include toolbar in correct position when enabled', () => {
      render(<PdfViewer {...defaultProps} toolBar={true} />);
      const documentContent = screen.getByTestId('document-content');
      const toolbar = screen.getByTestId('zoom-toolbar');
      const viewport = screen.getByTestId('viewport');

      // Toolbar and viewport should both be rendered
      expect(documentContent).toBeInTheDocument();
      expect(toolbar).toBeInTheDocument();
      expect(viewport).toBeInTheDocument();

      // Check that toolbar appears before viewport in the DOM
      const toolbarHTML = documentContent.innerHTML;
      const toolbarIndex = toolbarHTML.indexOf('zoom-toolbar');
      const viewportIndex = toolbarHTML.indexOf('viewport');
      expect(toolbarIndex).toBeLessThan(viewportIndex);
    });
  });

  describe('Edge Cases', () => {
    beforeEach(() => {
      mockUsePdfiumEngine.mockReturnValue({
        engine: { test: 'engine' },
        isLoading: false,
      });
      // Reset to default state
      documentContentState = {
        isLoaded: true,
        isError: false,
        isLoading: false,
      };
    });

    it('should handle toolbar with empty object', () => {
      render(<PdfViewer {...defaultProps} toolBar={{}} />);
      const toolbar = screen.getByTestId('zoom-toolbar');
      expect(toolbar).toBeInTheDocument();
      expect(toolbar).toHaveAttribute('data-toolbar-classname', '');
    });

    it('should handle zoomPluginConfig as empty object', () => {
      render(
        <PdfViewer {...defaultProps} toolBar={true} zoomPluginConfig={{}} />,
      );
      const toolbar = screen.getByTestId('zoom-toolbar');
      // Should use default config
      expect(toolbar).toHaveTextContent('Min: 0.2, Max: 2');
    });

    it('should handle toolbar with partial className config', () => {
      render(
        <PdfViewer
          {...defaultProps}
          toolBar={{
            zoomButtonClassName: 'zoom-btn',
          }}
        />,
      );
      const toolbar = screen.getByTestId('zoom-toolbar');
      expect(toolbar).toBeInTheDocument();
      expect(toolbar).toHaveAttribute('data-toolbar-classname', '');
    });
  });
});
