import React from 'react';
import { act, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { SemanticClassNames } from '@/components/core/components/popup/popup.tsx';
import Toast from '@/components/core/components/toast';

// Mock Popup组件
vi.mock('@/components/core/components/popup/popup.tsx', () => {
  const MockPopup = ({
    visible,
    children,
    afterClose,
    onClose,
    destroyOnClose,
    duration = 0,
    className,
  }: {
    visible: boolean;
    children: React.ReactNode;
    afterClose?: () => void;
    onClose?: () => void;
    destroyOnClose?: boolean;
    duration?: number;
    className?: SemanticClassNames;
  }) => {
    const [shouldRender, setShouldRender] = React.useState(visible);

    React.useEffect(() => {
      if (visible) {
        setShouldRender(true);
      }
    }, [visible]);

    React.useEffect(() => {
      let timer: number;
      if (visible && duration > 0) {
        timer = window.setTimeout(() => {
          onClose?.();
        }, duration);
        return () => clearTimeout(timer);
      }
    }, [visible, duration, onClose]);

    React.useEffect(() => {
      if (!visible) {
        if (destroyOnClose) {
          setShouldRender(false);
          afterClose?.();
        }
      }
    }, [visible, afterClose, destroyOnClose]);

    if (!shouldRender) {
      return null;
    }

    return visible ? (
      <div data-testid="popup" className={className?.root}>
        <div data-testid="mask" className={className?.mask} />
        <div data-testid="body" className={className?.body}>
          {children}
        </div>
      </div>
    ) : null;
  };

  return {
    default: MockPopup,
  };
});

describe('Toast Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      Toast.clear(true); // 使用 ignoreAfterClose 确保完全清除
    });
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('should show toast with message', () => {
    act(() => {
      Toast.show('Test Message');
    });
    expect(screen.getByText('Test Message')).toBeInTheDocument();
  });

  it('should auto close after duration', async () => {
    const message = 'Test Message';
    const duration = 1000;

    act(() => {
      Toast.show(message, { duration });
    });
    expect(screen.getByText(message)).toBeInTheDocument();

    // 推进时间触发关闭
    act(() => {
      vi.advanceTimersByTime(duration);
    });

    // 等待一个事件循环以确保状态更新
    await act(async () => {
      await Promise.resolve();
    });

    // 确保销毁逻辑执行完成
    act(() => {
      vi.advanceTimersByTime(100);
    });

    // 再次等待状态更新
    await act(async () => {
      await Promise.resolve();
    });

    expect(screen.queryByText(message)).not.toBeInTheDocument();
  });

  it('should clear toast', async () => {
    act(() => {
      Toast.show('Test Message');
    });
    expect(screen.getByText('Test Message')).toBeInTheDocument();

    act(() => {
      Toast.clear();
    });

    // 等待销毁完成
    await act(async () => {
      await Promise.resolve();
      vi.advanceTimersByTime(100);
      await Promise.resolve();
    });

    expect(screen.queryByText('Test Message')).not.toBeInTheDocument();
  });

  it('should handle multiple toasts', () => {
    act(() => {
      Toast.show('Message 1');
      Toast.show('Message 2');
    });

    expect(screen.queryByText('Message 1')).not.toBeInTheDocument();
    expect(screen.getByText('Message 2')).toBeInTheDocument();
  });

  it('should return close function', () => {
    let closeToast: (() => void) | undefined;

    act(() => {
      closeToast = Toast.show('Test Message').close;
    });

    expect(screen.getByText('Test Message')).toBeInTheDocument();

    act(() => {
      closeToast?.();
      vi.runAllTimers();
    });

    expect(screen.queryByText('Test Message')).not.toBeInTheDocument();
  });
});

describe('Toast.config', () => {
  afterEach(() => {
    Toast.config({
      duration: 3000,
      position: 'center',
      maskClickable: false,
    });
    Toast.clear(true);
  });

  it('should update default config', () => {
    Toast.config({
      duration: 5000,
      position: 'top',
      maskClickable: true,
    });

    const config = Toast.getConfig();
    expect(config.duration).toBe(5000);
    expect(config.position).toBe('top');
    expect(config.maskClickable).toBe(true);
  });

  it('should use default position when no position is specified', () => {
    // First set a default position
    Toast.config({
      position: 'bottom',
    });

    // Show toast without specifying position
    act(() => {
      Toast.show('Test Message');
    });

    // Verify that the default position from config is used
    const body = screen.getByTestId('body');
    expect(body).toHaveClass('bottom-[20%]');
  });

  it('should use position from individual toast config over default config', () => {
    // Set a default position
    Toast.config({
      position: 'bottom',
    });

    // Show toast with specific position
    act(() => {
      Toast.show('Test Message', {
        position: 'top',
      });
    });

    // Verify that the specific position is used
    const body = screen.getByTestId('body');
    expect(body).toHaveClass('top-[20%]');
  });
});

describe('Toast position fallback logic', () => {
  beforeEach(() => {
    // 重置为默认配置
    Toast.config({
      duration: 3000,
      position: 'center',
      maskClickable: false,
    });
  });

  afterEach(() => {
    Toast.clear(true);
  });

  it('should use position from toast config when provided', () => {
    act(() => {
      Toast.show('Test Message', { position: 'top' });
    });

    const body = screen.getByTestId('body');
    expect(body).toHaveClass('top-[20%]');
  });

  it('should use position from global config when toast config position is undefined', () => {
    // 设置全局配置
    Toast.config({ position: 'bottom' });

    act(() => {
      Toast.show('Test Message', { duration: 1000 }); // 不设置 position
    });

    const body = screen.getByTestId('body');
    expect(body).toHaveClass('bottom-[20%]');
  });

  it('should use default position when neither toast config nor global config has position', () => {
    // 设置全局配置但不包含 position
    Toast.config({ duration: 1000 });

    act(() => {
      Toast.show('Test Message', { duration: 2000 }); // 不设置 position
    });

    const body = screen.getByTestId('body');
    expect(body).toHaveClass('top-1/2'); // 默认是 center 位置
  });

  it('should handle undefined position in both config and show call', () => {
    // 清除所有配置
    Toast.config({});

    act(() => {
      Toast.show('Test Message', {}); // 完全不设置 position
    });

    const body = screen.getByTestId('body');
    expect(body).toHaveClass('top-1/2'); // 应该使用 defaultConfig.position (center)
  });
});

describe('Toast Imperative API', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    // 清理所有提示和定时器
    Toast.clear(true);
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('shows toast imperatively', () => {
    act(() => {
      Toast.show('Test Content');
    });
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('accepts configuration options', () => {
    const afterClose = vi.fn();
    act(() => {
      Toast.show('Test Content', {
        position: 'top',
        duration: 1000,
        afterClose,
      });
    });

    expect(screen.getByText('Test Content')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
      vi.advanceTimersByTime(100); // 额外时间确保afterClose被调用
    });

    expect(afterClose).toHaveBeenCalled();
  });

  it('clears all toasts when calling clear', () => {
    act(() => {
      Toast.show('Toast 1');
      Toast.show('Toast 2');
    });

    expect(screen.queryByText('Toast 1')).not.toBeInTheDocument();
    expect(screen.getByText('Toast 2')).toBeInTheDocument();

    act(() => {
      Toast.clear();
      vi.advanceTimersByTime(100);
    });

    expect(screen.queryByText('Toast 2')).not.toBeInTheDocument();
  });

  it('handles timer cleanup correctly', () => {
    act(() => {
      Toast.show('Auto Close Content', { duration: 1000 });
    });

    act(() => {
      Toast.clear(true);
    });

    expect(screen.queryByText('Auto Close Content')).not.toBeInTheDocument();
  });
});
