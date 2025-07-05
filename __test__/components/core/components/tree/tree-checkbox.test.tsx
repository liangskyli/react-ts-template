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

// Mock Checkbox component
vi.mock('@/components/core/components/checkbox', () => {
  const MockCheckbox = ({
    children,
    value,
    disabled,
    checked,
    indeterminate,
    onChange,
    ...props
  }: any) => {
    const handleClick = () => {
      if (!disabled && onChange) {
        onChange(!checked);
      }
    };

    return (
      <div
        data-testid="checkbox-option"
        data-value={value}
        data-disabled={disabled ? true : undefined}
        data-checked={checked ? true : undefined}
        data-indeterminate={indeterminate}
        onClick={handleClick}
        {...props}
      >
        {children}
      </div>
    );
  };

  return {
    default: MockCheckbox,
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
      {
        key: '2-4',
        title: '子节点2-4',
        children: [
          {
            key: '2-4-1',
            title: '子节点2-4-1',
          },
          {
            key: '2-4-2',
            title: '禁用子节点2-4-2',
            disabled: true,
          },
        ],
      },
    ],
  },
  {
    key: '3',
    title: '叶子节点3',
  },
];

describe('Tree.Checkbox Component', () => {
  it('renders checkbox tree correctly', () => {
    render(
      <Tree.Checkbox
        treeData={mockTreeData}
        defaultExpandedKeys={['1', '2']}
      />,
    );

    expect(screen.getByText('父节点1')).toBeInTheDocument();
    expect(screen.getByText('子节点1-1')).toBeInTheDocument();
    expect(screen.getByText('子节点2-1')).toBeInTheDocument();

    // 应该有checkbox选项
    expect(screen.getAllByTestId('checkbox-option')).toHaveLength(8);
  });

  it('handles multiple selection correctly', () => {
    const onSelect = vi.fn();
    render(
      <Tree.Checkbox
        treeData={mockTreeData}
        defaultExpandedKeys={['1', '2']}
        onSelect={onSelect}
      />,
    );

    // 选择一个子节点
    fireEvent.click(screen.getByText('子节点1-1'));
    expect(onSelect).toHaveBeenCalledWith(['1-1'], {
      allEffectivelySelectedKeys: ['1-1', '1'],
      checkedKeys: ['1-1'],
      halfCheckedKeys: ['1'],
      leafKeys: ['1-1'],
      nonLeafKeys: ['1'],
    });

    fireEvent.click(screen.getByText('子节点1-1'));
    expect(onSelect).toHaveBeenCalledWith([], {
      allEffectivelySelectedKeys: [],
      checkedKeys: [],
      halfCheckedKeys: [],
      leafKeys: [],
      nonLeafKeys: [],
    });

    fireEvent.click(screen.getByText('父节点2'));
    expect(onSelect).toHaveBeenCalledWith(['2-1', '2-4-1'], {
      allEffectivelySelectedKeys: ['2-1', '2-4-1', '2', '2-4'],
      checkedKeys: ['2-1', '2-4-1'],
      halfCheckedKeys: ['2', '2-4'],
      leafKeys: ['2-1', '2-4-1'],
      nonLeafKeys: ['2', '2-4'],
    });

    // 存在disabled时，半选点击变未选
    fireEvent.click(screen.getByText('子节点2-4'));
    expect(onSelect).toHaveBeenCalledWith(['2-1'], {
      allEffectivelySelectedKeys: ['2-1', '2'],
      checkedKeys: ['2-1'],
      halfCheckedKeys: ['2'],
      leafKeys: ['2-1'],
      nonLeafKeys: ['2'],
    });
  });

  it('defaultSelectedKeys use no-key, handles multiple selection correctly', () => {
    const onSelect = vi.fn();
    render(
      <Tree.Checkbox
        treeData={mockTreeData}
        defaultExpandedKeys={['1', '2']}
        defaultSelectedKeys={['no-key']}
        onSelect={onSelect}
      />,
    );

    // 选择一个子节点
    fireEvent.click(screen.getByText('子节点1-1'));
    expect(onSelect).toHaveBeenCalledWith(['no-key', '1-1'], {
      allEffectivelySelectedKeys: ['no-key', '1-1', '1'],
      checkedKeys: ['no-key', '1-1'],
      halfCheckedKeys: ['1'],
      leafKeys: ['1-1'],
      nonLeafKeys: ['1'],
    });
  });

  it('handles parent-child cascade selection correctly', () => {
    const onSelect = vi.fn();
    render(
      <Tree.Checkbox
        treeData={mockTreeData}
        defaultExpandedKeys={['1']}
        onSelect={onSelect}
      />,
    );

    // 选择父节点，应该同时选中所有子节点
    fireEvent.click(screen.getByText('父节点1'));

    expect(onSelect).toHaveBeenCalledWith(
      expect.arrayContaining(['1', '1-1', '1-2']),
      expect.objectContaining({
        allEffectivelySelectedKeys: expect.arrayContaining(['1', '1-1', '1-2']),
        checkedKeys: expect.any(Array),
        halfCheckedKeys: expect.any(Array),
      }),
    );
  });

  it('handles indeterminate state correctly', () => {
    render(
      <Tree.Checkbox
        treeData={mockTreeData}
        defaultExpandedKeys={['1']}
        defaultSelectedKeys={['1-1']} // 只选中一个子节点
      />,
    );

    // 父节点应该显示半选状态
    const parentCheckbox = screen
      .getByText('父节点1')
      .closest('[data-testid="checkbox-option"]');
    expect(parentCheckbox).toHaveAttribute('data-indeterminate', 'true');
    expect(parentCheckbox).not.toHaveAttribute('data-checked');
  });

  it('handles controlled selectedKeys correctly', () => {
    const { rerender } = render(
      <Tree.Checkbox
        treeData={mockTreeData}
        defaultExpandedKeys={['1']}
        selectedKeys={['1-1']}
      />,
    );

    const childCheckbox = screen
      .getByText('子节点1-1')
      .closest('[data-testid="checkbox-option"]');
    expect(childCheckbox).toHaveAttribute('data-checked', 'true');

    // 更新selectedKeys
    rerender(
      <Tree.Checkbox
        treeData={mockTreeData}
        defaultExpandedKeys={['1']}
        selectedKeys={['1-2']}
      />,
    );

    expect(childCheckbox).not.toHaveAttribute('data-checked');
    const newChildCheckbox = screen
      .getByText('子节点1-2')
      .closest('[data-testid="checkbox-option"]');
    expect(newChildCheckbox).toHaveAttribute('data-checked', 'true');
  });

  it('handles checkStrictly mode correctly', () => {
    const onSelect = vi.fn();
    render(
      <Tree.Checkbox
        treeData={mockTreeData}
        defaultExpandedKeys={['1']}
        checkStrictly={true}
        onSelect={onSelect}
      />,
    );

    // 在严格模式下，选择父节点不应该影响子节点
    fireEvent.click(screen.getByText('父节点1'));

    expect(onSelect).toHaveBeenCalledWith(
      ['1'],
      expect.objectContaining({
        allEffectivelySelectedKeys: ['1'],
        checkedKeys: ['1'],
      }),
    );

    fireEvent.click(screen.getByText('父节点1'));
    expect(onSelect).toHaveBeenCalledWith(
      [],
      expect.objectContaining({
        allEffectivelySelectedKeys: [],
        checkedKeys: [],
      }),
    );
  });

  it('handles onlyLeafSelectable correctly', () => {
    const onSelect = vi.fn();
    render(
      <Tree.Checkbox
        treeData={mockTreeData}
        defaultExpandedKeys={['1', '2']}
        onlyLeafSelectable={true}
        onSelect={onSelect}
      />,
    );

    // 父节点不应该有checkbox选项
    const parentNode = screen.getByText('父节点1');
    const parentCheckbox = parentNode.closest(
      '[data-testid="checkbox-option"]',
    );
    expect(parentCheckbox).toBeNull();

    // 叶子节点应该有checkbox选项
    const leafNode = screen.getByText('子节点1-1');
    const leafCheckbox = leafNode.closest('[data-testid="checkbox-option"]');
    expect(leafCheckbox).not.toBeNull();

    // 选择叶子节点
    fireEvent.click(screen.getByText('子节点2-1'));
    expect(onSelect).toHaveBeenCalledWith(['2-1'], {
      allEffectivelySelectedKeys: ['2-1'],
      checkedKeys: ['2-1'],
      halfCheckedKeys: [],
      leafKeys: ['2-1'],
      nonLeafKeys: [],
    });
  });

  it('handles disabled nodes correctly', () => {
    render(
      <Tree.Checkbox treeData={mockTreeData} defaultExpandedKeys={['2']} />,
    );

    const disabledCheckbox = screen
      .getByText('禁用子节点2-2')
      .closest('[data-testid="checkbox-option"]');
    expect(disabledCheckbox).toHaveAttribute('data-disabled', 'true');

    const normalCheckbox = screen
      .getByText('子节点2-1')
      .closest('[data-testid="checkbox-option"]');
    expect(normalCheckbox).not.toHaveAttribute('data-disabled');
  });

  it('handles selectable=false nodes correctly', () => {
    render(
      <Tree.Checkbox treeData={mockTreeData} defaultExpandedKeys={['2']} />,
    );

    // 不可选择的节点不应该有checkbox选项
    const nonSelectableNode = screen.getByText('不可选择子节点2-3');
    const nonSelectableCheckbox = nonSelectableNode.closest(
      '[data-testid="checkbox-option"]',
    );
    expect(nonSelectableCheckbox).toBeNull();

    // 正常节点应该有checkbox选项
    const normalNode = screen.getByText('子节点2-1');
    const normalCheckbox = normalNode.closest(
      '[data-testid="checkbox-option"]',
    );
    expect(normalCheckbox).not.toBeNull();
  });

  it('handles maxSelectCount correctly', () => {
    const onMaxSelectReached = vi.fn();
    render(
      <Tree.Checkbox
        treeData={mockTreeData}
        defaultExpandedKeys={['1']}
        maxSelectCount={2}
        onMaxSelectReached={onMaxSelectReached}
      />,
    );

    // 选择两个节点
    fireEvent.click(screen.getByText('子节点1-1'));
    fireEvent.click(screen.getByText('子节点1-2'));

    // 尝试选择第三个节点应该触发回调
    fireEvent.click(screen.getByText('父节点1'));

    expect(onMaxSelectReached).toHaveBeenCalledWith(2);
  });

  it('shows children as not selected when parent is selected', () => {
    render(
      <Tree.Checkbox
        treeData={mockTreeData}
        defaultExpandedKeys={['1']}
        defaultSelectedKeys={['1']} // 只选中父节点,目前不支持这样设置
      />,
    );

    // 子节点应该显示为选中状态（即使不在selectedKeys中）
    const childCheckbox = screen
      .getByText('子节点1-1')
      .closest('[data-testid="checkbox-option"]');
    expect(childCheckbox).not.toHaveAttribute('data-checked');
  });

  it('handles indeterminate state with disabled children', () => {
    const treeDataWithDisabled = [
      {
        key: '1',
        title: '父节点1',
        children: [
          { key: '1-1', title: '正常子节点1-1' },
          { key: '1-2', title: '禁用子节点1-2', disabled: true },
        ],
      },
    ];

    render(
      <Tree.Checkbox
        treeData={treeDataWithDisabled}
        defaultExpandedKeys={['1']}
        defaultSelectedKeys={['1-1']} // 只选中正常的子节点
      />,
    );

    // 父节点应该显示半选状态
    const parentCheckbox = screen
      .getByText('父节点1')
      .closest('[data-testid="checkbox-option"]');
    expect(parentCheckbox).toHaveAttribute('data-indeterminate', 'true');
  });

  it('handles uncontrolled state correctly', () => {
    const onSelect = vi.fn();
    render(
      <Tree.Checkbox
        treeData={mockTreeData}
        defaultExpandedKeys={['1']}
        onSelect={onSelect}
      />,
    );

    // 选择节点
    fireEvent.click(screen.getByText('子节点1-1'));
    expect(onSelect).toHaveBeenCalledWith(['1-1'], expect.any(Object));

    // 再选择另一个节点
    fireEvent.click(screen.getByText('子节点1-2'));
    expect(onSelect).toHaveBeenCalledWith(
      ['1-1', '1-2-1', '1-2', '1'],
      expect.any(Object),
    );
  });

  it('applies custom className correctly', () => {
    render(
      <Tree.Checkbox
        treeData={mockTreeData}
        className="custom-checkbox-class"
      />,
    );

    const treeContainer = screen.getByTestId('tree-container');
    expect(treeContainer).toHaveClass('custom-checkbox-class');
  });

  it('handles empty treeData correctly', () => {
    render(<Tree.Checkbox treeData={[]} />);

    const treeContainer = screen.getByTestId('tree-container');
    expect(treeContainer).toBeEmptyDOMElement();
  });

  it('passes through tree props correctly', () => {
    render(
      <Tree.Checkbox
        treeData={mockTreeData}
        showIcon={false}
        indentWidth={48}
        virtualScroll={true}
      />,
    );

    // 验证props被正确传递给Tree组件
    expect(screen.getByTestId('tree-container')).toBeInTheDocument();
  });

  it('handles cascade deselection correctly', () => {
    const onSelect = vi.fn();
    render(
      <Tree.Checkbox
        treeData={mockTreeData}
        defaultExpandedKeys={['1']}
        defaultSelectedKeys={['1', '1-1', '1-2']} // 全选父子节点
        onSelect={onSelect}
      />,
    );

    // 取消选择父节点，应该同时取消选择所有子节点
    fireEvent.click(screen.getByText('父节点1'));

    expect(onSelect).toHaveBeenCalledWith(
      [],
      expect.objectContaining({
        allEffectivelySelectedKeys: [],
        checkedKeys: [],
      }),
    );
  });

  it('handles partial selection correctly', () => {
    render(
      <Tree.Checkbox
        treeData={mockTreeData}
        defaultExpandedKeys={['1', '1-2']}
        defaultSelectedKeys={['1-2-1']} // 选中部分子节点
      />,
    );

    // 父节点应该显示半选状态
    const parentCheckbox = screen
      .getByText('父节点1')
      .closest('[data-testid="checkbox-option"]');
    expect(parentCheckbox).toHaveAttribute('data-indeterminate', 'true');

    // 中间节点应该显示全选状态
    const middleCheckbox = screen
      .getByText('子节点1-2')
      .closest('[data-testid="checkbox-option"]');
    expect(middleCheckbox).toHaveAttribute('data-indeterminate', 'false');
  });

  it('handles deep nesting cascade correctly', () => {
    const deepTreeData = [
      {
        key: '1',
        title: '根节点',
        children: [
          {
            key: '1-1',
            title: '二级节点',
            children: [
              {
                key: '1-1-1',
                title: '三级节点',
                children: [
                  {
                    key: '1-1-1-1',
                    title: '四级节点',
                  },
                ],
              },
            ],
          },
        ],
      },
    ];

    const onSelect = vi.fn();
    render(
      <Tree.Checkbox
        treeData={deepTreeData}
        defaultExpandedKeys={['1', '1-1', '1-1-1']}
        onSelect={onSelect}
      />,
    );

    // 选择根节点，应该级联选择所有子孙节点
    fireEvent.click(screen.getByText('根节点'));

    expect(onSelect).toHaveBeenCalledWith(
      expect.arrayContaining(['1', '1-1', '1-1-1', '1-1-1-1']),
      expect.any(Object),
    );
  });

  it('handles mixed disabled and normal children correctly', () => {
    const mixedTreeData = [
      {
        key: '1',
        title: '父节点',
        children: [
          { key: '1-1', title: '正常子节点1', disabled: false },
          { key: '1-2', title: '禁用子节点', disabled: true },
          { key: '1-3', title: '正常子节点2' },
        ],
      },
    ];

    const onSelect = vi.fn();
    render(
      <Tree.Checkbox
        treeData={mixedTreeData}
        defaultExpandedKeys={['1']}
        onSelect={onSelect}
      />,
    );

    // 选择父节点，只应该选择非禁用的子节点
    fireEvent.click(screen.getByText('父节点'));

    expect(onSelect).toHaveBeenCalledWith(
      expect.arrayContaining(['1-1', '1-3']),
      {
        allEffectivelySelectedKeys: ['1-1', '1-3', '1'],
        checkedKeys: ['1-1', '1-3'],
        halfCheckedKeys: ['1'],
        leafKeys: ['1-1', '1-3'],
        nonLeafKeys: ['1'],
      },
    );
  });

  it('handles maxSelectCount with cascade selection correctly', () => {
    const onMaxSelectReached = vi.fn();
    render(
      <Tree.Checkbox
        treeData={mockTreeData}
        defaultExpandedKeys={['1']}
        maxSelectCount={2}
        onMaxSelectReached={onMaxSelectReached}
      />,
    );

    expect(screen.getByText('子节点1-1')).not.toHaveAttribute('data-disabled');
    // 尝试选择父节点（会级联选择多个子节点，超过限制）
    fireEvent.click(screen.getByText('父节点1'));
    expect(onMaxSelectReached).toHaveBeenCalledWith(2);

    // 选择2个后，其它的不可选
    fireEvent.click(screen.getByText('子节点1-2'));
    expect(screen.getByText('子节点1-1')).toHaveAttribute(
      'data-disabled',
      'true',
    );
  });

  it('handles custom rendering correctly across variants', () => {
    const customRenderNode = (node: any) => (
      <span data-testid="custom-node">{node.title} (自定义)</span>
    );

    render(
      <Tree.Checkbox treeData={mockTreeData} renderNode={customRenderNode} />,
    );

    expect(screen.getByText('父节点1 (自定义)')).toBeInTheDocument();
  });

  it('handles ref correctly with function ref', () => {
    const refFn = vi.fn();
    render(<Tree.Checkbox treeData={mockTreeData} ref={refFn} />);
    expect(refFn).toHaveBeenCalled();
    expect(refFn.mock.calls[0][0]).toBeDefined();
  });

  it('handles ref correctly with object ref', () => {
    const ref = React.createRef<TreeRef>();
    render(<Tree.Checkbox treeData={mockTreeData} ref={ref} />);
    expect(ref.current).toBeDefined();
    expect(ref.current!.getFlattenNodes().length).toBe(3);
  });
});
