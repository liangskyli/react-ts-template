import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import TextArea from '@/components/core/components/textarea';

// 模拟 getComputedStyle
const originalGetComputedStyle = window.getComputedStyle;
beforeEach(() => {
  window.getComputedStyle = vi.fn().mockImplementation(() => ({
    lineHeight: '20px',
    paddingTop: '5px',
    paddingBottom: '5px',
    borderTopWidth: '1px',
    borderBottomWidth: '1px',
  }));
});

afterEach(() => {
  window.getComputedStyle = originalGetComputedStyle;
  vi.clearAllMocks();
});

describe('TextArea', () => {
  test('renders basic textarea correctly', () => {
    render(<TextArea placeholder="请输入内容" />);
    expect(screen.getByPlaceholderText('请输入内容')).toBeInTheDocument();
  });

  test('handles controlled value correctly', () => {
    const handleChange = vi.fn();
    const { rerender } = render(
      <TextArea value="初始内容" onChange={handleChange} />,
    );

    const textarea = screen.getByDisplayValue('初始内容');
    expect(textarea).toBeInTheDocument();

    fireEvent.change(textarea, { target: { value: '新内容' } });
    expect(handleChange).toHaveBeenCalledWith('新内容');

    // 测试受控更新
    rerender(<TextArea value="更新内容" onChange={handleChange} />);
    expect(screen.getByDisplayValue('更新内容')).toBeInTheDocument();
  });

  test('handles uncontrolled value with defaultValue', () => {
    render(<TextArea defaultValue="默认内容" />);
    const textarea = screen.getByDisplayValue('默认内容');

    fireEvent.change(textarea, { target: { value: '新内容' } });
    expect(screen.getByDisplayValue('新内容')).toBeInTheDocument();
  });

  test('shows character count when showCount is true', () => {
    render(<TextArea showCount defaultValue="测试内容" />);
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  test('shows character count with maxLength', () => {
    render(<TextArea showCount maxLength={100} defaultValue="测试内容" />);
    expect(screen.getByText('4/100')).toBeInTheDocument();
  });

  test('limits input based on maxLength', () => {
    const handleChange = vi.fn();
    render(
      <TextArea maxLength={5} defaultValue="12345" onChange={handleChange} />,
    );

    const textarea = screen.getByDisplayValue('12345');
    fireEvent.change(textarea, { target: { value: '123456' } });

    // 超过maxLength时不应该触发onChange
    expect(handleChange).not.toHaveBeenCalled();
  });

  test('applies custom className props', () => {
    const { container, rerender } = render(
      <TextArea
        className="custom-container"
        textareaClassName="custom-textarea"
        countClassName="custom-count"
        showCount
      />,
    );

    expect(container.querySelector('.custom-container')).toBeInTheDocument();
    expect(container.querySelector('.custom-textarea')).toBeInTheDocument();
    expect(container.querySelector('.custom-count')).toBeInTheDocument();

    rerender(
      <TextArea
        className={{
          root: 'custom-container',
          textarea: 'custom-textarea',
          count: 'custom-count',
        }}
        showCount
      />,
    );
    expect(container.querySelector('.custom-container')).toBeInTheDocument();
    expect(container.querySelector('.custom-textarea')).toBeInTheDocument();
    expect(container.querySelector('.custom-count')).toBeInTheDocument();
  });

  test('handles readOnly state correctly', () => {
    render(<TextArea readOnly defaultValue="只读内容" />);
    const textarea = screen.getByDisplayValue('只读内容');
    expect(textarea).toHaveAttribute('readonly');
    expect(textarea).toHaveClass('read-only:bg-gray-50');
  });

  test('handles disabled state correctly', () => {
    render(<TextArea disabled defaultValue="禁用内容" />);
    const textarea = screen.getByDisplayValue('禁用内容');
    expect(textarea).toBeDisabled();
    expect(textarea).toHaveClass('disabled:bg-gray-100');
  });

  // 测试 autoSize 功能
  test('adjusts height with autoSize=true', () => {
    // 模拟 scrollHeight
    Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
      configurable: true,
      get: function () {
        return 100;
      },
    });

    render(<TextArea autoSize defaultValue="测试自动高度" />);

    const textarea = screen.getByDisplayValue('测试自动高度');
    expect(textarea.style.height).toBe('100px');
    expect(textarea.style.minHeight).toBe('32px'); // 20 + 5 + 5 + 1 + 1
    expect(textarea.style.overflowY).toBe('hidden');

    // 触发内容变化以测试高度调整
    fireEvent.change(textarea, { target: { value: '新内容' } });
    expect(textarea.style.height).toBe('100px');
  });

  test('adjusts height with autoSize object config', () => {
    // 模拟 scrollHeight
    Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
      configurable: true,
      get: function () {
        return 120;
      },
    });

    render(
      <TextArea
        autoSize={{ minRows: 2, maxRows: 4 }}
        defaultValue="测试自动高度配置"
      />,
    );

    const textarea = screen.getByDisplayValue('测试自动高度配置');
    expect(textarea.style.minHeight).toBe('52px'); // 2 * 20 + 5 + 5 + 1 + 1
    expect(textarea.style.maxHeight).toBe('92px'); // 4 * 20 + 5 + 5 + 1 + 1
    expect(textarea.style.height).toBe('120px');
    expect(textarea.style.overflowY).toBe('auto'); // 因为 scrollHeight > maxHeight
  });

  // 测试 ref 处理
  test('handles ref correctly with function ref', () => {
    const refFn = vi.fn();
    render(<TextArea ref={refFn} />);
    expect(refFn).toHaveBeenCalled();
    expect(refFn.mock.calls[0][0]).toBeInstanceOf(HTMLTextAreaElement);
  });

  test('handles ref correctly with object ref', () => {
    const ref = React.createRef<HTMLTextAreaElement>();
    render(<TextArea ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  // 测试 useEffect 依赖项变化
  test('adjusts height when autoSize changes', () => {
    // 模拟 scrollHeight
    Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
      configurable: true,
      get: function () {
        return 80;
      },
    });

    const { rerender } = render(
      <TextArea autoSize={false} defaultValue="测试内容" />,
    );

    const textarea = screen.getByDisplayValue('测试内容');
    expect(textarea.style.height).not.toBe('80px');

    // 改变 autoSize 属性
    rerender(<TextArea autoSize={true} defaultValue="测试内容" />);
    expect(textarea.style.height).toBe('80px');
  });

  // 测试 autoSize 对象配置但没有设置 minRows 和 maxRows
  test('handles autoSize object without minRows and maxRows', () => {
    // 模拟 scrollHeight
    Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
      configurable: true,
      get: function () {
        return 90;
      },
    });

    render(<TextArea autoSize={{}} defaultValue="测试内容" />);
    const textarea = screen.getByDisplayValue('测试内容');

    // 应该使用默认的 minRows=1
    expect(textarea.style.minHeight).toBe('32px'); // 1 * 20 + 5 + 5 + 1 + 1
    // 不应该设置 maxHeight
    expect(textarea.style.maxHeight).toBe('');
    expect(textarea.style.height).toBe('90px');
  });

  // 测试 autoSize 对象配置只有 minRows 没有 maxRows
  test('handles autoSize object with only minRows', () => {
    // 模拟 scrollHeight
    Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
      configurable: true,
      get: function () {
        return 90;
      },
    });

    render(<TextArea autoSize={{ minRows: 3 }} defaultValue="测试内容" />);
    const textarea = screen.getByDisplayValue('测试内容');

    expect(textarea.style.minHeight).toBe('72px'); // 3 * 20 + 5 + 5 + 1 + 1
    expect(textarea.style.maxHeight).toBe('');
    expect(textarea.style.overflowY).toBe('hidden');
  });

  // 测试 scrollHeight 等于或小于 maxHeight 时的 overflowY 设置
  test('sets overflowY to hidden when scrollHeight <= maxHeight', () => {
    // 模拟 scrollHeight 等于 maxHeight
    Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
      configurable: true,
      get: function () {
        return 92;
      }, // 等于 maxHeight (4 * 20 + 5 + 5 + 1 + 1 = 92)
    });

    render(
      <TextArea
        autoSize={{ minRows: 2, maxRows: 4 }}
        defaultValue="测试内容"
      />,
    );

    const textarea = screen.getByDisplayValue('测试内容');
    expect(textarea.style.overflowY).toBe('hidden'); // scrollHeight = maxHeight 时应该是 hidden

    // 模拟 scrollHeight 小于 maxHeight
    Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
      configurable: true,
      get: function () {
        return 80;
      }, // 小于 maxHeight
    });

    // 触发重新渲染以重新计算高度
    fireEvent.change(textarea, { target: { value: '新内容' } });
    expect(textarea.style.overflowY).toBe('hidden'); // scrollHeight < maxHeight 时应该是 hidden
  });
});
