import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import Checkbox from '@/components/checkbox';

describe('Checkbox', () => {
  test('renders basic checkbox correctly', () => {
    render(<Checkbox>Test Checkbox</Checkbox>);
    expect(screen.getByText('Test Checkbox')).toBeInTheDocument();
  });

  test('handles checked state correctly', () => {
    const { container } = render(
      <Checkbox defaultChecked>Checked Checkbox</Checkbox>,
    );
    const checkbox = container.querySelector('[role="checkbox"]');
    expect(checkbox).toHaveAttribute('data-headlessui-state', 'checked');
  });

  test('handles controlled checked state', () => {
    const handleChange = vi.fn();
    const { container, rerender } = render(
      <Checkbox checked onChange={handleChange}>
        Controlled Checkbox
      </Checkbox>,
    );

    const checkbox = container.querySelector('[role="checkbox"]');
    expect(checkbox).toHaveAttribute('data-headlessui-state', 'checked');

    rerender(
      <Checkbox checked={false} onChange={handleChange}>
        Controlled Checkbox
      </Checkbox>,
    );
    expect(checkbox).not.toHaveAttribute('data-headlessui-state', 'checked');
  });

  test('handles indeterminate state', () => {
    const { container, rerender } = render(
      <Checkbox indeterminate>Indeterminate Checkbox</Checkbox>,
    );

    const checkbox = container.querySelector('[role="checkbox"]');
    expect(checkbox).toHaveAttribute('data-headlessui-state', 'indeterminate');

    const svg = container.querySelector('svg');
    expect(svg).toBeNull();

    rerender(
      <Checkbox checked indeterminate>
        Indeterminate Checkbox
      </Checkbox>,
    );
    expect(checkbox).toHaveAttribute(
      'data-headlessui-state',
      'checked indeterminate',
    );
    const svg2 = container.querySelector('svg');
    expect(svg2).toBeInTheDocument();
    expect(svg2?.querySelector('path')).toHaveAttribute('d', 'M5 12H19');
  });

  test('handles disabled state', () => {
    const handleChange = vi.fn();
    const { container } = render(
      <Checkbox disabled onChange={handleChange}>
        Disabled Checkbox
      </Checkbox>,
    );

    const checkbox = container.querySelector('[role="checkbox"]');
    expect(checkbox).toHaveAttribute('data-headlessui-state', 'disabled');
    fireEvent.click(checkbox as HTMLElement);
    expect(handleChange).not.toHaveBeenCalled();
  });

  test('handles custom icons', () => {
    const CustomCheckedIcon = () => <div data-testid="custom-checked">✓</div>;
    const CustomIndeterminateIcon = () => (
      <div data-testid="custom-indeterminate">-</div>
    );

    const { rerender } = render(
      <Checkbox
        checked
        checkedIcon={<CustomCheckedIcon />}
        indeterminateIcon={<CustomIndeterminateIcon />}
      >
        Custom Icons
      </Checkbox>,
    );

    expect(screen.getByTestId('custom-checked')).toBeInTheDocument();

    rerender(
      <Checkbox
        indeterminate
        checkedIcon={<CustomCheckedIcon />}
        indeterminateIcon={<CustomIndeterminateIcon />}
      >
        Custom Icons
      </Checkbox>,
    );

    expect(screen.queryByTestId('custom-indeterminate')).toBeNull();

    rerender(
      <Checkbox
        checked
        indeterminate
        checkedIcon={<CustomCheckedIcon />}
        indeterminateIcon={<CustomIndeterminateIcon />}
      >
        Custom Icons
      </Checkbox>,
    );

    expect(screen.getByTestId('custom-indeterminate')).toBeInTheDocument();
  });

  test('handles custom className props', () => {
    const { container } = render(
      <Checkbox
        checked
        className="custom-container"
        boxClassName="custom-box"
        checkClassName="custom-check"
        labelClassName="custom-label"
      >
        Custom Classes
      </Checkbox>,
    );

    expect(container.querySelector('.custom-container')).toBeInTheDocument();
    expect(container.querySelector('.custom-box')).toBeInTheDocument();
    expect(container.querySelector('.custom-check')).toBeInTheDocument();
    expect(container.querySelector('.custom-label')).toBeInTheDocument();
  });

  test('handles onChange event', () => {
    const handleChange = vi.fn();
    const { container } = render(
      <Checkbox onChange={handleChange}>Clickable Checkbox</Checkbox>,
    );

    const checkbox = container.querySelector('[role="checkbox"]');
    fireEvent.click(checkbox as HTMLElement);
    expect(handleChange).toHaveBeenCalledWith(true);

    fireEvent.click(checkbox as HTMLElement);
    expect(handleChange).toHaveBeenCalledWith(false);
  });

  test('handles defaultChecked without onChange', () => {
    const { container } = render(
      <Checkbox defaultChecked>Default Checked</Checkbox>,
    );

    const checkbox = container.querySelector('[role="checkbox"]');
    expect(checkbox).toHaveAttribute('data-headlessui-state', 'checked');

    fireEvent.click(checkbox as HTMLElement);
    expect(checkbox).not.toHaveAttribute('data-headlessui-state', 'checked');
  });
});
