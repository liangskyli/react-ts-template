import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Popup from '@/components/popup';

// Mock Mask组件
vi.mock('@/components/mask', () => ({
  default: ({
    visible,
    className,
    onMaskClick,
    children,
  }: {
    visible: boolean;
    className?: string;
    onMaskClick?: () => void;
    children?: React.ReactNode;
  }) => {
    if (!visible) return null;
    return (
      <div
        data-testid="mask"
        className={`mask ${className || ''}`}
        onClick={onMaskClick}
      >
        {children}
      </div>
    );
  },
}));

// Mock Transition组件
vi.mock('@headlessui/react', () => ({
  Transition: ({
    show,
    children,
    afterLeave,
    beforeEnter,
    afterEnter,
    beforeLeave,
  }: {
    show: boolean;
    children: React.ReactNode;
    afterLeave?: () => void;
    beforeEnter?: () => void;
    afterEnter?: () => void;
    beforeLeave?: () => void;
  }) => {
    if (!show) {
      beforeLeave?.();
      setTimeout(() => {
        afterLeave?.();
      }, 0);
      return null;
    }
    beforeEnter?.();
    setTimeout(() => {
      afterEnter?.();
    }, 0);
    return children;
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

  it('renders popup with default props', () => {
    render(<Popup visible>Content</Popup>);
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByTestId('mask')).toBeInTheDocument();
  });

  it('renders popup with different positions', () => {
    const { rerender } = render(
      <Popup visible position="bottom">
        Content
      </Popup>,
    );
    expect(screen.getByText('Content')).toHaveClass('bottom-0');

    rerender(
      <Popup visible position="top">
        Content
      </Popup>,
    );
    expect(screen.getByText('Content')).toHaveClass('top-0');

    rerender(
      <Popup visible position="left">
        Content
      </Popup>,
    );
    expect(screen.getByText('Content')).toHaveClass('left-0');

    rerender(
      <Popup visible position="right">
        Content
      </Popup>,
    );
    expect(screen.getByText('Content')).toHaveClass('right-0');

    rerender(
      <Popup visible position="center">
        Content
      </Popup>,
    );
    expect(screen.getByText('Content')).toHaveClass('left-1/2');
  });

  it('handles close on mask click', () => {
    const onClose = vi.fn();
    render(
      <Popup visible closeOnMaskClick onClose={onClose}>
        Content
      </Popup>,
    );

    fireEvent.click(screen.getByTestId('mask'));
    expect(onClose).toHaveBeenCalled();
  });

  it('does not close on mask click when closeOnMaskClick is false', () => {
    const onClose = vi.fn();
    render(
      <Popup visible closeOnMaskClick={false} onClose={onClose}>
        Content
      </Popup>,
    );

    fireEvent.click(screen.getByTestId('mask'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('destroys content when destroyOnClose is true', () => {
    const { rerender } = render(
      <Popup visible destroyOnClose>
        Content
      </Popup>,
    );
    expect(screen.getByText('Content')).toBeInTheDocument();

    rerender(
      <Popup visible={false} destroyOnClose>
        Content
      </Popup>,
    );
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('calls afterClose callback', async () => {
    const afterClose = vi.fn();
    const { rerender } = render(
      <Popup visible afterClose={afterClose}>
        Content
      </Popup>,
    );

    rerender(
      <Popup visible={false} afterClose={afterClose}>
        Content
      </Popup>,
    );

    // 等待过渡动画完成
    vi.advanceTimersByTime(0);
    expect(afterClose).toHaveBeenCalled();
  });

  it('handles transition states correctly', () => {
    const { rerender } = render(<Popup visible>Content</Popup>);

    vi.advanceTimersByTime(0);
    expect(screen.getByText('Content').parentElement).toHaveStyle({
      pointerEvents: 'auto',
    });

    rerender(<Popup visible={false}>Content</Popup>);
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('applies custom className props', () => {
    render(
      <Popup
        visible
        className="custom-class"
        maskClassName="custom-mask"
        bodyClassName="custom-body"
      >
        Content
      </Popup>,
    );

    expect(screen.getByTestId('mask')).toHaveClass('custom-mask');
    expect(screen.getByText('Content')).toHaveClass('custom-body');
    expect(screen.getByTestId('mask').parentElement).toHaveClass(
      'custom-class',
    );
  });

  it('calls afterClose immediately when visible is false and destroyOnClose is true', () => {
    const afterClose = vi.fn();
    render(
      <Popup visible={false} destroyOnClose afterClose={afterClose}>
        Content
      </Popup>,
    );

    expect(afterClose).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });
});
