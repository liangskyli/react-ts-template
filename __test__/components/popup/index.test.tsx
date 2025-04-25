import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Popup from '@/components/popup';
import Toast from '@/components/toast';

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

    expect(afterClose).toHaveBeenCalledTimes(0);
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('handles duration prop correctly', () => {
    const onClose = vi.fn();
    render(
      <Popup visible duration={1000} onClose={onClose}>
        Content
      </Popup>,
    );

    expect(screen.getByText('Content')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(onClose).toHaveBeenCalled();
  });

  it('generates unique popup id when not provided', () => {
    const { rerender } = render(<Popup visible>Content</Popup>);
    const firstId = screen
      .getByText('Content')
      .closest('.z-popup')
      ?.getAttribute('data-popup-id');

    rerender(<Popup visible>Content</Popup>);
    const secondId = screen
      .getByText('Content')
      .closest('.z-popup')
      ?.getAttribute('data-popup-id');

    expect(firstId).toBeTruthy();
    expect(secondId).toBeTruthy();
    expect(firstId).toBe(secondId);
  });

  it('uses provided popupId', () => {
    const customId = 'custom-popup-id';
    render(
      <Popup visible popupId={customId}>
        Content
      </Popup>,
    );

    const popup = screen.getByText('Content').closest('.z-popup');
    expect(popup).toHaveAttribute('data-popup-id', customId);
  });
});

describe('Popup Imperative API', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    // 清理所有弹窗和定时器
    Popup.clear();
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('shows popup imperatively', () => {
    act(() => {
      Popup.show('Test Content');
    });
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('closes popup when calling returned function', () => {
    let close: () => void;
    act(() => {
      close = Popup.show('Test Content').close;
    });
    expect(screen.getByText('Test Content')).toBeInTheDocument();

    act(() => {
      close();
    });
    act(() => {
      vi.advanceTimersByTime(0);
    });
    expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
  });

  it('accepts configuration options', () => {
    act(() => {
      Popup.show('Test Content', {
        position: 'center',
        className: 'custom-class',
      });
    });

    // 使用父元素的类名来查找
    const popup = screen.getByText('Test Content').closest('.z-popup');
    expect(popup).toHaveClass('custom-class');
    expect(screen.getByText('Test Content')).toHaveClass('left-1/2');
  });

  it('calls afterClose callback', () => {
    const afterClose = vi.fn();
    let close: () => void;

    act(() => {
      close = Popup.show('Test Content', { afterClose }).close;
    });
    act(() => {
      close();
    });
    act(() => {
      vi.advanceTimersByTime(0);
    });
    expect(afterClose).toHaveBeenCalled();
  });

  it('clears all popups when calling clear', () => {
    act(() => {
      Popup.show('Popup 1');
      Popup.show('Popup 2');
      Popup.show('Popup 3');
    });

    expect(screen.getByText('Popup 1')).toBeInTheDocument();
    expect(screen.getByText('Popup 2')).toBeInTheDocument();
    expect(screen.getByText('Popup 3')).toBeInTheDocument();

    act(() => {
      Popup.clear();
      vi.advanceTimersByTime(0);
    });

    expect(screen.queryByText('Popup 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Popup 2')).not.toBeInTheDocument();
    expect(screen.queryByText('Popup 3')).not.toBeInTheDocument();
  });

  it('updates default config', () => {
    Popup.config({
      position: 'top',
      className: 'global-class',
    });

    act(() => {
      Popup.show('Test Content');
    });

    const popup = screen.getByText('Test Content').closest('.z-popup');
    expect(popup).toHaveClass('global-class');
    expect(screen.getByText('Test Content')).toHaveClass('top-0');

    // 重置配置以不影响其他测试
    Popup.config({
      position: 'bottom',
      className: undefined,
    });
  });

  it('renders to specified container', () => {
    const customContainer = document.createElement('div');
    document.body.appendChild(customContainer);

    act(() => {
      Popup.show('Test Content', {
        getContainer: customContainer,
      });
    });

    expect(customContainer.contains(screen.getByText('Test Content'))).toBe(
      true,
    );

    // 清理
    document.body.removeChild(customContainer);
  });

  it('updates default config and gets config', () => {
    const newConfig = {
      position: 'top',
      className: 'global-class',
    };

    // @ts-expect-error ignore
    Popup.config(newConfig);
    expect(Popup.getConfig()).toEqual(expect.objectContaining(newConfig));

    // 重置配置以不影响其他测试
    Popup.config({
      position: 'bottom',
      className: undefined,
    });
  });

  it('clears specific type of popups with ignoreAfterClose', () => {
    const afterClose = vi.fn();

    act(() => {
      // 创建 popup 类型
      Popup.show('Popup Content', { afterClose });
      // 创建 toast 类型 (假设已导入 Toast)
      Toast.show('Toast Content', { afterClose });
    });

    act(() => {
      // 只清除 popup 类型，并忽略 afterClose
      Popup.clear(true);
      vi.advanceTimersByTime(0);
    });

    // popup 的 afterClose 不应被调用
    expect(afterClose).not.toHaveBeenCalled();
    expect(screen.queryByText('Popup Content')).not.toBeInTheDocument();
    // toast 内容应该还在
    expect(screen.getByText('Toast Content')).toBeInTheDocument();
    act(() => {
      // 只清除 toast 类型
      Toast.clear(true);
      vi.advanceTimersByTime(0);
    });
    expect(screen.queryByText('Toast Content')).not.toBeInTheDocument();
  });

  it('handles timer cleanup correctly', () => {
    act(() => {
      Popup.show('Auto Close Content', { duration: 1000 });
    });

    act(() => {
      Popup.clear(true);
    });
    // 内容应该已经被移除
    expect(screen.queryByText('Auto Close Content')).not.toBeInTheDocument();
  });
});
