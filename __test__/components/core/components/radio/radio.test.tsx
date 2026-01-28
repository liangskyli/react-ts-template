import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import RadioGroup from '@/components/core/components/radio';

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
      <RadioGroup defaultValue="">
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

  test('applies custom className to radio button as SemanticClassNames', () => {
    const { container } = render(
      <RadioGroup defaultValue="">
        <RadioGroup.Radio
          value="1"
          className={{
            root: 'custom-radio',
            box: 'custom-box',
            dot: 'custom-dot',
            label: 'custom-label',
          }}
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
    const TestComponent = () => {
      const [curValue, setCurValue] = useState('');
      const handleChange = vi.fn((value) => {
        setCurValue(value);
      });

      return (
        <RadioGroup value={curValue} onChange={handleChange}>
          <RadioGroup.Radio value="1">Option 1</RadioGroup.Radio>
        </RadioGroup>
      );
    };

    const { container } = render(<TestComponent />);
    const radio = container.querySelector('[role="radio"]');

    fireEvent.click(radio as HTMLElement);

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

  test('处理单选按钮取消选择事件', () => {
    const handleChange = vi.fn();
    const { container } = render(
      <RadioGroup value="1" onChange={handleChange} allowDeselect>
        <RadioGroup.Radio value="1">选项 1</RadioGroup.Radio>
      </RadioGroup>,
    );

    // 模拟 dispatchEvent 方法
    const dispatchEventSpy = vi.spyOn(HTMLElement.prototype, 'dispatchEvent');

    // 获取单选按钮并点击它（它已经是选中状态）
    const radio = container.querySelector('[role="radio"]');
    fireEvent.click(radio as HTMLElement);

    // 验证自定义事件已被分发
    expect(dispatchEventSpy).toHaveBeenCalled();

    // 查找 radio-deselect 类型的事件
    const radioDeselectEvent = dispatchEventSpy.mock.calls.find(
      (call) => call[0].type === 'radio-deselect',
    )?.[0];

    expect(radioDeselectEvent).toBeDefined();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((radioDeselectEvent as any)?.detail.value).toBe('1');

    // 清理
    dispatchEventSpy.mockRestore();
  });

  test('renders with custom content when isCustom is true', () => {
    const { container } = render(
      <RadioGroup>
        <RadioGroup.Radio value="1" isCustom>
          <div data-testid="custom-content">自定义内容</div>
        </RadioGroup.Radio>
      </RadioGroup>,
    );

    const radio = container.querySelector('[role="radio"]');
    expect(radio).toBeInTheDocument();

    // 验证自定义内容被渲染
    expect(screen.getByTestId('custom-content')).toBeInTheDocument();
    expect(screen.getByText('自定义内容')).toBeInTheDocument();

    // 验证默认的 box 和 dot 元素没有被渲染
    const box = radio?.querySelector('div');
    expect(box).not.toHaveClass('border-gray-300');
  });

  test('支持取消选择功能', () => {
    const handleChange = vi.fn();
    const handleClick = vi.fn();
    render(
      <RadioGroup value="1" onChange={handleChange} allowDeselect>
        <RadioGroup.Radio value="1" onClick={handleClick}>
          选项 1
        </RadioGroup.Radio>
      </RadioGroup>,
    );

    // 点击已选中的单选按钮
    fireEvent.click(screen.getByRole('radio'));

    // 验证 onChange 被调用，且值为 null（表示取消选择）
    expect(handleChange).toHaveBeenCalledWith(null);
    expect(handleClick).toBeCalledTimes(1);
  });
});
