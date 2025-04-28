import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import RadioGroup from '@/components/radio';

describe('RadioGroup', () => {
  test('renders radio group correctly', () => {
    render(
      <RadioGroup>
        <RadioGroup.Radio value="1">Option 1</RadioGroup.Radio>
        <RadioGroup.Radio value="2">Option 2</RadioGroup.Radio>
      </RadioGroup>,
    );

    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  test('handles defaultValue prop', () => {
    const { container } = render(
      <RadioGroup defaultValue="1">
        <RadioGroup.Radio value="1">Option 1</RadioGroup.Radio>
        <RadioGroup.Radio value="2">Option 2</RadioGroup.Radio>
      </RadioGroup>,
    );

    const radioButtons = container.querySelectorAll('[role="radio"]');
    expect(radioButtons[0]).toHaveAttribute('data-headlessui-state', 'checked');
    expect(radioButtons[1]).not.toHaveAttribute(
      'data-headlessui-state',
      'checked',
    );
  });

  test('handles controlled state', () => {
    const handleChange = vi.fn();
    const { container, rerender } = render(
      <RadioGroup value="1" onChange={handleChange}>
        <RadioGroup.Radio value="1">Option 1</RadioGroup.Radio>
        <RadioGroup.Radio value="2">Option 2</RadioGroup.Radio>
      </RadioGroup>,
    );

    const radioButtons = container.querySelectorAll('[role="radio"]');
    expect(radioButtons[0]).toHaveAttribute('data-headlessui-state', 'checked');
    expect(radioButtons[1]).not.toHaveAttribute(
      'data-headlessui-state',
      'checked',
    );

    rerender(
      <RadioGroup value="2" onChange={handleChange}>
        <RadioGroup.Radio value="1">Option 1</RadioGroup.Radio>
        <RadioGroup.Radio value="2">Option 2</RadioGroup.Radio>
      </RadioGroup>,
    );

    expect(radioButtons[0]).not.toHaveAttribute(
      'data-headlessui-state',
      'checked',
    );
    expect(radioButtons[1]).toHaveAttribute('data-headlessui-state', 'checked');
  });

  test('handles group disabled state', () => {
    const handleChange = vi.fn();
    const { container } = render(
      <RadioGroup disabled onChange={handleChange}>
        <RadioGroup.Radio value="1">Option 1</RadioGroup.Radio>
        <RadioGroup.Radio value="2">Option 2</RadioGroup.Radio>
      </RadioGroup>,
    );

    const radioButtons = container.querySelectorAll('[role="radio"]');
    radioButtons.forEach((radio) => {
      expect(radio).toHaveAttribute('data-headlessui-state', 'disabled');
      fireEvent.click(radio);
    });

    expect(handleChange).not.toHaveBeenCalled();
  });

  test('handles onChange event', () => {
    const handleChange = vi.fn();
    const { container } = render(
      <RadioGroup onChange={handleChange}>
        <RadioGroup.Radio value="1">Option 1</RadioGroup.Radio>
        <RadioGroup.Radio value="2">Option 2</RadioGroup.Radio>
      </RadioGroup>,
    );

    const radioButtons = container.querySelectorAll('[role="radio"]');

    fireEvent.click(radioButtons[0]);
    expect(handleChange).toHaveBeenCalledWith('1');

    fireEvent.click(radioButtons[1]);
    expect(handleChange).toHaveBeenCalledWith('2');
  });

  test('handles custom className', () => {
    const { container } = render(
      <RadioGroup className="custom-group">
        <RadioGroup.Radio value="1">Option 1</RadioGroup.Radio>
      </RadioGroup>,
    );

    const groupDiv = container.querySelector('.custom-group');
    expect(groupDiv).toHaveClass('flex', 'flex-wrap', 'custom-group');
  });

  test('handles generic types correctly', () => {
    const handleChange = vi.fn();
    const { container } = render(
      <RadioGroup<number> value={1} onChange={handleChange}>
        <RadioGroup.Radio value={1}>Number 1</RadioGroup.Radio>
        <RadioGroup.Radio value={2}>Number 2</RadioGroup.Radio>
      </RadioGroup>,
    );

    const radioButtons = container.querySelectorAll('[role="radio"]');
    expect(radioButtons[0]).toHaveAttribute('data-headlessui-state', 'checked');

    fireEvent.click(radioButtons[1]);
    expect(handleChange).toHaveBeenCalledWith(2);
  });
});
