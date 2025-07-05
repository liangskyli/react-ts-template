import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Tree, { type TreeRef } from '@/components/core/components/tree';

/* eslint-disable @typescript-eslint/no-explicit-any */

// Mock List component
vi.mock('@/components/core/components/list', () => {
  return {
    default: ({ children, list, className, ...props }: any) => {
      const items =
        typeof children === 'function' ? children(list || []) : children;
      return (
        <div className={className} data-testid="tree-container" {...props}>
          {items}
        </div>
      );
    },
  };
});

// Mock RadioGroup component
vi.mock('@/components/core/components/radio', () => {
  const MockRadio = ({ children, value, disabled, ...props }: any) => {
    return (
      <div
        data-testid="radio-option"
        data-value={value}
        data-disabled={disabled ? true : undefined}
        {...props}
      >
        {children}
      </div>
    );
  };

  const MockRadioGroup = ({
    children,
    value,
    onChange,
    allowDeselect,
    className,
    ...props
  }: any) => {
    const handleClick = (event: any) => {
      const target = event.target.closest('[data-testid="radio-option"]');
      if (target && !target.getAttribute('data-disabled')) {
        const newValue = target.getAttribute('data-value');
        if (allowDeselect && value === newValue) {
          onChange?.(null);
        } else {
          onChange?.(newValue);
        }
      }
    };

    return (
      <div
        data-testid="radio-group"
        data-value={value}
        data-allow-deselect={allowDeselect}
        className={className}
        onClick={handleClick}
        {...props}
      >
        {children}
      </div>
    );
  };

  MockRadioGroup.Radio = MockRadio;

  return {
    default: MockRadioGroup,
  };
});

const mockTreeData = [
  {
    key: '1',
    title: '父节点1',
    children: [
      {
        key: '1-1',
        title: '子节点1-1',
      },
      {
        key: '1-2',
        title: '子节点1-2',
        children: [
          {
            key: '1-2-1',
            title: '子节点1-2-1',
          },
        ],
      },
    ],
  },
  {
    key: '2',
    title: '父节点2',
    children: [
      {
        key: '2-1',
        title: '子节点2-1',
      },
      {
        key: '2-2',
        title: '禁用子节点2-2',
        disabled: true,
      },
      {
        key: '2-3',
        title: '不可选择子节点2-3',
        selectable: false,
      },
    ],
  },
  {
    key: '3',
    title: '叶子节点3',
  },
  {
    key: '4',
    title: '不可选择叶子节点4',
    selectable: false,
  },
];

describe('Tree.Radio Component', () => {
  it('renders radio tree correctly', () => {
    render(
      <Tree.Radio treeData={mockTreeData} defaultExpandedKeys={['1', '2']} />,
    );

    expect(screen.getByTestId('radio-group')).toBeInTheDocument();
    expect(screen.getByText('父节点1')).toBeInTheDocument();
    expect(screen.getByText('子节点1-1')).toBeInTheDocument();
    expect(screen.getByText('子节点2-1')).toBeInTheDocument();
  });

  it('handles single selection correctly', () => {
    const onSelect = vi.fn();
    render(
      <Tree.Radio
        treeData={mockTreeData}
        defaultExpandedKeys={['1']}
        onSelect={onSelect}
      />,
    );

    // 选择一个节点
    fireEvent.click(screen.getByText('子节点1-1'));

    expect(onSelect).toHaveBeenCalledWith(
      '1-1',
      expect.objectContaining({
        node: expect.objectContaining({ key: '1-1' }),
      }),
    );
  });

  it('handles controlled selectedKey correctly', () => {
    const { rerender } = render(
      <Tree.Radio
        treeData={mockTreeData}
        defaultExpandedKeys={['1']}
        selectedKey={'1-1'}
      />,
    );

    const radioGroup = screen.getByTestId('radio-group');
    expect(radioGroup).toHaveAttribute('data-value', '1-1');

    // 更新selectedKey
    rerender(
      <Tree.Radio
        treeData={mockTreeData}
        defaultExpandedKeys={['1']}
        selectedKey={'1-2'}
      />,
    );

    expect(radioGroup).toHaveAttribute('data-value', '1-2');
  });

  it('handles defaultSelectedKey correctly', () => {
    render(
      <Tree.Radio
        treeData={mockTreeData}
        defaultExpandedKeys={['1']}
        defaultSelectedKey={'1-1'}
      />,
    );

    const radioGroup = screen.getByTestId('radio-group');
    expect(radioGroup).toHaveAttribute('data-value', '1-1');
  });

  it('handles allowDeselect correctly', () => {
    const onSelect = vi.fn();
    render(
      <Tree.Radio
        treeData={mockTreeData}
        defaultExpandedKeys={['1']}
        defaultSelectedKey={'1-1'}
        allowDeselect={true}
        onSelect={onSelect}
      />,
    );

    const radioGroup = screen.getByTestId('radio-group');
    expect(radioGroup).toHaveAttribute('data-allow-deselect', 'true');
    expect(radioGroup).toHaveAttribute('data-value', '1-1');

    // 点击已选中的节点应该取消选择
    fireEvent.click(screen.getByText('子节点1-1'));

    expect(onSelect).toHaveBeenCalledWith(null, {
      node: undefined,
    });
    expect(radioGroup).not.toHaveAttribute('data-value');
  });

  it('handles disabled nodes correctly', () => {
    render(<Tree.Radio treeData={mockTreeData} defaultExpandedKeys={['2']} />);

    const disabledRadio = screen
      .getByText('禁用子节点2-2')
      .closest('[data-testid="radio-option"]');
    expect(disabledRadio).toHaveAttribute('data-disabled', 'true');

    const normalRadio = screen
      .getByText('子节点2-1')
      .closest('[data-testid="radio-option"]');
    expect(normalRadio).not.toHaveAttribute('data-disabled');
  });

  it('handles selectable=false nodes correctly', () => {
    render(<Tree.Radio treeData={mockTreeData} defaultExpandedKeys={['2']} />);

    // 不可选择的节点不应该有radio选项
    const nonSelectableNode = screen.getByText('不可选择子节点2-3');
    const nonSelectableRadio = nonSelectableNode.closest(
      '[data-testid="radio-option"]',
    );
    expect(nonSelectableRadio).toBeNull();

    // 正常节点应该有radio选项
    const normalNode = screen.getByText('子节点2-1');
    const normalRadio = normalNode.closest('[data-testid="radio-option"]');
    expect(normalRadio).not.toBeNull();
  });

  it('handles onlyLeafSelectable correctly', () => {
    render(
      <Tree.Radio
        treeData={mockTreeData}
        defaultExpandedKeys={['1', '2']}
        onlyLeafSelectable={true}
      />,
    );

    // 父节点不应该有radio选项
    const parentNode = screen.getByText('父节点1');
    const parentRadio = parentNode.closest('[data-testid="radio-option"]');
    expect(parentRadio).toBeNull();

    // 叶子节点应该有radio选项
    const leafNode = screen.getByText('子节点1-1');
    const leafRadio = leafNode.closest('[data-testid="radio-option"]');
    expect(leafRadio).not.toBeNull();
  });

  it('applies custom className correctly', () => {
    render(
      <Tree.Radio
        treeData={mockTreeData}
        className="custom-radio-class"
        treeClassName="custom-tree-class"
      />,
    );

    const radioGroup = screen.getByTestId('radio-group');
    expect(radioGroup).toHaveClass('custom-radio-class');

    const treeContainer = screen.getByTestId('tree-container');
    expect(treeContainer).toHaveClass('custom-tree-class');
  });

  it('handles uncontrolled state correctly', () => {
    const onSelect = vi.fn();
    render(
      <Tree.Radio
        treeData={mockTreeData}
        defaultExpandedKeys={['1']}
        onSelect={onSelect}
      />,
    );

    // 选择第一个节点
    fireEvent.click(screen.getByText('子节点1-1'));
    expect(onSelect).toHaveBeenCalledWith('1-1', expect.any(Object));

    // 选择第二个节点
    fireEvent.click(screen.getByText('子节点1-2'));
    expect(onSelect).toHaveBeenCalledWith('1-2', expect.any(Object));
  });

  it('handles null selectedKey correctly', () => {
    render(
      <Tree.Radio
        treeData={mockTreeData}
        defaultExpandedKeys={['1']}
        selectedKey={null}
      />,
    );

    const radioGroup = screen.getByTestId('radio-group');
    expect(radioGroup).not.toHaveAttribute('data-value');
  });

  it('passes through tree props correctly', () => {
    render(
      <Tree.Radio
        treeData={mockTreeData}
        showIcon={false}
        indentWidth={48}
        virtualScroll={true}
      />,
    );

    // 验证props被正确传递给Tree组件
    expect(screen.getByTestId('tree-container')).toBeInTheDocument();
  });

  it('handles empty treeData correctly', () => {
    render(<Tree.Radio treeData={[]} />);

    expect(screen.getByTestId('radio-group')).toBeInTheDocument();
    const treeContainer = screen.getByTestId('tree-container');
    expect(treeContainer).toBeEmptyDOMElement();
  });

  it('handles custom rendering correctly across variants', () => {
    const customRenderNode = (node: any) => (
      <span data-testid="custom-node">{node.title} (自定义)</span>
    );

    render(
      <Tree.Radio treeData={mockTreeData} renderNode={customRenderNode} />,
    );

    expect(screen.getByText('父节点1 (自定义)')).toBeInTheDocument();
  });

  it('handles ref correctly with function ref', () => {
    const refFn = vi.fn();
    render(<Tree.Radio treeData={mockTreeData} ref={refFn} />);
    expect(refFn).toHaveBeenCalled();
    expect(refFn.mock.calls[0][0]).toBeDefined();
  });

  it('handles ref correctly with object ref', () => {
    const ref = React.createRef<TreeRef>();
    render(<Tree.Radio treeData={mockTreeData} ref={ref} />);
    expect(ref.current).toBeDefined();
    expect(ref.current!.getFlattenNodes().length).toBe(4);
  });
});
