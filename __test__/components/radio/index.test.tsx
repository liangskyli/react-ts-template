import { useRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import type { RadioGroupProps } from '@/components/radio';
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

    expect(
      radioButtons[0].getAttribute('data-headlessui-state') || '',
    ).toContain('checked');
    expect(
      radioButtons[1].getAttribute('data-headlessui-state') || '',
    ).not.toContain('checked');

    rerender(
      <RadioGroup value="2" onChange={handleChange}>
        <RadioGroup.Radio value="1">Option 1</RadioGroup.Radio>
        <RadioGroup.Radio value="2">Option 2</RadioGroup.Radio>
      </RadioGroup>,
    );

    expect(
      radioButtons[0].getAttribute('data-headlessui-state') || '',
    ).not.toContain('checked');
    expect(
      radioButtons[1].getAttribute('data-headlessui-state') || '',
    ).toContain('checked');
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
      expect(radio.getAttribute('data-headlessui-state') || '').toContain(
        'disabled',
      );
      fireEvent.click(radio);
    });

    expect(handleChange).not.toHaveBeenCalled();
  });

  test('handles onChange event', () => {
    const handleChange = vi.fn();
    const { container } = render(
      <RadioGroup value="" onChange={handleChange}>
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
    expect(
      radioButtons[0].getAttribute('data-headlessui-state') || '',
    ).toContain('checked');

    fireEvent.click(radioButtons[1]);
    expect(handleChange).toHaveBeenCalledWith(2);
  });

  // 测试 formRef 功能
  test('handles formRef correctly', () => {
    const formRef = vi.fn();
    const TestComponent = () => {
      return (
        <RadioGroup formRef={formRef}>
          <RadioGroup.Radio value="1">Option 1</RadioGroup.Radio>
          <RadioGroup.Radio value="2">Option 2</RadioGroup.Radio>
        </RadioGroup>
      );
    };

    render(<TestComponent />);

    // 验证 formRef 被调用
    expect(formRef).toHaveBeenCalled();

    // 验证 formRef 被调用时传入的对象包含 focus 方法
    const refObject = formRef.mock.calls[0][0];
    expect(typeof refObject.focus).toBe('function');
  });

  // 测试 focus 方法
  test('formRef focus method focuses the first radio button', () => {
    let refObject: RadioGroupProps['formRef'];
    const TestComponent = () => {
      return (
        <RadioGroup
          formRef={(ref) => {
            refObject = ref;
          }}
        >
          <RadioGroup.Radio value="1">Option 1</RadioGroup.Radio>
          <RadioGroup.Radio value="2">Option 2</RadioGroup.Radio>
        </RadioGroup>
      );
    };

    const { container } = render(<TestComponent />);

    // 调用 focus 方法
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (refObject as any).focus();

    // 验证第一个单选按钮获得了焦点
    const firstRadio = container.querySelector('[role="radio"]');
    expect(document.activeElement).toBe(firstRadio);
  });

  // 测试从非受控到受控的转换
  test('handles transition from uncontrolled to controlled', () => {
    const { container, rerender } = render(
      <RadioGroup defaultValue="">
        <RadioGroup.Radio value="1">Option 1</RadioGroup.Radio>
        <RadioGroup.Radio value="2">Option 2</RadioGroup.Radio>
      </RadioGroup>,
    );

    // 初始状态：非受控
    const radioButtons = container.querySelectorAll('[role="radio"]');
    radioButtons.forEach((radio) => {
      expect(radio).not.toHaveClass('data-headlessui-state-checked');
    });

    // 点击第一个单选按钮
    fireEvent.click(radioButtons[0]);

    // 验证第一个单选按钮被选中 - 使用包含检查而不是精确匹配
    expect(radioButtons[0].getAttribute('data-headlessui-state')).toContain(
      'checked',
    );

    // 重新渲染为受控组件
    const handleChange = vi.fn();
    rerender(
      <RadioGroup value="2" onChange={handleChange}>
        <RadioGroup.Radio value="1">Option 1</RadioGroup.Radio>
        <RadioGroup.Radio value="2">Option 2</RadioGroup.Radio>
      </RadioGroup>,
    );

    // 验证第二个单选按钮被选中 - 同样使用包含检查
    expect(
      radioButtons[0].getAttribute('data-headlessui-state') || '',
    ).not.toContain('checked');
    expect(
      radioButtons[1].getAttribute('data-headlessui-state') || '',
    ).toContain('checked');
  });

  // 测试 useRef 和 DOM 操作
  test('allows accessing radio buttons via ref', () => {
    const TestComponent = () => {
      const groupRef = useRef<HTMLDivElement>(null);

      return (
        <>
          <button
            onClick={() => {
              const radioButtons =
                groupRef.current?.querySelectorAll('[role="radio"]');
              if (radioButtons && radioButtons.length > 0) {
                (radioButtons[1] as HTMLElement).click();
              }
            }}
            data-testid="test-button"
          >
            Click Second Radio
          </button>
          <RadioGroup defaultValue="" ref={groupRef}>
            <RadioGroup.Radio value="1">Option 1</RadioGroup.Radio>
            <RadioGroup.Radio value="2">Option 2</RadioGroup.Radio>
          </RadioGroup>
        </>
      );
    };

    const { container } = render(<TestComponent />);

    // 点击测试按钮，它会通过 ref 点击第二个单选按钮
    fireEvent.click(screen.getByTestId('test-button'));

    // 验证第二个单选按钮被选中
    const radioButtons = container.querySelectorAll('[role="radio"]');
    expect(
      radioButtons[1].getAttribute('data-headlessui-state') || '',
    ).toContain('checked');
  });

  // 测试键盘导航
  test('supports keyboard navigation', () => {
    const { container } = render(
      <RadioGroup defaultValue="">
        <RadioGroup.Radio value="1">Option 1</RadioGroup.Radio>
        <RadioGroup.Radio value="2">Option 2</RadioGroup.Radio>
        <RadioGroup.Radio value="3">Option 3</RadioGroup.Radio>
      </RadioGroup>,
    );

    const radioButtons = container.querySelectorAll('[role="radio"]');

    // 聚焦第一个单选按钮
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (radioButtons[0] as any).focus();
    expect(document.activeElement).toBe(radioButtons[0]);

    // 按下向下箭头键，应该聚焦第二个单选按钮
    fireEvent.keyDown(radioButtons[0], { key: 'ArrowDown' });
    expect(document.activeElement).toBe(radioButtons[1]);

    // 按下向右箭头键，应该聚焦第三个单选按钮
    fireEvent.keyDown(radioButtons[1], { key: 'ArrowRight' });
    expect(document.activeElement).toBe(radioButtons[2]);

    // 按下向上箭头键，应该聚焦第二个单选按钮
    fireEvent.keyDown(radioButtons[2], { key: 'ArrowUp' });
    expect(document.activeElement).toBe(radioButtons[1]);

    // 按下向左箭头键，应该聚焦第一个单选按钮
    fireEvent.keyDown(radioButtons[1], { key: 'ArrowLeft' });
    expect(document.activeElement).toBe(radioButtons[0]);
  });

  // 测试 RadioGroup 与 React Hook Form 集成
  test('integrates with React Hook Form via formRef', () => {
    // 模拟 React Hook Form 的 register 函数返回的对象
    const fieldMock = {
      name: 'test',
      onChange: vi.fn(),
      onBlur: vi.fn(),
      ref: vi.fn(),
    };

    const { container } = render(
      <RadioGroup
        formRef={fieldMock.ref}
        value="1"
        onChange={fieldMock.onChange}
        onBlur={fieldMock.onBlur}
      >
        <RadioGroup.Radio value="1">Option 1</RadioGroup.Radio>
        <RadioGroup.Radio value="2">Option 2</RadioGroup.Radio>
      </RadioGroup>,
    );

    // 验证 ref 被调用
    expect(fieldMock.ref).toHaveBeenCalled();

    // 点击第二个单选按钮
    const radioButtons = container.querySelectorAll('[role="radio"]');
    fireEvent.click(radioButtons[1]);

    // 验证 onChange 被调用
    expect(fieldMock.onChange).toHaveBeenCalledWith('2');

    // 模拟失去焦点事件
    fireEvent.blur(radioButtons[1]);

    // 验证 onBlur 被调用
    expect(fieldMock.onBlur).toHaveBeenCalled();
  });
});
