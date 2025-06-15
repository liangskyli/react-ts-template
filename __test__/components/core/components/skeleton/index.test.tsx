import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Skeleton from '@/components/core/components/skeleton';

describe('Skeleton', () => {
  it('renders basic skeleton correctly', () => {
    render(<Skeleton />);
    const skeleton = screen.getByRole('skeleton');

    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveClass('animate-pulse');
    expect(skeleton).toHaveClass('bg-gray-200');
    expect(skeleton).toHaveClass('rounded');
  });

  it('renders different variants', () => {
    const { rerender } = render(<Skeleton />);
    expect(screen.getByRole('skeleton')).toHaveClass(
      'bg-gray-200 rounded w-full h-5',
    );

    rerender(<Skeleton.circular />);
    expect(screen.getByRole('skeleton')).toHaveClass(
      'bg-gray-200 rounded-full size-[40px]',
    );

    rerender(<Skeleton.Paragraph />);
    expect(screen.getByRole('skeleton.paragraph')).toHaveClass('space-y-2');
    expect(screen.getAllByRole('skeleton').length).toBe(3);
  });

  it('renders different sizes', () => {
    const { rerender } = render(<Skeleton />);
    expect(screen.getByRole('skeleton')).toHaveClass('h-5');

    rerender(<Skeleton className="h-[24px]" />);
    expect(screen.getByRole('skeleton')).toHaveClass('h-[24px]');

    rerender(<Skeleton.circular className="size-[24px]" />);
    expect(screen.getByRole('skeleton')).toHaveClass('size-[24px]');

    rerender(
      <Skeleton.Paragraph
        className="space-y-3"
        lineClassName="w-[40%] last:w-[80%]"
        lineCount={2}
      />,
    );
    expect(screen.getByRole('skeleton.paragraph')).toHaveClass('space-y-3');
    expect(screen.getAllByRole('skeleton').length).toBe(2);
    expect(screen.getAllByRole('skeleton')[0]).toHaveClass(
      'w-[40%] last:w-[80%]',
    );
    expect(screen.getAllByRole('skeleton')[1]).toHaveClass(
      'w-[40%] last:w-[80%]',
    );
  });

  it('apply custom className', () => {
    const { rerender } = render(<Skeleton className="custom-class" />);
    expect(screen.getByRole('skeleton')).toHaveClass('custom-class');

    rerender(<Skeleton.circular className="custom-class" />);
    expect(screen.getByRole('skeleton')).toHaveClass('custom-class');

    rerender(
      <Skeleton.Paragraph
        className="custom-class"
        lineClassName="custom-line-class"
      />,
    );
    expect(screen.getByRole('skeleton.paragraph')).toHaveClass('custom-class');
    expect(screen.getAllByRole('skeleton')[0]).toHaveClass('custom-line-class');
  });

  it('disables animation when animation prop is false', () => {
    render(<Skeleton animation={false} data-testid="skeleton" />);
    const skeleton = screen.getByRole('skeleton');

    expect(skeleton).not.toHaveClass('animate-pulse');
  });
});
