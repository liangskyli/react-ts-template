import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Mask from '@/components/mask';

// Mock Transition
vi.mock('@headlessui/react', () => ({
  Transition: ({
    show,
    children,
    afterLeave,
    destroyOnClose,
  }: {
    show: boolean;
    children: React.ReactNode;
    afterLeave?: () => void;
    destroyOnClose?: boolean;
  }) => {
    if (!show && destroyOnClose) {
      return null;
    }
    if (!show && afterLeave) {
      setTimeout(afterLeave, 0);
    }
    return show ? children : <div style={{ display: 'none' }}>{children}</div>;
  },
}));

vi.mock('@/utils/use-lock-scroll', () => {
  return {
    useLockScroll: () => vi.fn(),
  };
});

vi.mock('@/utils/render-to-container', () => {
  return {
    renderToContainer: (_container: unknown, node: unknown) => node,
  };
});

describe('Mask Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render nothing when visible is false and destroyOnClose is true', () => {
    const { container } = render(
      <Mask visible={false} destroyOnClose={true} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render with display none when visible is false and destroyOnClose is false', () => {
    const { container } = render(
      <Mask visible={false} destroyOnClose={false} />,
    );
    const maskElement = container.firstChild as HTMLElement;
    expect(maskElement).toBeInTheDocument();
    expect(maskElement.style.display).toBe('none');
  });

  it('should render visible mask with default className', () => {
    const { container } = render(<Mask visible={true} />);
    const maskElement = container.firstChild as HTMLElement;
    expect(maskElement).toBeInTheDocument();
    expect(maskElement).toHaveClass('fixed', 'inset-0', 'z-mask', 'bg-mask');
    expect(maskElement.style.display).not.toBe('none');
  });

  it('should render with custom className', () => {
    const customClass = 'custom-mask';
    const { container } = render(
      <Mask visible={true} className={customClass} />,
    );
    const maskElement = container.firstChild as HTMLElement;
    expect(maskElement).toHaveClass(customClass);
  });

  it('should call onMaskClick when clicking the mask', () => {
    const onMaskClick = vi.fn();
    render(
      <Mask visible={true} onMaskClick={onMaskClick}>
        <div data-testid="child">Content</div>
      </Mask>,
    );

    // 点击遮罩层背景应该触发回调
    const maskElement = screen.getByTestId('child').parentElement;
    fireEvent.click(maskElement!);
    expect(onMaskClick).toHaveBeenCalledTimes(1);

    // 点击子元素不应触发回调
    const childElement = screen.getByTestId('child');
    fireEvent.click(childElement);
    expect(onMaskClick).toHaveBeenCalledTimes(1);
  });

  it('should render children correctly', () => {
    const childText = 'Test Child Content';
    render(
      <Mask visible={true}>
        <div>{childText}</div>
      </Mask>,
    );

    expect(screen.getByText(childText)).toBeInTheDocument();
  });

  it('should handle visibility toggle with destroyOnClose', () => {
    const { container, rerender } = render(
      <Mask visible={true} destroyOnClose={true}>
        <div>Content</div>
      </Mask>,
    );
    expect(container.firstChild).toBeInTheDocument();

    rerender(
      <Mask visible={false} destroyOnClose={true}>
        <div>Content</div>
      </Mask>,
    );
    expect(container.firstChild).toBeNull();

    rerender(
      <Mask visible={true} destroyOnClose={true}>
        <div>Content</div>
      </Mask>,
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should use correct useLockScroll parameters', async () => {
    const useLockScrollSpy = vi.spyOn(
      await import('@/utils/use-lock-scroll'),
      'useLockScroll',
    );

    // 测试默认值 (disableBodyScroll = true)
    render(<Mask visible={true} />);
    expect(useLockScrollSpy).toHaveBeenLastCalledWith(expect.any(Object), true);

    // 测试显式设置 disableBodyScroll = false
    render(<Mask visible={true} disableBodyScroll={false} />);
    expect(useLockScrollSpy).toHaveBeenLastCalledWith(
      expect.any(Object),
      false,
    );

    // 测试 visible = false 时
    render(<Mask visible={false} disableBodyScroll={true} />);
    expect(useLockScrollSpy).toHaveBeenLastCalledWith(
      expect.any(Object),
      false,
    );

    useLockScrollSpy.mockRestore();
  });

  it('should use renderToContainer with correct parameters', async () => {
    const renderToContainerSpy = vi.spyOn(
      await import('@/utils/render-to-container'),
      'renderToContainer',
    );
    const customContainer = document.createElement('div');

    render(
      <Mask visible={true} getContainer={customContainer}>
        <div>Content</div>
      </Mask>,
    );

    expect(renderToContainerSpy).toHaveBeenCalledWith(
      customContainer,
      expect.any(Object),
    );

    renderToContainerSpy.mockRestore();
  });

  it('should handle getContainer function', async () => {
    const renderToContainerSpy = vi.spyOn(
      await import('@/utils/render-to-container'),
      'renderToContainer',
    );
    const getContainer = () => document.createElement('div');

    render(
      <Mask visible={true} getContainer={getContainer}>
        <div>Content</div>
      </Mask>,
    );

    expect(renderToContainerSpy).toHaveBeenCalledWith(
      getContainer,
      expect.any(Object),
    );

    renderToContainerSpy.mockRestore();
  });

  it('should call afterClose when mask is hidden', async () => {
    const afterClose = vi.fn();
    const { rerender } = render(
      <Mask visible={true} afterClose={afterClose}>
        <div>Content</div>
      </Mask>,
    );

    expect(afterClose).not.toHaveBeenCalled();

    rerender(
      <Mask visible={false} afterClose={afterClose}>
        <div>Content</div>
      </Mask>,
    );

    // 等待离场动画结束（200ms）
    await act(async () => {
      vi.advanceTimersByTime(200);
    });

    expect(afterClose).toHaveBeenCalledTimes(1);
  });
});
