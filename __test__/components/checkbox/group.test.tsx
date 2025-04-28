import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import Checkbox from '@/components/checkbox';

describe('Checkbox.Group', () => {
  test('renders checkbox group correctly', () => {
    render(
      <Checkbox.Group>
        <Checkbox value="1">Option 1</Checkbox>
        <Checkbox value="2">Option 2</Checkbox>
      </Checkbox.Group>,
    );

    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  test('handles defaultValue prop', () => {
    const { container } = render(
      <Checkbox.Group defaultValue={['1']}>
        <Checkbox value="1">Option 1</Checkbox>
        <Checkbox value="2">Option 2</Checkbox>
      </Checkbox.Group>,
    );

    const checkboxes = container.querySelectorAll('[role="checkbox"]');
    expect(checkboxes[0]).toHaveAttribute('data-headlessui-state', 'checked');
    expect(checkboxes[1]).not.toHaveAttribute(
      'data-headlessui-state',
      'checked',
    );
  });

  test('handles controlled state', () => {
    const handleChange = vi.fn();
    const { container, rerender } = render(
      <Checkbox.Group value={['1']} onChange={handleChange}>
        <Checkbox value="1">Option 1</Checkbox>
        <Checkbox value="2">Option 2</Checkbox>
      </Checkbox.Group>,
    );

    const checkboxes = container.querySelectorAll('[role="checkbox"]');
    expect(checkboxes[0]).toHaveAttribute('data-headlessui-state', 'checked');
    expect(checkboxes[1]).not.toHaveAttribute(
      'data-headlessui-state',
      'checked',
    );

    rerender(
      <Checkbox.Group value={['2']} onChange={handleChange}>
        <Checkbox value="1">Option 1</Checkbox>
        <Checkbox value="2">Option 2</Checkbox>
      </Checkbox.Group>,
    );

    expect(checkboxes[0]).not.toHaveAttribute(
      'data-headlessui-state',
      'checked',
    );
    expect(checkboxes[1]).toHaveAttribute('data-headlessui-state', 'checked');
  });

  test('handles group disabled state', () => {
    const handleChange = vi.fn();
    const { container } = render(
      <Checkbox.Group disabled onChange={handleChange}>
        <Checkbox value="1">Option 1</Checkbox>
        <Checkbox value="2">Option 2</Checkbox>
      </Checkbox.Group>,
    );

    const checkboxes = container.querySelectorAll('[role="checkbox"]');
    checkboxes.forEach((checkbox) => {
      expect(checkbox).toHaveAttribute('data-headlessui-state', 'disabled');
      fireEvent.click(checkbox);
    });

    expect(handleChange).not.toHaveBeenCalled();
  });

  test('handles onChange event', () => {
    const handleChange = vi.fn();
    const { container } = render(
      <Checkbox.Group onChange={handleChange}>
        <Checkbox value="1">Option 1</Checkbox>
        <Checkbox value="2">Option 2</Checkbox>
      </Checkbox.Group>,
    );

    const checkboxes = container.querySelectorAll('[role="checkbox"]');

    fireEvent.click(checkboxes[0]);
    expect(handleChange).toHaveBeenCalledWith(['1']);

    fireEvent.click(checkboxes[1]);
    expect(handleChange).toHaveBeenCalledWith(['1', '2']);

    fireEvent.click(checkboxes[0]);
    expect(handleChange).toHaveBeenCalledWith(['2']);
  });

  test('handles custom className', () => {
    const { container } = render(
      <Checkbox.Group className="custom-group">
        <Checkbox value="1">Option 1</Checkbox>
      </Checkbox.Group>,
    );

    const groupDiv = container.querySelector('.custom-group');
    expect(groupDiv).toHaveClass('flex', 'flex-wrap', '-m-1', 'custom-group');
  });
});
