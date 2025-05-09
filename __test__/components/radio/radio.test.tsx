import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import RadioGroup from '@/components/radio';

describe('Radio Component', () => {
  test('renders radio button correctly', () => {
    render(
      <RadioGroup>
        <RadioGroup.Radio value="1">Option 1</RadioGroup.Radio>
      </RadioGroup>,
    );

    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByRole('radio')).toBeInTheDocument();
  });

  test('applies custom className to radio button', () => {
    const { container } = render(
      <RadioGroup>
        <RadioGroup.Radio
          value="1"
          className="custom-radio"
          boxClassName="custom-box"
          dotClassName="custom-dot"
          labelClassName="custom-label"
        >
          Custom Radio
        </RadioGroup.Radio>
      </RadioGroup>,
    );

    const radio = container.querySelector('[role="radio"]');
    expect(radio).toHaveClass('custom-radio');

    const box = radio?.querySelector('div');
    expect(box).toHaveClass('custom-box');

    // 点击单选按钮使其选中，这样才能看到 dot
    fireEvent.click(radio as HTMLElement);

    const dot = box?.querySelector('span');
    expect(dot).toHaveClass('custom-dot');

    // 使用更精确的选择器或通过文本内容查找标签元素
    const label = screen.getByText('Custom Radio').closest('span');
    expect(label).toHaveClass('custom-label');
  });

  test('handles checked state correctly', () => {
    const { container } = render(
      <RadioGroup value="1">
        <RadioGroup.Radio value="1">Option 1</RadioGroup.Radio>
      </RadioGroup>,
    );

    const radio = container.querySelector('[role="radio"]');
    expect(radio?.getAttribute('data-headlessui-state') || '').toContain(
      'checked',
    );

    // 验证选中状态下有 dot 元素
    const dot = radio?.querySelector('span');
    expect(dot).toBeInTheDocument();
  });

  test('handles disabled state correctly', () => {
    const { container } = render(
      <RadioGroup disabled>
        <RadioGroup.Radio value="1">Option 1</RadioGroup.Radio>
      </RadioGroup>,
    );

    const radio = container.querySelector('[role="radio"]');
    expect(radio?.getAttribute('data-headlessui-state') || '').toContain(
      'disabled',
    );
  });

  test('handles click events correctly', () => {
    const handleChange = vi.fn();
    const { container } = render(
      <RadioGroup onChange={handleChange}>
        <RadioGroup.Radio value="1">Option 1</RadioGroup.Radio>
      </RadioGroup>,
    );

    const radio = container.querySelector('[role="radio"]');
    fireEvent.click(radio as HTMLElement);

    expect(handleChange).toHaveBeenCalledWith('1');
    expect(radio?.getAttribute('data-headlessui-state') || '').toContain(
      'checked',
    );
  });

  test('does not show dot when not checked', () => {
    const { container } = render(
      <RadioGroup value="2">
        <RadioGroup.Radio value="1">Option 1</RadioGroup.Radio>
      </RadioGroup>,
    );

    const radio = container.querySelector('[role="radio"]');
    const box = radio?.querySelector('div');
    const dot = box?.querySelector('span');

    // 未选中状态下不应该有 dot 元素
    expect(dot).not.toBeInTheDocument();
  });

  test('renders without children', () => {
    const { container } = render(
      <RadioGroup>
        <RadioGroup.Radio value="1" />
      </RadioGroup>,
    );

    const radio = container.querySelector('[role="radio"]');
    expect(radio).toBeInTheDocument();

    // 没有子元素时不应该渲染 label
    const label = radio?.querySelector('span:last-child');
    expect(label).not.toBeInTheDocument();
  });
});
