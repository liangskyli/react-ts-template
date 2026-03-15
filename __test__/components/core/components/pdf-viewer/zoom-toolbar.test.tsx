import type { ZoomMode, ZoomPluginConfig } from '@embedpdf/plugin-zoom/react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ZoomToolbar } from '@/components/core/components/pdf-viewer/zoom-toolbar';

// Mock types
type MockZoomProvides = {
  zoomIn: ReturnType<typeof vi.fn>;
  zoomOut: ReturnType<typeof vi.fn>;
  requestZoom: ReturnType<typeof vi.fn>;
};

type UseZoomResult = {
  provides: MockZoomProvides | null;
  state: {
    currentZoomLevel: number;
  };
};

// Setup mock function with proper type
const mockUseZoom = vi.fn(
  (): UseZoomResult => ({
    provides: {
      zoomIn: vi.fn(),
      zoomOut: vi.fn(),
      requestZoom: vi.fn(),
    },
    state: {
      currentZoomLevel: 1,
    },
  }),
);

vi.mock('@embedpdf/plugin-zoom/react', () => ({
  useZoom: () => mockUseZoom(),
  ZoomMode: {
    Automatic: 'automatic',
    FitPage: 'fit-page',
    FitWidth: 'fit-width',
  },
}));

vi.mock('@/components/core/components/pdf-viewer/class-config.ts', () => ({
  default: vi.fn(() => ({
    toolBarWrap: vi.fn(
      (props?: { className?: string }) =>
        `toolbar-wrap ${props?.className || ''}`,
    ),
    toolBarZoomButton: vi.fn(
      (props?: { className?: string }) =>
        `zoom-button ${props?.className || ''}`,
    ),
    toolBarResetZoomButton: vi.fn(
      (props?: { className?: string }) =>
        `reset-button ${props?.className || ''}`,
    ),
  })),
}));

describe('ZoomToolbar Component', () => {
  const mockDocumentId = 'test-doc-id';
  const mockZoomProvides: MockZoomProvides = {
    zoomIn: vi.fn(),
    zoomOut: vi.fn(),
    requestZoom: vi.fn(),
  };

  const defaultZoomPluginConfig: ZoomPluginConfig = {
    defaultZoomLevel: 'fit-width' as ZoomMode,
    minZoom: 0.2,
    maxZoom: 2,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render nothing when zoom provides is not available', () => {
      mockUseZoom.mockReturnValue({
        provides: null,
        state: { currentZoomLevel: 1 },
      });

      const { container } = render(
        <ZoomToolbar
          documentId={mockDocumentId}
          zoomPluginConfig={defaultZoomPluginConfig}
        />,
      );
      expect(container.firstChild).toBeNull();
    });

    it('should render toolbar when zoom provides is available', () => {
      mockUseZoom.mockReturnValue({
        provides: mockZoomProvides,
        state: { currentZoomLevel: 1 },
      });

      render(
        <ZoomToolbar
          documentId={mockDocumentId}
          zoomPluginConfig={defaultZoomPluginConfig}
        />,
      );
      const toolbar = document.querySelector('.toolbar-wrap');
      expect(toolbar).toBeInTheDocument();
    });

    it('should display zoom percentage correctly', () => {
      mockUseZoom.mockReturnValue({
        provides: mockZoomProvides,
        state: { currentZoomLevel: 1.5 },
      });

      render(
        <ZoomToolbar
          documentId={mockDocumentId}
          zoomPluginConfig={defaultZoomPluginConfig}
        />,
      );
      expect(screen.getByText('150%')).toBeInTheDocument();
    });

    it('should render zoom out button', () => {
      mockUseZoom.mockReturnValue({
        provides: mockZoomProvides,
        state: { currentZoomLevel: 1 },
      });

      render(
        <ZoomToolbar
          documentId={mockDocumentId}
          zoomPluginConfig={defaultZoomPluginConfig}
        />,
      );
      expect(screen.getByTitle('缩小')).toBeInTheDocument();
    });

    it('should render zoom in button', () => {
      mockUseZoom.mockReturnValue({
        provides: mockZoomProvides,
        state: { currentZoomLevel: 1 },
      });

      render(
        <ZoomToolbar
          documentId={mockDocumentId}
          zoomPluginConfig={defaultZoomPluginConfig}
        />,
      );
      expect(screen.getByTitle('放大')).toBeInTheDocument();
    });

    it('should render reset button', () => {
      mockUseZoom.mockReturnValue({
        provides: mockZoomProvides,
        state: { currentZoomLevel: 1 },
      });

      render(
        <ZoomToolbar
          documentId={mockDocumentId}
          zoomPluginConfig={defaultZoomPluginConfig}
        />,
      );
      expect(screen.getByText('100%')).toBeInTheDocument();
    });
  });

  describe('Zoom Functionality', () => {
    it('should call zoomOut when zoom out button is clicked', () => {
      mockUseZoom.mockReturnValue({
        provides: mockZoomProvides,
        state: { currentZoomLevel: 1 },
      });

      render(
        <ZoomToolbar
          documentId={mockDocumentId}
          zoomPluginConfig={defaultZoomPluginConfig}
        />,
      );
      const zoomOutButton = screen.getByTitle('缩小');
      fireEvent.click(zoomOutButton);
      expect(mockZoomProvides.zoomOut).toHaveBeenCalledTimes(1);
    });

    it('should call zoomIn when zoom in button is clicked', () => {
      mockUseZoom.mockReturnValue({
        provides: mockZoomProvides,
        state: { currentZoomLevel: 1 },
      });

      render(
        <ZoomToolbar
          documentId={mockDocumentId}
          zoomPluginConfig={defaultZoomPluginConfig}
        />,
      );
      const zoomInButton = screen.getByTitle('放大');
      fireEvent.click(zoomInButton);
      expect(mockZoomProvides.zoomIn).toHaveBeenCalledTimes(1);
    });

    it('should call requestZoom with defaultZoomLevel when reset button is clicked', () => {
      mockUseZoom.mockReturnValue({
        provides: mockZoomProvides,
        state: { currentZoomLevel: 1.5 },
      });

      render(
        <ZoomToolbar
          documentId={mockDocumentId}
          zoomPluginConfig={defaultZoomPluginConfig}
        />,
      );
      const resetButton = screen.getByText('150%');
      fireEvent.click(resetButton);
      expect(mockZoomProvides.requestZoom).toHaveBeenCalledWith('fit-width');
    });

    it('should call requestZoom with custom defaultZoomLevel', () => {
      mockUseZoom.mockReturnValue({
        provides: mockZoomProvides,
        state: { currentZoomLevel: 1.5 },
      });

      const customConfig: ZoomPluginConfig = {
        defaultZoomLevel: 'fit-width' as ZoomMode,
        minZoom: 0.2,
        maxZoom: 2,
      };

      render(
        <ZoomToolbar
          documentId={mockDocumentId}
          zoomPluginConfig={customConfig}
        />,
      );
      const resetButton = screen.getByText('150%');
      fireEvent.click(resetButton);
      expect(mockZoomProvides.requestZoom).toHaveBeenCalledWith('fit-width');
    });
  });

  describe('Button State Management', () => {
    it('should disable zoom out button when at min zoom level', () => {
      mockUseZoom.mockReturnValue({
        provides: mockZoomProvides,
        state: { currentZoomLevel: 0.2 }, // Exactly at minZoom
      });

      render(
        <ZoomToolbar
          documentId={mockDocumentId}
          zoomPluginConfig={defaultZoomPluginConfig}
        />,
      );
      const zoomOutButton = screen.getByTitle('缩小');
      expect(zoomOutButton).toBeDisabled();
      expect(zoomOutButton).toHaveAttribute('data-disabled', 'true');
    });

    it('should disable zoom in button when at max zoom level', () => {
      mockUseZoom.mockReturnValue({
        provides: mockZoomProvides,
        state: { currentZoomLevel: 2 }, // Exactly at maxZoom
      });

      render(
        <ZoomToolbar
          documentId={mockDocumentId}
          zoomPluginConfig={defaultZoomPluginConfig}
        />,
      );
      const zoomInButton = screen.getByTitle('放大');
      expect(zoomInButton).toBeDisabled();
      expect(zoomInButton).toHaveAttribute('data-disabled', 'true');
    });

    it('should not disable zoom out button when above min zoom level', () => {
      mockUseZoom.mockReturnValue({
        provides: mockZoomProvides,
        state: { currentZoomLevel: 0.3 }, // Above minZoom (0.2)
      });

      render(
        <ZoomToolbar
          documentId={mockDocumentId}
          zoomPluginConfig={defaultZoomPluginConfig}
        />,
      );
      const zoomOutButton = screen.getByTitle('缩小');
      expect(zoomOutButton).not.toBeDisabled();
      expect(zoomOutButton).not.toHaveAttribute('data-disabled');
    });

    it('should not disable zoom in button when below max zoom level', () => {
      mockUseZoom.mockReturnValue({
        provides: mockZoomProvides,
        state: { currentZoomLevel: 1.5 }, // Below maxZoom (2)
      });

      render(
        <ZoomToolbar
          documentId={mockDocumentId}
          zoomPluginConfig={defaultZoomPluginConfig}
        />,
      );
      const zoomInButton = screen.getByTitle('放大');
      expect(zoomInButton).not.toBeDisabled();
      expect(zoomInButton).not.toHaveAttribute('data-disabled');
    });

    it('should handle undefined minZoom', () => {
      mockUseZoom.mockReturnValue({
        provides: mockZoomProvides,
        state: { currentZoomLevel: 0.1 },
      });

      const configWithoutMin: ZoomPluginConfig = {
        defaultZoomLevel: 'fit-width' as ZoomMode,
        maxZoom: 2,
      };

      render(
        <ZoomToolbar
          documentId={mockDocumentId}
          zoomPluginConfig={configWithoutMin}
        />,
      );
      const zoomOutButton = screen.getByTitle('缩小');
      expect(zoomOutButton).not.toBeDisabled();
    });

    it('should handle undefined maxZoom', () => {
      mockUseZoom.mockReturnValue({
        provides: mockZoomProvides,
        state: { currentZoomLevel: 5 },
      });

      const configWithoutMax: ZoomPluginConfig = {
        defaultZoomLevel: 'fit-width' as ZoomMode,
        minZoom: 0.2,
      };

      render(
        <ZoomToolbar
          documentId={mockDocumentId}
          zoomPluginConfig={configWithoutMax}
        />,
      );
      const zoomInButton = screen.getByTitle('放大');
      expect(zoomInButton).not.toBeDisabled();
    });
  });

  describe('ClassName Customization', () => {
    it('should apply custom toolbar className', () => {
      mockUseZoom.mockReturnValue({
        provides: mockZoomProvides,
        state: { currentZoomLevel: 1 },
      });

      const customClass = 'custom-toolbar-class';
      render(
        <ZoomToolbar
          documentId={mockDocumentId}
          zoomPluginConfig={defaultZoomPluginConfig}
          toolBarClassName={{
            className: customClass,
          }}
        />,
      );

      const toolbar = document.querySelector('.toolbar-wrap');
      expect(toolbar).toHaveClass('custom-toolbar-class');
    });

    it('should apply custom zoom button className', () => {
      mockUseZoom.mockReturnValue({
        provides: mockZoomProvides,
        state: { currentZoomLevel: 1 },
      });

      const customClass = 'custom-zoom-button';
      render(
        <ZoomToolbar
          documentId={mockDocumentId}
          zoomPluginConfig={defaultZoomPluginConfig}
          toolBarClassName={{
            zoomButtonClassName: customClass,
          }}
        />,
      );

      const zoomButtons = document.querySelectorAll('.zoom-button');
      zoomButtons.forEach((button) => {
        expect(button).toHaveClass('custom-zoom-button');
      });
    });

    it('should apply custom reset button className', () => {
      mockUseZoom.mockReturnValue({
        provides: mockZoomProvides,
        state: { currentZoomLevel: 1 },
      });

      const customClass = 'custom-reset-button';
      render(
        <ZoomToolbar
          documentId={mockDocumentId}
          zoomPluginConfig={defaultZoomPluginConfig}
          toolBarClassName={{
            resetZoomButtonClassName: customClass,
          }}
        />,
      );

      const resetButton = document.querySelector('.reset-button');
      expect(resetButton).toHaveClass('custom-reset-button');
    });

    it('should apply all custom classNames', () => {
      mockUseZoom.mockReturnValue({
        provides: mockZoomProvides,
        state: { currentZoomLevel: 1 },
      });

      render(
        <ZoomToolbar
          documentId={mockDocumentId}
          zoomPluginConfig={defaultZoomPluginConfig}
          toolBarClassName={{
            className: 'custom-toolbar',
            zoomButtonClassName: 'custom-zoom',
            resetZoomButtonClassName: 'custom-reset',
          }}
        />,
      );

      const toolbar = document.querySelector('.toolbar-wrap');
      const zoomButtons = document.querySelectorAll('.zoom-button');
      const resetButton = document.querySelector('.reset-button');

      expect(toolbar).toHaveClass('custom-toolbar');
      zoomButtons.forEach((button) => {
        expect(button).toHaveClass('custom-zoom');
      });
      expect(resetButton).toHaveClass('custom-reset');
    });

    it('should handle undefined toolBarClassName', () => {
      mockUseZoom.mockReturnValue({
        provides: mockZoomProvides,
        state: { currentZoomLevel: 1 },
      });

      render(
        <ZoomToolbar
          documentId={mockDocumentId}
          zoomPluginConfig={defaultZoomPluginConfig}
          toolBarClassName={undefined}
        />,
      );

      const toolbar = document.querySelector('.toolbar-wrap');
      expect(toolbar).toBeInTheDocument();
      expect(toolbar?.className).toBe('toolbar-wrap ');
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero zoom level', () => {
      mockUseZoom.mockReturnValue({
        provides: mockZoomProvides,
        state: { currentZoomLevel: 0 },
      });

      render(
        <ZoomToolbar
          documentId={mockDocumentId}
          zoomPluginConfig={defaultZoomPluginConfig}
        />,
      );
      expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('should handle very large zoom level', () => {
      mockUseZoom.mockReturnValue({
        provides: mockZoomProvides,
        state: { currentZoomLevel: 10 },
      });

      render(
        <ZoomToolbar
          documentId={mockDocumentId}
          zoomPluginConfig={defaultZoomPluginConfig}
        />,
      );
      expect(screen.getByText('1000%')).toBeInTheDocument();
    });

    it('should handle decimal zoom levels correctly', () => {
      mockUseZoom.mockReturnValue({
        provides: mockZoomProvides,
        state: { currentZoomLevel: 1.234 },
      });

      render(
        <ZoomToolbar
          documentId={mockDocumentId}
          zoomPluginConfig={defaultZoomPluginConfig}
        />,
      );
      expect(screen.getByText('123%')).toBeInTheDocument();
    });

    it('should handle numeric defaultZoomLevel', () => {
      mockUseZoom.mockReturnValue({
        provides: mockZoomProvides,
        state: { currentZoomLevel: 1.5 },
      });

      const numericConfig: ZoomPluginConfig = {
        defaultZoomLevel: 1.5,
        minZoom: 0.2,
        maxZoom: 2,
      };

      render(
        <ZoomToolbar
          documentId={mockDocumentId}
          zoomPluginConfig={numericConfig}
        />,
      );
      const resetButton = screen.getByText('150%');
      fireEvent.click(resetButton);
      expect(mockZoomProvides.requestZoom).toHaveBeenCalledWith(1.5);
    });
  });

  describe('Props Validation', () => {
    it('should handle documentId prop', () => {
      mockUseZoom.mockReturnValue({
        provides: mockZoomProvides,
        state: { currentZoomLevel: 1 },
      });

      render(
        <ZoomToolbar
          documentId={mockDocumentId}
          zoomPluginConfig={defaultZoomPluginConfig}
        />,
      );
      expect(document.querySelector('.toolbar-wrap')).toBeInTheDocument();
    });

    it('should handle zoomPluginConfig prop', () => {
      mockUseZoom.mockReturnValue({
        provides: mockZoomProvides,
        state: { currentZoomLevel: 1 },
      });

      render(
        <ZoomToolbar
          documentId={mockDocumentId}
          zoomPluginConfig={defaultZoomPluginConfig}
        />,
      );
      expect(document.querySelector('.toolbar-wrap')).toBeInTheDocument();
    });
  });
});
