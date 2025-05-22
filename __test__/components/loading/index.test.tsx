import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Loading from '@/components/loading';

// Mock Mask组件
vi.mock('@/components/mask', () => ({
  default: ({ visible, children, className }: never) =>
    visible ? (
      <div data-testid="mask" className={className}>
        {children}
      </div>
    ) : null,
}));

describe('Loading Component', () => {
  it('should render with custom classNames', () => {
    const { getByTestId } = render(
      <Loading
        visible={true}
        className="custom-class"
        bodyClassName="custom-body"
        textClassName="custom-text"
        loadingIconClassName="custom-icon"
      />,
    );

    const maskElement = getByTestId('mask');
    const bodyElement = maskElement.querySelector('[class*="body"]');
    const textElement = getByTestId('text');
    const iconElement = maskElement.querySelector('svg');

    expect(maskElement).toHaveClass('custom-class');
    expect(bodyElement).toHaveClass('custom-body');
    expect(textElement).toHaveClass('custom-text');
    expect(iconElement).toHaveClass('custom-icon');
  });

  it('should render loading icon', () => {
    const { container } = render(<Loading visible={true} />);
    const iconElement = container.querySelector('svg');
    expect(iconElement).toBeInTheDocument();
  });

  it('should render loading text in Chinese', () => {
    const { getByText } = render(<Loading visible={true} />);
    const loadingText = getByText('加载中...');
    expect(loadingText).toBeInTheDocument();
  });

  it('should render nested components in correct structure', () => {
    const { container } = render(<Loading visible={true} />);

    // 验证组件结构
    const maskElement = container.querySelector('[data-testid="mask"]');
    const positionDiv = maskElement?.firstElementChild;
    const bodyDiv = positionDiv?.firstElementChild;
    const [icon, text] = Array.from(bodyDiv?.children || []);

    expect(maskElement).toBeInTheDocument();
    expect(positionDiv).toBeInTheDocument();
    expect(bodyDiv).toBeInTheDocument();
    expect(icon).toBeInTheDocument();
    expect(text).toBeInTheDocument();
    expect(text).toHaveTextContent('加载中...');
  });
});
