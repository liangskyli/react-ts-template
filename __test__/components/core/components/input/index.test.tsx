import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import Input from '@/components/core/components/input';

describe('Input', () => {
  test('renders basic input correctly', () => {
    render(<Input placeholder="请输入内容" />);
    expect(screen.getByPlaceholderText('请输入内容')).toBeInTheDocument();
  });

  test('handles controlled value correctly', () => {
    const handleChange = vi.fn();
    const { rerender } = render(
      <Input value="初始内容" onChange={handleChange} />,
    );

    const input = screen.getByDisplayValue('初始内容');
    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { value: '新内容' } });
    expect(handleChange).toHaveBeenCalledWith('新内容');

    // 测试受控更新
    rerender(<Input value="更新内容" onChange={handleChange} />);
    expect(screen.getByDisplayValue('更新内容')).toBeInTheDocument();
  });

  test('handles readonly state correctly', () => {
    render(<Input value="只读内容" readOnly />);
    const input = screen.getByDisplayValue('只读内容');
    expect(input).toHaveAttribute('readonly');
    expect(input).toHaveClass('read-only:bg-gray-50');
  });

  test('handles disabled state correctly', () => {
    render(<Input value="禁用内容" disabled />);
    const input = screen.getByDisplayValue('禁用内容');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('disabled:bg-gray-100');
  });

  test('handles decimal input mode correctly', () => {
    const handleChange = vi.fn();
    render(
      <Input inputMode="decimal" decimalPlaces={2} onChange={handleChange} />,
    );

    const input = screen.getByRole('textbox');

    // 测试只允许数字和小数点
    fireEvent.change(input, { target: { value: 'abc123.45' } });
    expect(handleChange).toHaveBeenCalledWith('123.45');

    // 测试小数位数限制
    fireEvent.change(input, { target: { value: '123.456' } });
    expect(handleChange).toHaveBeenCalledWith('123.45');

    // 测试前导零处理
    fireEvent.change(input, { target: { value: '00123' } });
    expect(handleChange).toHaveBeenCalledWith('123');
  });

  test('handles min and max values on blur', () => {
    const handleChange = vi.fn();
    render(
      <Input inputMode="decimal" min={10} max={100} onChange={handleChange} />,
    );

    const input = screen.getByRole('textbox');

    // 测试小于最小值
    fireEvent.change(input, { target: { value: '5' } });
    fireEvent.blur(input);
    expect(handleChange).toHaveBeenLastCalledWith('10');

    // 测试大于最大值
    fireEvent.change(input, { target: { value: '150' } });
    fireEvent.blur(input);
    expect(handleChange).toHaveBeenLastCalledWith('100');
  });

  test('handles focus and blur events', () => {
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();

    render(<Input onFocus={handleFocus} onBlur={handleBlur} />);

    const input = screen.getByRole('textbox');

    fireEvent.focus(input);
    expect(handleFocus).toHaveBeenCalledTimes(1);

    fireEvent.blur(input);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  test('handles focus state correctly', () => {
    render(<Input placeholder="测试焦点状态" />);

    const input = screen.getByPlaceholderText('测试焦点状态');

    // 初始状态应该有焦点样式类（但未激活）
    expect(input.classList.contains('focus:border-blue-600')).toBeTruthy();

    // 获取焦点 - 使用直接设置而不是事件
    input.focus();
    expect(document.activeElement).toBe(input);

    // 失去焦点
    input.blur();
    expect(document.activeElement).not.toBe(input);
  });

  test('handles defaultValue correctly', () => {
    render(<Input defaultValue="默认值测试" />);
    expect(screen.getByDisplayValue('默认值测试')).toBeInTheDocument();

    // 测试值变化
    const input = screen.getByDisplayValue('默认值测试');
    fireEvent.change(input, { target: { value: '新值' } });
    expect(screen.getByDisplayValue('新值')).toBeInTheDocument();
  });

  test('handles integer-only decimal input correctly', () => {
    const handleChange = vi.fn();
    render(
      <Input inputMode="decimal" decimalPlaces={0} onChange={handleChange} />,
    );

    const input = screen.getByRole('textbox');

    // 测试只允许整数
    fireEvent.change(input, { target: { value: '123.45' } });
    expect(handleChange).toHaveBeenCalledWith('12345');

    // 测试前导零处理
    fireEvent.change(input, { target: { value: '0123' } });
    expect(handleChange).toHaveBeenCalledWith('123');
  });

  test('handles empty value on blur for decimal input', () => {
    const handleChange = vi.fn();
    render(<Input inputMode="decimal" min={10} onChange={handleChange} />);

    const input = screen.getByRole('textbox');

    // 测试空值
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.blur(input);
    expect(handleChange).toHaveBeenLastCalledWith('');
  });

  test('handles trailing decimal point on blur', () => {
    const handleChange = vi.fn();
    render(<Input inputMode="decimal" onChange={handleChange} />);

    const input = screen.getByRole('textbox');

    // 测试末尾小数点
    fireEvent.change(input, { target: { value: '123.' } });
    fireEvent.blur(input);
    expect(handleChange).toHaveBeenLastCalledWith('123');
  });

  test('handles all zeros input on blur', () => {
    const handleChange = vi.fn();
    render(<Input inputMode="decimal" onChange={handleChange} />);

    const input = screen.getByRole('textbox');

    // 测试全是0的情况
    fireEvent.change(input, { target: { value: '000' } });
    fireEvent.blur(input);
    expect(handleChange).toHaveBeenLastCalledWith('0');
  });
});
