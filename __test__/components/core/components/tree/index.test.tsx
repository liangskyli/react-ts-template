import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { TreeRef } from '@/components/core/components/tree';
import Tree from '@/components/core/components/tree';

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
  const MockRadio = ({ children, value, disabled, onClick, ...props }: any) => {
    const handleClick = () => {
      if (!disabled) {
        // 获取父级RadioGroup的onChange
        const radioGroup = document.querySelector(
          '[data-testid="radio-group"]',
        );
        const onChangeStr = radioGroup?.getAttribute('data-onchange');
        if (onChangeStr) {
          const onChange = (window as any)[onChangeStr];
          onChange?.(value);
        }
        onClick?.(value);
      }
    };

    return (
      <div
        data-testid="radio-option"
        data-value={value}
        data-disabled={disabled}
        onClick={handleClick}
        {...props}
      >
        {children}
      </div>
    );
  };

  const MockRadioGroup = ({ children, value, onChange, ...props }: any) => {
    // 将onChange存储到全局，以便Radio可以访问
    const onChangeKey = `onChange_${Math.random()}`;
    if (onChange) {
      (window as any)[onChangeKey] = onChange;
    }

    return (
      <div
        data-testid="radio-group"
        data-value={value}
        data-onchange={onChangeKey}
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
        data-disabled={disabled}
        data-checked={checked}
        data-indeterminate={indeterminate}
        onClick={handleClick}
        {...props}
      >
        {children}
      </div>
    );
  };

  const MockCheckboxGroup = ({ children, value = [], ...props }: any) => {
    return (
      <div
        data-testid="checkbox-group"
        data-value={JSON.stringify(value)}
        {...props}
      >
        {children}
      </div>
    );
  };

  MockCheckbox.Group = MockCheckboxGroup;

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
    ],
  },
  {
    key: '3',
    title: '叶子节点',
  },
];

describe('Tree Component', () => {
  it('renders basic tree correctly', () => {
    render(<Tree treeData={mockTreeData} />);

    expect(screen.getByText('父节点1')).toBeInTheDocument();
    expect(screen.getByText('父节点2')).toBeInTheDocument();
    expect(screen.getByText('叶子节点')).toBeInTheDocument();

    // 子节点默认不显示（未展开）
    expect(screen.queryByText('子节点1-1')).not.toBeInTheDocument();
    expect(screen.queryByText('子节点2-1')).not.toBeInTheDocument();
  });

  it('renders tree with default expanded keys', () => {
    render(<Tree treeData={mockTreeData} defaultExpandedKeys={['1', '2']} />);

    expect(screen.getByText('父节点1')).toBeInTheDocument();
    expect(screen.getByText('子节点1-1')).toBeInTheDocument();
    expect(screen.getByText('子节点1-2')).toBeInTheDocument();
    expect(screen.getByText('父节点2')).toBeInTheDocument();
    expect(screen.getByText('子节点2-1')).toBeInTheDocument();

    // 深层子节点仍然不显示（未展开）
    expect(screen.queryByText('子节点1-2-1')).not.toBeInTheDocument();
  });

  it('handles node expansion correctly', () => {
    render(<Tree treeData={mockTreeData} />);

    // 初始状态：子节点不可见
    expect(screen.queryByText('子节点1-1')).not.toBeInTheDocument();

    // 点击展开图标 - 查找包含展开图标的div
    const expandIcons = screen.getAllByTestId('expand-icon');
    fireEvent.click(expandIcons[0]); // 点击第一个展开按钮

    // 子节点应该可见
    expect(screen.getByText('子节点1-1')).toBeInTheDocument();
    expect(screen.getByText('子节点1-2')).toBeInTheDocument();
  });

  it('handles node selection correctly', () => {
    const onSelect = vi.fn();
    render(
      <Tree
        treeData={mockTreeData}
        onSelect={onSelect}
        defaultExpandedKeys={['1']}
      />,
    );

    // 点击节点
    fireEvent.click(screen.getByText('子节点1-1'));

    expect(onSelect).toHaveBeenCalledWith(
      '1-1',
      expect.objectContaining({
        node: expect.objectContaining({ key: '1-1' }),
      }),
    );
  });

  it('handles multiple selection correctly', () => {
    const onMultipleSelect = vi.fn();
    render(
      <Tree
        treeData={mockTreeData}
        multiple
        onMultipleSelect={onMultipleSelect}
        defaultExpandedKeys={['1', '2']}
      />,
    );

    // 选择第一个节点
    fireEvent.click(screen.getByText('子节点1-1'));
    expect(onMultipleSelect).toHaveBeenLastCalledWith(
      expect.arrayContaining(['1-1']), // 现在可能包含父节点，所以使用arrayContaining
      expect.objectContaining({
        selectedNodes: expect.arrayContaining([
          expect.objectContaining({ key: '1-1' }),
        ]),
      }),
    );
  });

  it('handles disabled nodes correctly', () => {
    const disabledTreeData = [
      {
        key: '1',
        title: '正常节点',
      },
      {
        key: '2',
        title: '禁用节点',
        disabled: true,
      },
    ];

    const onSelect = vi.fn();
    render(<Tree treeData={disabledTreeData} onSelect={onSelect} />);

    // 点击正常节点
    fireEvent.click(screen.getByText('正常节点'));
    expect(onSelect).toHaveBeenCalled();

    // 重置mock
    onSelect.mockClear();

    // 点击禁用节点
    fireEvent.click(screen.getByText('禁用节点'));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('handles controlled mode correctly', () => {
    const onSelect = vi.fn();
    const onExpand = vi.fn();

    const { rerender } = render(
      <Tree
        treeData={mockTreeData}
        selectedKey={'1-1'}
        expandedKeys={['1']}
        onSelect={onSelect}
        onExpand={onExpand}
      />,
    );

    // 验证初始状态
    expect(screen.getByText('子节点1-1')).toBeInTheDocument();

    // 点击展开另一个节点
    const expandIcons = screen.getAllByTestId('expand-icon');
    fireEvent.click(expandIcons[1]); // 点击第二个展开按钮

    expect(onExpand).toHaveBeenCalledWith(
      ['1', '2'],
      expect.objectContaining({ expanded: true }),
    );

    // 更新props
    rerender(
      <Tree
        treeData={mockTreeData}
        selectedKey={'1-1'}
        expandedKeys={['1', '2']}
        onSelect={onSelect}
        onExpand={onExpand}
      />,
    );

    // 验证新状态
    expect(screen.getByText('子节点2-1')).toBeInTheDocument();
  });

  it('handles custom icons correctly', () => {
    const CustomExpandIcon = () => <span data-testid="custom-expand">+</span>;
    const CustomCollapseIcon = () => (
      <span data-testid="custom-collapse">-</span>
    );

    render(
      <Tree
        treeData={mockTreeData}
        expandIcon={<CustomExpandIcon />}
        collapseIcon={<CustomCollapseIcon />}
        defaultExpandedKeys={['1']}
      />,
    );

    expect(screen.getByTestId('custom-collapse')).toBeInTheDocument();
  });

  it('handles showIcon prop correctly', () => {
    render(<Tree treeData={mockTreeData} showIcon={false} />);

    // 不应该有展开图标
    expect(screen.queryByTestId('expand-icon')).not.toBeInTheDocument();
    expect(screen.queryByTestId('collapse-icon')).not.toBeInTheDocument();
  });

  it('handles onExpand callback correctly', () => {
    const onExpand = vi.fn();
    render(<Tree treeData={mockTreeData} onExpand={onExpand} />);

    // 点击展开按钮
    const expandIcons = screen.getAllByTestId('expand-icon');
    fireEvent.click(expandIcons[0]);

    expect(onExpand).toHaveBeenCalledWith(
      ['1'],
      expect.objectContaining({
        expanded: true,
        node: expect.objectContaining({ key: '1' }),
      }),
    );
  });

  it('handles ref correctly', () => {
    const ref = createRef<TreeRef>();
    render(<Tree ref={ref} treeData={mockTreeData} />);

    expect(ref.current).toBeDefined();
  });

  it('handles empty tree data', () => {
    render(<Tree treeData={[]} />);

    const container = screen.getByTestId('tree-container');
    expect(container).toBeInTheDocument();
    expect(container.children).toHaveLength(0);
  });

  it('handles deep nesting correctly', () => {
    render(<Tree treeData={mockTreeData} defaultExpandedKeys={['1', '1-2']} />);

    expect(screen.getByText('子节点1-2-1')).toBeInTheDocument();
  });

  it('handles node selection in single mode correctly', () => {
    const onSelect = vi.fn();
    render(
      <Tree
        treeData={mockTreeData}
        onSelect={onSelect}
        defaultSelectedKey={'1'}
      />,
    );

    // 点击已选中的节点，RadioGroup会重新选择该节点
    fireEvent.click(screen.getByText('父节点1'));

    expect(onSelect).toHaveBeenCalledWith(
      '1',
      expect.objectContaining({
        node: expect.objectContaining({ key: '1' }),
      }),
    );
  });

  it('passes through List props correctly', () => {
    render(
      <Tree
        treeData={mockTreeData}
        virtualScroll={true}
        className="custom-tree-class"
      />,
    );

    const container = screen.getByTestId('tree-container');
    expect(container).toHaveClass('custom-tree-class');
  });

  it('handles non-selectable tree correctly', () => {
    render(
      <Tree
        treeData={mockTreeData}
        selectable={false}
        defaultExpandedKeys={['1']}
      />,
    );

    // 不应该有RadioGroup或CheckboxGroup
    expect(screen.queryByTestId('radio-group')).not.toBeInTheDocument();
    expect(screen.queryByTestId('checkbox-group')).not.toBeInTheDocument();

    // 应该直接显示文本
    expect(screen.getByText('子节点1-1')).toBeInTheDocument();
  });

  it('renders RadioGroup for single selection', () => {
    render(
      <Tree
        treeData={mockTreeData}
        selectable={true}
        multiple={false}
        defaultExpandedKeys={['1']}
      />,
    );

    expect(screen.getByTestId('radio-group')).toBeInTheDocument();
  });

  it('renders CheckboxGroup for multiple selection', () => {
    render(
      <Tree
        treeData={mockTreeData}
        selectable={true}
        multiple={true}
        defaultExpandedKeys={['1']}
      />,
    );

    // 多选模式下使用CheckboxGroup包装，但使用自定义联动逻辑
    expect(screen.getByTestId('checkbox-group')).toBeInTheDocument();
    expect(screen.getAllByTestId('checkbox-option')).toHaveLength(5); // 父节点1, 子节点1-1, 子节点1-2, 父节点2, 叶子节点
  });

  it('handles parent-child cascade selection correctly', () => {
    const onMultipleSelect = vi.fn();
    render(
      <Tree
        treeData={mockTreeData}
        multiple
        onMultipleSelect={onMultipleSelect}
        defaultExpandedKeys={['1']}
      />,
    );

    // 选择父节点，应该同时选中所有子节点
    fireEvent.click(screen.getByText('父节点1'));

    expect(onMultipleSelect).toHaveBeenCalledWith(
      expect.arrayContaining(['1', '1-1', '1-2']),
      expect.objectContaining({
        selectedNodes: expect.any(Array),
        checkedKeys: expect.any(Array),
        halfCheckedKeys: expect.any(Array),
      }),
    );
  });

  it('handles indeterminate state correctly', () => {
    render(
      <Tree
        treeData={mockTreeData}
        multiple
        defaultExpandedKeys={['1']}
        defaultSelectedKeys={['1-1']} // 只选中一个子节点
      />,
    );

    // 父节点应该显示半选状态
    const parentCheckbox = screen
      .getByText('父节点1')
      .closest('[data-testid="checkbox-option"]');
    expect(parentCheckbox).toHaveAttribute('data-indeterminate', 'true');
    expect(parentCheckbox).toHaveAttribute('data-checked', 'false'); // 半选状态优先级高于checked
  });

  it('handles checkStrictly mode correctly', () => {
    const onMultipleSelect = vi.fn();
    render(
      <Tree
        treeData={mockTreeData}
        multiple
        checkStrictly={true}
        onMultipleSelect={onMultipleSelect}
        defaultExpandedKeys={['1']}
      />,
    );

    // 在严格模式下，选择父节点不应该影响子节点
    fireEvent.click(screen.getByText('父节点1'));

    expect(onMultipleSelect).toHaveBeenCalledWith(
      ['1'], // 只选中父节点
      expect.objectContaining({
        selectedNodes: expect.any(Array),
        checkedKeys: expect.any(Array),
        halfCheckedKeys: expect.any(Array),
      }),
    );
  });

  it('handles indeterminate state when tree is collapsed', () => {
    render(
      <Tree
        treeData={mockTreeData}
        multiple
        defaultExpandedKeys={[]} // 所有节点都收起
        defaultSelectedKeys={['1-1']} // 选中一个子节点
      />,
    );

    // 即使树收起，父节点仍应该显示半选状态
    const parentCheckbox = screen
      .getByText('父节点1')
      .closest('[data-testid="checkbox-option"]');
    expect(parentCheckbox).toHaveAttribute('data-indeterminate', 'true');
    expect(parentCheckbox).toHaveAttribute('data-checked', 'false');
  });

  it('handles onlyLeafSelectable correctly', () => {
    render(
      <Tree
        treeData={mockTreeData}
        multiple
        onlyLeafSelectable={true}
        defaultExpandedKeys={['1']}
      />,
    );

    // 父节点不应该有checkbox（因为onlyLeafSelectable=true）
    const parentText = screen.getByText('父节点1');
    const parentCheckbox = parentText.closest('[data-testid="checkbox-option"]');
    expect(parentCheckbox).toBeNull();

    // 叶子节点应该有checkbox且可以选择
    const leafCheckbox = screen
      .getByText('叶子节点')
      .closest('[data-testid="checkbox-option"]');
    expect(leafCheckbox).not.toBeNull();
    expect(leafCheckbox).not.toHaveAttribute('data-disabled', 'true');
  });

  // TODO: 修复maxSelectCount测试
  // it('handles maxSelectCount correctly', () => {
  //   const onMaxSelectReached = vi.fn();
  //   const onMultipleSelect = vi.fn();

  //   // 创建简单的测试数据，避免父子联动的复杂性
  //   const simpleTreeData = [
  //     { key: 'a', title: '节点A' },
  //     { key: 'b', title: '节点B' },
  //     { key: 'c', title: '节点C' },
  //   ];

  //   render(
  //     <Tree
  //       treeData={simpleTreeData}
  //       multiple
  //       maxSelectCount={2}
  //       onMaxSelectReached={onMaxSelectReached}
  //       onMultipleSelect={onMultipleSelect}
  //       defaultSelectedKeys={['a', 'b']} // 已经选择了2个节点
  //     />,
  //   );

  //   // 尝试选择第三个节点应该触发回调
  //   fireEvent.click(screen.getByText('节点C'));
  //   expect(onMaxSelectReached).toHaveBeenCalledWith(2);
  // });

  it('shows children as selected when parent is selected', () => {
    render(
      <Tree
        treeData={mockTreeData}
        multiple
        defaultExpandedKeys={['1']}
        defaultSelectedKeys={['1']} // 只选中父节点
      />,
    );

    // 子节点应该显示为选中状态（即使不在selectedKeys中）
    const childCheckbox = screen
      .getByText('子节点1-1')
      .closest('[data-testid="checkbox-option"]');
    expect(childCheckbox).toHaveAttribute('data-checked', 'true');
  });

  it('shows indeterminate state when some children are disabled', () => {
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
      <Tree
        treeData={treeDataWithDisabled}
        multiple
        defaultExpandedKeys={['1']}
        defaultSelectedKeys={['1-1']} // 只选中正常的子节点
      />,
    );

    // 父节点应该显示半选状态，因为存在禁用的子节点
    const parentCheckbox = screen
      .getByText('父节点1')
      .closest('[data-testid="checkbox-option"]');
    expect(parentCheckbox).toHaveAttribute('data-indeterminate', 'true');
    expect(parentCheckbox).toHaveAttribute('data-checked', 'false');
  });

  it('provides leaf and non-leaf keys in onMultipleSelect callback', () => {
    const onMultipleSelect = vi.fn();
    render(
      <Tree
        treeData={mockTreeData}
        multiple
        onMultipleSelect={onMultipleSelect}
        defaultExpandedKeys={['1']}
      />,
    );

    // 选择父节点
    fireEvent.click(screen.getByText('父节点1'));

    expect(onMultipleSelect).toHaveBeenCalledWith(
      expect.arrayContaining(['1', '1-1', '1-2']),
      expect.objectContaining({
        selectedNodes: expect.any(Array),
        checkedKeys: expect.any(Array),
        halfCheckedKeys: expect.any(Array),
        leafKeys: expect.arrayContaining(['1-1']), // 叶子节点（1-2不是叶子节点，它有子节点1-2-1）
        nonLeafKeys: expect.arrayContaining(['1', '1-2']), // 非叶子节点
      }),
    );
  });

  it('does not select disabled children when parent is selected', () => {
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
      <Tree
        treeData={treeDataWithDisabled}
        multiple
        defaultExpandedKeys={['1']}
      />,
    );

    // 选择父节点
    fireEvent.click(screen.getByText('父节点1'));

    // 禁用的子节点不应该显示为选中状态
    const disabledChildCheckbox = screen
      .getByText('禁用子节点1-2')
      .closest('[data-testid="checkbox-option"]');
    expect(disabledChildCheckbox).toHaveAttribute('data-checked', 'false');

    // 正常的子节点应该显示为选中状态
    const normalChildCheckbox = screen
      .getByText('正常子节点1-1')
      .closest('[data-testid="checkbox-option"]');
    expect(normalChildCheckbox).toHaveAttribute('data-checked', 'true');
  });

  it('handles indeterminate state click correctly when disabled children exist', () => {
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

    const onMultipleSelect = vi.fn();
    render(
      <Tree
        treeData={treeDataWithDisabled}
        multiple
        onMultipleSelect={onMultipleSelect}
        defaultExpandedKeys={['1']}
        defaultSelectedKeys={['1-1']} // 只选中正常的子节点，父节点应该是半选状态
      />,
    );

    // 父节点应该显示半选状态
    const parentCheckbox = screen
      .getByText('父节点1')
      .closest('[data-testid="checkbox-option"]');
    expect(parentCheckbox).toHaveAttribute('data-indeterminate', 'true');

    // 点击半选状态的父节点，应该取消所有可选子节点的选中状态
    fireEvent.click(screen.getByText('父节点1'));

    // 验证回调被调用，且不包含任何选中的节点
    expect(onMultipleSelect).toHaveBeenCalledWith(
      [],
      expect.objectContaining({
        selectedNodes: [],
        checkedKeys: [],
        halfCheckedKeys: [],
        leafKeys: [],
        nonLeafKeys: [],
      }),
    );
  });

  it('returns consistent data in onMultipleSelect callback', () => {
    const onMultipleSelect = vi.fn();
    render(
      <Tree
        treeData={mockTreeData}
        multiple
        onMultipleSelect={onMultipleSelect}
        defaultExpandedKeys={['1']}
      />,
    );

    // 点击父节点触发回调
    fireEvent.click(screen.getByText('父节点1'));

    // 验证回调数据的一致性
    expect(onMultipleSelect).toHaveBeenCalledWith(
      expect.any(Array),
      expect.objectContaining({
        selectedNodes: expect.any(Array),
        checkedKeys: expect.any(Array),
        halfCheckedKeys: expect.any(Array),
        leafKeys: expect.any(Array),
        nonLeafKeys: expect.any(Array),
      }),
    );

    const [selectedKeys, info] = onMultipleSelect.mock.calls[0];

    // selectedKeys应该等于checkedKeys + halfCheckedKeys
    const combinedKeys = [...info.checkedKeys, ...info.halfCheckedKeys];
    expect(selectedKeys.sort()).toEqual(combinedKeys.sort());

    // selectedKeys应该等于leafKeys + nonLeafKeys
    const combinedLeafKeys = [...info.leafKeys, ...info.nonLeafKeys];
    expect(selectedKeys.sort()).toEqual(combinedLeafKeys.sort());
  });

  it('handles selectable: false nodes correctly', () => {
    const treeDataWithNonSelectable = [
      {
        key: '1',
        title: '父节点1',
        children: [
          { key: '1-1', title: '正常子节点1-1' },
          { key: '1-2', title: '不可选择子节点1-2', selectable: false },
        ],
      },
    ];

    render(
      <Tree
        treeData={treeDataWithNonSelectable}
        multiple
        defaultExpandedKeys={['1']}
      />,
    );

    // 不可选择的节点不应该有checkbox
    const nonSelectableNode = screen.getByText('不可选择子节点1-2');
    const nonSelectableCheckbox = nonSelectableNode.closest('[data-testid="checkbox-option"]');
    expect(nonSelectableCheckbox).toBeNull();

    // 正常的子节点应该有checkbox
    const normalNode = screen.getByText('正常子节点1-1');
    const normalCheckbox = normalNode.closest('[data-testid="checkbox-option"]');
    expect(normalCheckbox).not.toBeNull();
  });

  it('excludes selectable: false nodes from callback data', () => {
    const treeDataWithNonSelectable = [
      {
        key: '1',
        title: '父节点1',
        children: [
          { key: '1-1', title: '正常子节点1-1' },
          { key: '1-2', title: '不可选择子节点1-2', selectable: false },
        ],
      },
    ];

    const onMultipleSelect = vi.fn();
    render(
      <Tree
        treeData={treeDataWithNonSelectable}
        multiple
        onMultipleSelect={onMultipleSelect}
        defaultExpandedKeys={['1']}
      />,
    );

    // 选择父节点
    fireEvent.click(screen.getByText('父节点1'));

    // 验证回调数据不包含不可选择的节点
    expect(onMultipleSelect).toHaveBeenCalledWith(
      expect.not.arrayContaining(['1-2']), // 不应该包含不可选择的节点
      expect.objectContaining({
        selectedNodes: expect.any(Array),
        checkedKeys: expect.not.arrayContaining(['1-2']),
        halfCheckedKeys: expect.any(Array),
        leafKeys: expect.not.arrayContaining(['1-2']),
        nonLeafKeys: expect.any(Array),
      }),
    );

    // 验证回调数据包含可选择的节点
    const [selectedKeys, info] = onMultipleSelect.mock.calls[0];

    // 验证selectedKeys包含可选择的节点，不包含不可选择的节点
    expect(selectedKeys).toEqual(expect.arrayContaining(['1', '1-1']));
    expect(selectedKeys).not.toContain('1-2'); // 不应该包含不可选择的节点

    // 验证info对象的各个字段也不包含不可选择的节点
    expect(info.checkedKeys).not.toContain('1-2');
    expect(info.leafKeys).not.toContain('1-2');
    expect(info.selectedNodes.map((n: any) => n.key)).not.toContain('1-2');
  });
});
