import * as React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Popup from '@/components/popup';

// Mock Mask 组件
vi.mock('@/components/mask', () => ({
  default: ({
    visible,
    children,
    className,
    onMaskClick,
  }: {
    visible: boolean;
    children?: React.ReactNode;
    className?: string;
    onMaskClick?: () => void;
    destroyOnClose?: boolean;
  }) => {
    return (
      <div
        data-testid="mock-mask"
        className={className}
        onClick={onMaskClick}
        style={{ display: visible ? 'block' : 'none' }}
      >
        {children}
      </div>
    );
  },
}));

// Mock Transition 组件
vi.mock('@headlessui/react', () => ({
  Transition: ({
    show,
    children,
    unmount,
    afterLeave,
    beforeLeave,
    beforeEnter,
    afterEnter,
  }: {
    show: boolean;
    children: React.ReactNode;
    unmount?: boolean;
    afterLeave?: () => void;
    beforeLeave?: () => void;
    beforeEnter?: () => void;
    afterEnter?: () => void;
  }) => {
    React.useEffect(() => {
      if (show) {
        beforeEnter?.();
        // 确保在下一个微任务中执行 afterEnter
        Promise.resolve().then(() => {
          afterEnter?.();
        });
      } else {
        beforeLeave?.();
        Promise.resolve().then(() => {
          afterLeave?.();
        });
      }
    }, [show]);

    if (!show && unmount) {
      return null;
    }
    return children;
  },
  Fragment: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock renderToContainer
vi.mock('@/utils/render-to-container.ts', () => ({
  renderToContainer: (container: unknown, node: React.ReactNode) => {
    if (container) {
      return (
        <div
          data-testid="mock-container"
          data-container={
            container instanceof HTMLElement ? container.id : 'function'
          }
        >
          {node}
        </div>
      );
    }
    return node;
  },
}));

describe('Popup Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('should render nothing when visible is false and destroyOnClose is true', () => {
    render(
      <Popup visible={false} destroyOnClose={true}>
        <div>Content</div>
      </Popup>,
    );
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('should render with proper visibility when visible changes', () => {
    const { rerender } = render(
      <Popup visible={true}>
        <div>Content</div>
      </Popup>,
    );

    expect(screen.getByText('Content')).toBeInTheDocument();

    rerender(
      <Popup visible={false}>
        <div>Content</div>
      </Popup>,
    );

    expect(screen.queryByText('Content')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const customClass = 'custom-class';
    render(
      <Popup visible={true} className={customClass}>
        <div>Content</div>
      </Popup>,
    );

    const content = screen.getByText('Content').parentElement;
    expect(content).toHaveClass(customClass);
  });

  it('should apply custom maskClassName', () => {
    const maskClass = 'custom-mask';
    render(
      <Popup visible={true} maskClassName={maskClass}>
        <div>Content</div>
      </Popup>,
    );

    expect(screen.getByTestId('mock-mask')).toHaveClass(maskClass);
  });

  it('should call onClose when clicking mask and closeOnMaskClick is true', () => {
    const onClose = vi.fn();
    render(
      <Popup visible={true} onClose={onClose} closeOnMaskClick={true}>
        <div>Content</div>
      </Popup>,
    );

    fireEvent.click(screen.getByTestId('mock-mask'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should not call onClose when clicking mask and closeOnMaskClick is false', () => {
    const onClose = vi.fn();
    render(
      <Popup visible={true} onClose={onClose} closeOnMaskClick={false}>
        <div>Content</div>
      </Popup>,
    );

    fireEvent.click(screen.getByTestId('mock-mask'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('should call afterClose when popup is hidden', async () => {
    const afterClose = vi.fn();
    const { rerender } = render(
      <Popup visible={true} afterClose={afterClose}>
        <div>Content</div>
      </Popup>,
    );

    expect(afterClose).not.toHaveBeenCalled();

    rerender(
      <Popup visible={false} afterClose={afterClose}>
        <div>Content</div>
      </Popup>,
    );

    await act(async () => {
      vi.runAllTimers();
    });

    expect(afterClose).toHaveBeenCalledTimes(1);
  });

  it('should render to custom container', () => {
    const customContainer = document.createElement('div');
    customContainer.id = 'custom-container';

    render(
      <Popup visible={true} getContainer={customContainer}>
        <div>Content</div>
      </Popup>,
    );

    const containerWrapper = screen.getByTestId('mock-container');
    expect(containerWrapper).toHaveAttribute(
      'data-container',
      'custom-container',
    );
  });

  it('should render to container returned by function', () => {
    const getContainer = () => {
      const container = document.createElement('div');
      container.id = 'function-container';
      return container;
    };

    render(
      <Popup visible={true} getContainer={getContainer}>
        <div>Content</div>
      </Popup>,
    );

    const containerWrapper = screen.getByTestId('mock-container');
    expect(containerWrapper).toHaveAttribute('data-container', 'function');
  });

  it('should handle destroyOnClose correctly', async () => {
    const { rerender } = render(
      <Popup visible={true} destroyOnClose={true}>
        <div>Content</div>
      </Popup>,
    );

    expect(screen.getByText('Content')).toBeInTheDocument();

    rerender(
      <Popup visible={false} destroyOnClose={true}>
        <div>Content</div>
      </Popup>,
    );

    await act(async () => {
      vi.runAllTimers();
    });

    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('should handle pointer events based on transition state', async () => {
    const wrapper = render(
      <Popup visible={true}>
        <div>Content</div>
      </Popup>,
    );

    const popupContent = wrapper.container.querySelector('.z-1');

    // 初始状态应该是 none
    expect(popupContent).toHaveStyle({
      pointerEvents: 'none',
    });

    // 等待过渡完成
    await act(async () => {
      await Promise.resolve();
    });

    expect(popupContent).toHaveStyle({
      pointerEvents: 'auto',
    });

    // 重新渲染为不可见状态
    wrapper.rerender(
      <Popup visible={false}>
        <div>Content</div>
      </Popup>,
    );

    await act(async () => {
      await Promise.resolve();
    });
    expect(popupContent).toHaveStyle({
      pointerEvents: 'none',
    });
  });

  it('should apply correct position styles', () => {
    const positions: Array<'bottom' | 'top' | 'left' | 'right' | 'center'> = [
      'bottom',
      'top',
      'left',
      'right',
      'center',
    ];

    positions.forEach((position) => {
      const { container, unmount } = render(
        <Popup visible={true} position={position}>
          <div>Content</div>
        </Popup>,
      );

      const popupContent = container.querySelector('.z-1');

      // 验证位置相关的类名是否正确应用
      switch (position) {
        case 'bottom':
          expect(popupContent).toHaveClass('bottom-0', 'left-0', 'right-0');
          break;
        case 'top':
          expect(popupContent).toHaveClass('top-0', 'left-0', 'right-0');
          break;
        case 'left':
          expect(popupContent).toHaveClass('left-0', 'top-0', 'bottom-0');
          break;
        case 'right':
          expect(popupContent).toHaveClass('right-0', 'top-0', 'bottom-0');
          break;
        case 'center':
          expect(popupContent).toHaveClass('left-1/2', 'top-1/2');
          break;
      }

      unmount();
    });
  });
});
