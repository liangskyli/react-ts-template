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
    expect(groupDiv).toHaveClass('flex', 'flex-wrap', 'custom-group');
  });

  // 测试空值处理
  test('handles null or undefined values correctly', () => {
    const handleChange = vi.fn();
    const { container, rerender } = render(
      <Checkbox.Group
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        value={null as any}
        onChange={handleChange}
      >
        <Checkbox value="1">Option 1</Checkbox>
        <Checkbox value="2">Option 2</Checkbox>
      </Checkbox.Group>,
    );

    // 验证没有选中的复选框
    const checkboxes = container.querySelectorAll('[role="checkbox"]');
    checkboxes.forEach((checkbox) => {
      expect(
        checkbox.getAttribute('data-headlessui-state') || '',
      ).not.toContain('checked');
    });

    // 重新渲染，使用 undefined 值
    rerender(
      <Checkbox.Group value={undefined} onChange={handleChange}>
        <Checkbox value="1">Option 1</Checkbox>
        <Checkbox value="2">Option 2</Checkbox>
      </Checkbox.Group>,
    );

    // 验证没有选中的复选框
    checkboxes.forEach((checkbox) => {
      expect(
        checkbox.getAttribute('data-headlessui-state') || '',
      ).not.toContain('checked');
    });

    // 点击第一个复选框
    fireEvent.click(checkboxes[0]);
    expect(handleChange).toHaveBeenCalledWith(['1']);
  });

  // 测试非数组值处理
  test('handles non-array values correctly', () => {
    const handleChange = vi.fn();
    const { container } = render(
      // @ts-expect-error - 故意传入错误类型以测试错误处理
      <Checkbox.Group value="1" onChange={handleChange}>
        <Checkbox value="1">Option 1</Checkbox>
        <Checkbox value="2">Option 2</Checkbox>
      </Checkbox.Group>,
    );

    const checkboxes = container.querySelectorAll('[role="checkbox"]');

    // 即使传入了非数组值，第一个复选框也应该被选中
    expect(checkboxes[0].getAttribute('data-headlessui-state') || '').toContain(
      'checked',
    );
    expect(
      checkboxes[1].getAttribute('data-headlessui-state') || '',
    ).not.toContain('checked');
  });

  // 测试空子元素
  test('renders with no children', () => {
    const { container } = render(<Checkbox.Group />);

    // 应该渲染一个空的 div
    expect(container.firstChild).toBeInTheDocument();
    expect(container.firstChild?.childNodes.length).toBe(0);
  });

  // 测试非 Checkbox 子元素
  test('handles non-Checkbox children', () => {
    const { container } = render(
      <Checkbox.Group>
        <div data-testid="non-checkbox">Not a checkbox</div>
        <Checkbox value="1">Option 1</Checkbox>
      </Checkbox.Group>,
    );

    // 应该渲染非 Checkbox 子元素和 Checkbox 子元素
    expect(screen.getByTestId('non-checkbox')).toBeInTheDocument();
    expect(container.querySelector('[role="checkbox"]')).toBeInTheDocument();

    // 点击 Checkbox 应该正常工作
    const checkbox = container.querySelector('[role="checkbox"]');
    fireEvent.click(checkbox as HTMLElement);
    expect(checkbox?.getAttribute('data-headlessui-state') || '').toContain(
      'checked',
    );
  });

  // 测试从非受控到受控的转换
  test('handles transition from uncontrolled to controlled', () => {
    const { container, rerender } = render(
      <Checkbox.Group>
        <Checkbox value="1">Option 1</Checkbox>
        <Checkbox value="2">Option 2</Checkbox>
      </Checkbox.Group>,
    );

    const checkboxes = container.querySelectorAll('[role="checkbox"]');

    // 初始状态：非受控
    checkboxes.forEach((checkbox) => {
      expect(
        checkbox.getAttribute('data-headlessui-state') || '',
      ).not.toContain('checked');
    });

    // 点击第一个复选框
    fireEvent.click(checkboxes[0]);
    expect(checkboxes[0].getAttribute('data-headlessui-state') || '').toContain(
      'checked',
    );

    // 重新渲染为受控组件
    const handleChange = vi.fn();
    rerender(
      <Checkbox.Group value={['2']} onChange={handleChange}>
        <Checkbox value="1">Option 1</Checkbox>
        <Checkbox value="2">Option 2</Checkbox>
      </Checkbox.Group>,
    );

    // 验证第二个复选框被选中，第一个未选中
    expect(
      checkboxes[0].getAttribute('data-headlessui-state') || '',
    ).not.toContain('checked');
    expect(checkboxes[1].getAttribute('data-headlessui-state') || '').toContain(
      'checked',
    );
  });

  // 测试取消选中所有复选框
  test('allows unchecking all checkboxes', () => {
    const handleChange = vi.fn();
    const { container } = render(
      <Checkbox.Group value={['1']} onChange={handleChange}>
        <Checkbox value="1">Option 1</Checkbox>
        <Checkbox value="2">Option 2</Checkbox>
      </Checkbox.Group>,
    );

    const checkboxes = container.querySelectorAll('[role="checkbox"]');

    // 点击已选中的复选框，取消选中
    fireEvent.click(checkboxes[0]);
    expect(handleChange).toHaveBeenCalledWith([]);
  });

  // 测试嵌套结构
  test('works with nested structure', () => {
    const handleChange = vi.fn();
    const { container } = render(
      <Checkbox.Group onChange={handleChange}>
        <div>
          <Checkbox value="1">Option 1</Checkbox>
        </div>
        <div>
          <Checkbox value="2">Option 2</Checkbox>
        </div>
      </Checkbox.Group>,
    );

    const checkboxes = container.querySelectorAll('[role="checkbox"]');
    expect(checkboxes.length).toBe(2);

    // 点击第一个复选框
    fireEvent.click(checkboxes[0]);
    expect(handleChange).toHaveBeenCalledWith(['1']);
  });

  // 测试大量复选框
  test('handles many checkboxes', () => {
    const values = Array.from({ length: 10 }, (_, i) => `${i}`);
    const handleChange = vi.fn();

    const { container } = render(
      <Checkbox.Group onChange={handleChange}>
        {values.map((value) => (
          <Checkbox key={value} value={value}>
            Option {value}
          </Checkbox>
        ))}
      </Checkbox.Group>,
    );

    const checkboxes = container.querySelectorAll('[role="checkbox"]');
    expect(checkboxes.length).toBe(10);

    // 点击多个复选框
    fireEvent.click(checkboxes[0]);
    fireEvent.click(checkboxes[5]);
    fireEvent.click(checkboxes[9]);

    expect(handleChange).toHaveBeenLastCalledWith(['0', '5', '9']);
  });

  // 测试 formRef 功能
  test('handles formRef correctly', () => {
    const formRef = vi.fn();
    const TestComponent = () => {
      return (
        <Checkbox.Group formRef={formRef}>
          <Checkbox value="1">Option 1</Checkbox>
          <Checkbox value="2">Option 2</Checkbox>
        </Checkbox.Group>
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
  test('formRef focus method focuses the first checkbox', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let refObject: any;
    const TestComponent = () => {
      return (
        <Checkbox.Group
          formRef={(ref) => {
            refObject = ref;
          }}
        >
          <Checkbox value="1">Option 1</Checkbox>
          <Checkbox value="2">Option 2</Checkbox>
        </Checkbox.Group>
      );
    };

    const { container } = render(<TestComponent />);

    // 调用 focus 方法
    refObject.focus();

    // 验证第一个复选框获得了焦点
    const firstCheckbox = container.querySelector('[role="checkbox"]');
    expect(document.activeElement).toBe(firstCheckbox);
  });

  // 测试 formRef 与 React Hook Form 集成
  test('integrates with React Hook Form via formRef', () => {
    // 模拟 React Hook Form 的 register 函数返回的对象
    const fieldMock = {
      name: 'test',
      onChange: vi.fn(),
      onBlur: vi.fn(),
      ref: vi.fn(),
    };

    const { container } = render(
      <Checkbox.Group
        formRef={fieldMock.ref}
        value={['1']}
        onChange={fieldMock.onChange}
      >
        <Checkbox value="1">Option 1</Checkbox>
        <Checkbox value="2">Option 2</Checkbox>
      </Checkbox.Group>,
    );

    // 验证 ref 被调用
    expect(fieldMock.ref).toHaveBeenCalled();

    // 点击第二个复选框
    const checkboxes = container.querySelectorAll('[role="checkbox"]');
    fireEvent.click(checkboxes[1]);

    // 验证 onChange 被调用
    expect(fieldMock.onChange).toHaveBeenCalledWith(['1', '2']);
  });
});
