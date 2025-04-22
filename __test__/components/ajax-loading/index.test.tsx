import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import AjaxLoading from '@/components/ajax-loading';

// Mock Mask组件
vi.mock('@/components/mask', () => ({
  default: ({ visible, children, className }: never) =>
    visible ? (
      <div data-testid="mask" className={className}>
        {children}
      </div>
    ) : null,
}));

// Mock Loading组件
vi.mock('@/router/utils/loading.tsx', () => ({
  default: () => <div data-testid="loading">Loading Component</div>,
}));

describe('AjaxLoading Component', () => {
  it('should not render when visible is false', () => {
    const { queryByTestId } = render(<AjaxLoading visible={false} />);
    expect(queryByTestId('mask')).toBeNull();
    expect(queryByTestId('loading')).toBeNull();
  });

  it('should render when visible is true', () => {
    const { getByTestId } = render(<AjaxLoading visible={true} />);
    const maskElement = getByTestId('mask');
    const loadingElement = getByTestId('loading');

    expect(maskElement).toBeInTheDocument();
    expect(maskElement).toHaveClass('bg-mask/0');
    expect(loadingElement).toBeInTheDocument();
  });

  it('should toggle visibility based on prop changes', () => {
    const { queryByTestId, rerender } = render(<AjaxLoading visible={false} />);

    // 初始状态：不可见
    expect(queryByTestId('mask')).toBeNull();
    expect(queryByTestId('loading')).toBeNull();

    // 切换到可见状态
    rerender(<AjaxLoading visible={true} />);
    expect(queryByTestId('mask')).toBeInTheDocument();
    expect(queryByTestId('loading')).toBeInTheDocument();

    // 切换回不可见状态
    rerender(<AjaxLoading visible={false} />);
    expect(queryByTestId('mask')).toBeNull();
    expect(queryByTestId('loading')).toBeNull();
  });
});
