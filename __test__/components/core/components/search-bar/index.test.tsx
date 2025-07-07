import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import SearchBar from '@/components/core/components/search-bar';

describe('SearchBar', () => {
  it('renders basic search bar correctly', () => {
    render(<SearchBar placeholder="请输入搜索内容" />);
    const input = screen.getByPlaceholderText('请输入搜索内容');
    expect(input).toBeInTheDocument();
    expect(input.tagName).toBe('INPUT');
  });

  it('renders with search icon by default', () => {
    render(<SearchBar />);
    const searchIcon = screen.queryByRole('search-icon');
    expect(searchIcon).toBeInTheDocument();
  });

  it('hides search icon when showSearchIcon is false', () => {
    render(<SearchBar showSearchIcon={false} />);
    const searchIcon = screen.queryByRole('search-icon');
    expect(searchIcon).toBeNull();
  });

  it('handles controlled value correctly', () => {
    const { rerender } = render(<SearchBar value="test" />);
    const input = screen.getByDisplayValue('test');
    expect(input).toBeInTheDocument();

    rerender(<SearchBar value="updated" />);
    expect(screen.getByDisplayValue('updated')).toBeInTheDocument();
  });

  it('handles uncontrolled value correctly', () => {
    render(<SearchBar defaultValue="default" />);
    const input = screen.getByDisplayValue('default');
    expect(input).toBeInTheDocument();
  });

  it('calls onChange when input value changes', () => {
    const handleChange = vi.fn();
    render(<SearchBar onChange={handleChange} />);
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'test input' } });
    expect(handleChange).toHaveBeenCalledWith('test input');
  });

  it('calls onSearch when Enter key is pressed', () => {
    const handleSearch = vi.fn();
    render(<SearchBar onSearch={handleSearch} value="search term" />);
    const input = screen.getByRole('textbox');

    fireEvent.keyDown(input, { key: 'Enter' });
    expect(handleSearch).toHaveBeenCalledWith('search term');
  });

  it('shows clear button when there is input value', () => {
    render(<SearchBar value="test" />);
    const clearButton = screen.queryByRole('clear-button');
    expect(clearButton).toBeInTheDocument();
  });

  it('hides clear button when input is empty', () => {
    render(<SearchBar />);
    // 只有搜索图标，没有清除按钮
    expect(screen.queryByRole('search-icon')).toBeInTheDocument();
    expect(screen.queryByRole('clear-button')).toBeNull();
  });

  it('clears input when clear button is clicked', () => {
    const handleChange = vi.fn();
    const handleClear = vi.fn();
    render(
      <SearchBar value="test" onChange={handleChange} onClear={handleClear} />,
    );

    const clearButton = screen.getByRole('clear-button');
    expect(clearButton).toBeInTheDocument();
    fireEvent.mouseDown(clearButton);
    fireEvent.click(clearButton);

    expect(handleChange).toHaveBeenCalledWith('');
    expect(handleClear).toHaveBeenCalled();
  });

  it('handles disabled state correctly', () => {
    render(<SearchBar disabled value="test" />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();

    // 禁用状态下不显示清除按钮
    expect(screen.queryByRole('clear-button')).toBeNull();
  });

  it('handles readOnly state correctly', () => {
    render(<SearchBar readOnly value="test" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('readonly');

    // 只读状态下不显示清除按钮
    expect(screen.queryByRole('clear-button')).toBeNull();
  });

  it('respects maxLength prop', () => {
    render(<SearchBar maxLength={10} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('maxLength', '10');
  });

  it('calls onFocus and onBlur correctly', () => {
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();
    render(<SearchBar onFocus={handleFocus} onBlur={handleBlur} />);
    const input = screen.getByRole('textbox');

    fireEvent.focus(input);
    expect(handleFocus).toHaveBeenCalled();

    fireEvent.blur(input);
    expect(handleBlur).toHaveBeenCalled();
  });

  it('applies custom className', () => {
    const { container } = render(<SearchBar className="custom-search-bar" />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('custom-search-bar');
  });

  it('hides clear button when showClearButton is false', () => {
    render(<SearchBar showClearButton={false} value="test" />);
    // 只有搜索图标，没有清除按钮
    expect(screen.queryByRole('search-icon')).toBeInTheDocument();
    expect(screen.queryByRole('clear-button')).toBeNull();
  });

  it('handles ref correctly with function ref', () => {
    const refFn = vi.fn();
    render(<SearchBar ref={refFn} />);
    expect(refFn).toHaveBeenCalled();
    expect(refFn.mock.calls[0][0]).toBeDefined();
  });

  it('handles ref correctly with object ref', () => {
    const ref = React.createRef<HTMLElement>();
    render(<SearchBar ref={ref} />);
    expect(ref.current).toBeDefined();
  });

  it('handles custom icons', () => {
    const CustomSearchIcon = () => <div data-testid="custom-search">✓</div>;
    const CustomClearIcon = () => <div data-testid="custom-clear">-</div>;
    render(
      <SearchBar
        value="test"
        searchIcon={<CustomSearchIcon />}
        clearIcon={<CustomClearIcon />}
      />,
    );
    expect(screen.getByTestId('custom-search')).toBeInTheDocument();
    expect(screen.getByTestId('custom-clear')).toBeInTheDocument();
  });
});
