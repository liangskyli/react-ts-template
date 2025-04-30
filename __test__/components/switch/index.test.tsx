import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import Switch from '@/components/switch';

describe('Switch', () => {
  test('renders basic switch correctly', () => {
    render(<Switch />);
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toBeInTheDocument();
    expect(switchElement).toHaveAttribute('aria-checked', 'false');
  });

  test('renders with defaultChecked prop', () => {
    render(<Switch defaultChecked />);
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveAttribute('aria-checked', 'true');
  });

  test('handles controlled checked state correctly', () => {
    const { rerender } = render(<Switch checked={false} />);
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveAttribute('aria-checked', 'false');

    rerender(<Switch checked={true} />);
    expect(switchElement).toHaveAttribute('aria-checked', 'true');
  });

  test('handles onChange event', () => {
    const handleChange = vi.fn();

    // 使用 render 的返回值来清理之前的渲染
    const { unmount: unmountFirst } = render(
      <Switch onChange={handleChange} />,
    );

    const switchElement = screen.getByRole('switch');
    fireEvent.click(switchElement);
    expect(handleChange).toHaveBeenCalledWith(true);

    // 清除之前的渲染和模拟
    unmountFirst();
    handleChange.mockReset();

    // 现在DOM中应该没有switch元素了，可以安全地渲染新的
    render(<Switch onChange={handleChange} checked={true} />);

    const updatedSwitch = screen.getByRole('switch');
    fireEvent.click(updatedSwitch);
    expect(handleChange).toHaveBeenCalledWith(false);
  });

  test('renders in disabled state', () => {
    render(<Switch disabled />);
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toBeDisabled();
  });

  test('does not trigger onChange when disabled', () => {
    const handleChange = vi.fn();
    render(<Switch onChange={handleChange} disabled />);

    const switchElement = screen.getByRole('switch');
    fireEvent.click(switchElement);
    expect(handleChange).not.toHaveBeenCalled();
  });

  test('renders in loading state', () => {
    render(<Switch loading />);
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toBeDisabled();
  });

  test('renders with children', () => {
    render(<Switch>Switch Label</Switch>);
    expect(screen.getByText('Switch Label')).toBeInTheDocument();
  });

  test('renders with checkedText and uncheckedText', () => {
    render(<Switch checkedText="ON" uncheckedText="OFF" />);
    expect(screen.getByText('OFF')).toBeInTheDocument();

    // Check if the ON text is in the document but might be hidden
    const onText = screen.getByText('ON');
    expect(onText).toBeInTheDocument();

    // 检查初始状态下的文本可见性
    // 注意：根据组件实现，可能使用不同的方式控制可见性
    expect(onText.closest('span')).toHaveClass('group-data-[checked]:inline');

    // Click to toggle and check if text visibility changes
    fireEvent.click(screen.getByRole('switch'));

    // 检查切换后的文本可见性
    const offText = screen.getByText('OFF');
    expect(offText.closest('span')).toHaveClass('group-data-[checked]:hidden');
  });

  test('applies custom class names', () => {
    const { container } = render(
      <Switch
        className="test-class"
        trackClassName="test-track"
        thumbClassName="test-thumb"
      />,
    );

    expect(container.firstChild).toHaveClass('test-class');
    expect(screen.getByRole('switch')).toHaveClass('test-track');

    // Find the thumb element
    const thumbElement = container.querySelector('.test-thumb');
    expect(thumbElement).toBeInTheDocument();
  });

  test('applies custom text class names', () => {
    // 使用一个更简单的测试方法
    const { container } = render(
      <Switch
        checkedText="ON"
        uncheckedText="OFF"
        checkedTextClassName="test-checked-text"
        uncheckedTextClassName="test-unchecked-text"
      />,
    );

    // 只检查类名是否被应用到DOM中
    expect(container.innerHTML.includes('test-checked-text')).toBe(true);
    expect(container.innerHTML.includes('test-unchecked-text')).toBe(true);

    // 检查文本是否存在
    expect(container.textContent).toContain('ON');
    expect(container.textContent).toContain('OFF');
  });
});
