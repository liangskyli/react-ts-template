import { act, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Toast from '@/components/toast';

// Mock Mask组件
vi.mock('@/components/mask', () => ({
  default: ({
    visible,
    children,
    afterClose,
  }: {
    visible: boolean;
    children: React.ReactNode;
    afterClose?: () => void;
  }) => {
    if (!visible) {
      // 当 visible 变为 false 时，触发 afterClose
      setTimeout(() => {
        afterClose?.();
      }, 0);
      return null;
    }
    return <div data-testid="mask">{children}</div>;
  },
}));

describe('Toast Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    // 清理DOM和定时器
    Toast.clear();
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('should show toast with message', () => {
    const message = 'Test Message';
    act(() => {
      Toast.show(message);
    });

    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it('should clear toast', () => {
    const message = 'Test Message';
    act(() => {
      Toast.show(message);
    });

    expect(screen.getByText(message)).toBeInTheDocument();

    act(() => {
      Toast.clear();
    });

    expect(screen.queryByText(message)).not.toBeInTheDocument();
  });

  it('should auto close after duration', () => {
    const message = 'Test Message';
    const duration = 1000;

    act(() => {
      Toast.show(message, { duration });
    });

    expect(screen.getByText(message)).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(duration);
    });

    expect(screen.queryByText(message)).not.toBeInTheDocument();
  });

  it('should call afterClose callback', () => {
    const message = 'Test Message';
    const duration = 1000;
    const afterClose = vi.fn();

    act(() => {
      Toast.show(message, { duration, afterClose });
    });

    expect(screen.getByText(message)).toBeInTheDocument();

    // 等待 duration 时间，触发关闭
    act(() => {
      vi.advanceTimersByTime(duration);
    });

    // 等待 afterClose 的 setTimeout
    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(afterClose).toHaveBeenCalledTimes(1);
  });

  it('should handle multiple toasts', () => {
    const message1 = 'Message 1';
    const message2 = 'Message 2';

    act(() => {
      Toast.show(message1);
      Toast.show(message2);
    });

    // 只应显示最新的消息
    expect(screen.queryByText(message1)).not.toBeInTheDocument();
    expect(screen.getByText(message2)).toBeInTheDocument();
  });

  it('should handle React elements as message', () => {
    const CustomMessage = () => (
      <div data-testid="custom-message">Custom Message</div>
    );

    act(() => {
      Toast.show(<CustomMessage />);
    });

    expect(screen.getByTestId('custom-message')).toBeInTheDocument();
  });

  it('should return close function', () => {
    const message = 'Test Message';
    let closeToast: (() => void) | undefined;

    act(() => {
      closeToast = Toast.show(message);
    });

    expect(screen.getByText(message)).toBeInTheDocument();

    act(() => {
      closeToast?.();
    });

    expect(screen.queryByText(message)).not.toBeInTheDocument();
  });

  it('should handle undefined duration', () => {
    const message = 'Test Message';

    act(() => {
      Toast.show(message, { duration: undefined });
    });

    expect(screen.getByText(message)).toBeInTheDocument();

    // 默认持续时间应该是3000ms
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.queryByText(message)).not.toBeInTheDocument();
  });
});
