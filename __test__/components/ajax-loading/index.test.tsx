import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import AjaxLoading from '@/components/ajax-loading';

// Mock Loading组件
vi.mock('@/router/utils/loading.tsx', () => ({
  default: () => <div data-testid="loading-component">加载中...</div>,
}));

describe('AjaxLoading Component', () => {
  it('should not render Loading component when visible is false', () => {
    const { queryByTestId } = render(<AjaxLoading visible={false} />);
    expect(queryByTestId('loading-component')).toBeNull();
  });

  it('should render Loading component when visible is true', () => {
    const { getByTestId } = render(<AjaxLoading visible={true} />);
    expect(getByTestId('loading-component')).toBeInTheDocument();
  });

  it('should toggle Loading component based on visible prop', () => {
    const { queryByTestId, rerender } = render(<AjaxLoading visible={false} />);

    // 初始状态：不显示
    expect(queryByTestId('loading-component')).toBeNull();

    // 切换到显示状态
    rerender(<AjaxLoading visible={true} />);
    expect(queryByTestId('loading-component')).toBeInTheDocument();

    // 切换回不显示状态
    rerender(<AjaxLoading visible={false} />);
    expect(queryByTestId('loading-component')).toBeNull();
  });
});
