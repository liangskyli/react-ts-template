import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import Badge from '@/components/core/components/badge';

describe('Badge', () => {
  test('renders basic badge correctly', () => {
    render(<Badge content="10">Test Badge</Badge>);
    const badge = screen.getByText('Test Badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('relative', 'inline-block');
    expect(badge.querySelector('span')).toHaveClass('bg-red-500', 'text-white');
  });

  test('renders badge when no content correctly', () => {
    render(<Badge>Test Badge</Badge>);
    const badge = screen.getByText('Test Badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('relative', 'inline-block');
    expect(badge.querySelector('span')).toBeNull();
  });

  test('renders different color correctly', () => {
    render(
      <Badge className="bg-blue-100 text-blue-800" content="10">
        Badge
      </Badge>,
    );
    expect(screen.getByText('10')).toHaveClass('bg-blue-100', 'text-blue-800');
  });

  test('renders dot mode correctly', () => {
    const { container } = render(
      <Badge isDot content="This text should not appear">
        demo
      </Badge>,
    );

    // 在圆点模式下，文本不应该显示
    expect(
      screen.queryByText('This text should not appear'),
    ).not.toBeInTheDocument();

    // 应该有圆点的样式类
    const badge = container.querySelector('span') as HTMLElement;
    expect(badge).toHaveClass('size-3', 'p-0');
  });

  test('applies custom className', () => {
    render(
      <Badge className="custom-class" content="Custom Badge">
        demo
      </Badge>,
    );
    expect(screen.getByText('Custom Badge')).toHaveClass('custom-class');
  });

  test('renders without children', () => {
    const { container } = render(<Badge />);
    const badge = container.firstChild as HTMLElement;
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass(' bg-red-500', 'text-white');
  });

  test('renders with numeric content', () => {
    render(<Badge content="99+"></Badge>);
    expect(screen.getByText('99+')).toBeInTheDocument();
  });

  test('renders with complex content', () => {
    render(
      <Badge
        content={
          <>
            <span>Complex</span> Content
          </>
        }
      >
        demo
      </Badge>,
    );
    expect(screen.getByText('Complex')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByText('demo')).toBeInTheDocument();
  });
});
