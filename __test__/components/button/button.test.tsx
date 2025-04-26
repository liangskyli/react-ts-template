import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import Button from '../../../src/components/button';

describe('Button', () => {
  test('renders basic button correctly', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByText('Click me');
    expect(button).toBeInTheDocument();
    expect(button.tagName).toBe('BUTTON');
    // 默认是 primary variant
    expect(button).toHaveClass('bg-blue-600');
  });

  test('renders different variants correctly', () => {
    const { rerender } = render(<Button variant="secondary">Button</Button>);
    expect(screen.getByText('Button')).toHaveClass('bg-blue-100');

    rerender(<Button variant="danger">Button</Button>);
    expect(screen.getByText('Button')).toHaveClass('bg-red-600');

    rerender(<Button variant="ghost">Button</Button>);
    expect(screen.getByText('Button')).toHaveClass('bg-white');
  });

  test('handles disabled state', () => {
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        Disabled Button
      </Button>,
    );
    const button = screen.getByText('Disabled Button');

    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:cursor-not-allowed');

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  test('handles loading state', () => {
    const handleClick = vi.fn();
    render(
      <Button loading onClick={handleClick}>
        Loading Button
      </Button>,
    );

    const button = screen.getByText('Loading Button');
    const spinner = button.querySelector('svg');

    expect(spinner).toBeInTheDocument();
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  test('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Clickable</Button>);

    fireEvent.click(screen.getByText('Clickable'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('renders block button', () => {
    render(<Button block>Block Button</Button>);
    expect(screen.getByText('Block Button')).toHaveClass('w-full');
  });

  test('renders as different elements', () => {
    const { rerender } = render(
      <Button as="a" href="/test">
        Link Button
      </Button>,
    );
    const linkButton = screen.getByText('Link Button');
    expect(linkButton.tagName).toBe('A');
    expect(linkButton).toHaveAttribute('href', '/test');

    rerender(
      <Button as="div" role="button">
        Div Button
      </Button>,
    );
    const divButton = screen.getByText('Div Button');
    expect(divButton.tagName).toBe('DIV');
    expect(divButton).toHaveAttribute('role', 'button');
  });

  test('applies custom className', () => {
    render(<Button className="custom-class">Custom Button</Button>);
    expect(screen.getByText('Custom Button')).toHaveClass('custom-class');
  });
});
