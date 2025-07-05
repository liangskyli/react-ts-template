import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { TreeRef } from '@/components/core/components/tree';
import Tree from '@/components/core/components/tree/tree';

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

describe('Tree Base Component', () => {
  it('renders basic tree correctly', () => {
    render(<Tree treeData={mockTreeData} />);

    expect(screen.getByText('父节点1')).toBeInTheDocument();
    expect(screen.getByText('父节点2')).toBeInTheDocument();
    expect(screen.getByText('叶子节点')).toBeInTheDocument();

    // 子节点默认不显示（未展开）
    expect(screen.queryByText('子节点1-1')).not.toBeInTheDocument();
    expect(screen.queryByText('子节点2-1')).not.toBeInTheDocument();
  });

  it('expands nodes correctly', () => {
    render(<Tree treeData={mockTreeData} />);

    // 点击展开图标
    const expandIcon = screen.getAllByTestId('expand-icon')[0];
    fireEvent.click(expandIcon);

    // 子节点应该显示
    expect(screen.getByText('子节点1-1')).toBeInTheDocument();
    expect(screen.getByText('子节点1-2')).toBeInTheDocument();
  });

  it('collapses nodes correctly', () => {
    render(<Tree treeData={mockTreeData} defaultExpandedKeys={['1']} />);

    // 子节点应该显示
    expect(screen.getByText('子节点1-1')).toBeInTheDocument();

    // 点击收起图标
    const collapseIcon = screen.getByTestId('collapse-icon');
    fireEvent.click(collapseIcon);

    // 子节点应该隐藏
    expect(screen.queryByText('子节点1-1')).not.toBeInTheDocument();
  });

  it('handles defaultExpandedKeys correctly', () => {
    render(<Tree treeData={mockTreeData} defaultExpandedKeys={['1', '2']} />);

    expect(screen.getByText('子节点1-1')).toBeInTheDocument();
    expect(screen.getByText('子节点2-1')).toBeInTheDocument();
  });

  it('handles controlled expandedKeys correctly', () => {
    const { rerender } = render(
      <Tree treeData={mockTreeData} expandedKeys={['1']} />,
    );

    expect(screen.getByText('子节点1-1')).toBeInTheDocument();
    expect(screen.queryByText('子节点2-1')).not.toBeInTheDocument();

    // 更新expandedKeys
    rerender(<Tree treeData={mockTreeData} expandedKeys={['2']} />);

    expect(screen.queryByText('子节点1-1')).not.toBeInTheDocument();
    expect(screen.getByText('子节点2-1')).toBeInTheDocument();
  });

  it('calls onExpand callback correctly', () => {
    const onExpand = vi.fn();
    render(<Tree treeData={mockTreeData} onExpand={onExpand} />);

    const expandIcon = screen.getAllByTestId('expand-icon')[0];
    fireEvent.click(expandIcon);

    expect(onExpand).toHaveBeenCalledWith(
      ['1'],
      expect.objectContaining({
        expanded: true,
        node: expect.objectContaining({ key: '1' }),
      }),
    );
  });

  it('leaf node, no calls onExpand callback correctly', () => {
    const onExpand = vi.fn();
    render(
      <Tree
        treeData={mockTreeData}
        defaultExpandedKeys={['1']}
        onExpand={onExpand}
      />,
    );

    const expandIcon = screen.getAllByTestId('leaf-icon')[0];
    fireEvent.click(expandIcon);

    expect(onExpand).not.toHaveBeenCalled();
  });

  it('handles disabled nodes correctly', () => {
    const treeDataWithDisabled = [
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

    render(<Tree treeData={treeDataWithDisabled} />);

    const normalNode = screen.getByText('正常节点').closest('[data-disabled]');
    const disabledNode = screen
      .getByText('禁用节点')
      .closest('[data-disabled]');

    expect(normalNode).toBeNull();
    expect(disabledNode).toHaveAttribute('data-disabled', 'true');
  });

  it('handles custom icons correctly', () => {
    const customExpandIcon = <span data-testid="custom-expand">+</span>;
    const customCollapseIcon = <span data-testid="custom-collapse">-</span>;

    render(
      <Tree
        treeData={mockTreeData}
        expandIcon={customExpandIcon}
        collapseIcon={customCollapseIcon}
        defaultExpandedKeys={['1']}
      />,
    );

    expect(screen.getByTestId('custom-collapse')).toBeInTheDocument();

    // 点击收起
    fireEvent.click(screen.getByTestId('collapse-icon'));
    expect(screen.queryByTestId('custom-collapse')).not.toBeInTheDocument();
    expect(screen.queryAllByTestId('custom-expand').length).toBe(2);
  });

  it('handles showIcon=false correctly', () => {
    render(<Tree treeData={mockTreeData} showIcon={false} />);

    // 不应该有展开/收起图标
    expect(screen.queryByTestId('expand-icon')).not.toBeInTheDocument();
    expect(screen.queryByTestId('collapse-icon')).not.toBeInTheDocument();

    // 所有节点应该默认展开
    expect(screen.getByText('子节点1-1')).toBeInTheDocument();
    expect(screen.getByText('子节点2-1')).toBeInTheDocument();
  });

  it('handles custom indentWidth correctly', () => {
    render(
      <Tree
        treeData={mockTreeData}
        defaultExpandedKeys={['1']}
        indentWidth={48}
      />,
    );

    const indentElement =
      screen.getByText('子节点1-1').parentElement!.firstChild;
    expect(indentElement).toHaveStyle({ width: '48px' });
  });

  it('handles custom renderNode correctly', () => {
    const renderNode = vi.fn((node) => (
      <span data-testid="custom-node">{node.title} (custom)</span>
    ));

    render(<Tree treeData={mockTreeData} renderNode={renderNode} />);

    expect(screen.getByText('父节点1 (custom)')).toBeInTheDocument();
    expect(renderNode).toHaveBeenCalled();
  });

  it('exposes ref methods correctly', () => {
    const ref = createRef<TreeRef>();
    render(<Tree ref={ref} treeData={mockTreeData} />);

    expect(ref.current).toBeDefined();
    expect(ref.current?.getFlattenNodes).toBeDefined();
    expect(ref.current?.getAllFlattenNodeMap).toBeDefined();
    expect(ref.current?.getNodeMap).toBeDefined();

    const flattenNodes = ref.current!.getFlattenNodes();
    expect(flattenNodes).toHaveLength(3); // 3个根节点 + 2个子节点（未展开时不包含孙节点）
    const allFlattenNodeMap = ref.current!.getAllFlattenNodeMap();
    expect(allFlattenNodeMap.size).toBe(7);
    const nodeMap = ref.current!.getNodeMap();
    expect(nodeMap.nodeMap).toBeDefined();
  });

  it('handles deep nesting correctly', () => {
    render(<Tree treeData={mockTreeData} defaultExpandedKeys={['1', '1-2']} />);

    expect(screen.getByText('子节点1-2-1')).toBeInTheDocument();
  });

  it('handles virtualScroll prop correctly', () => {
    render(<Tree treeData={mockTreeData} virtualScroll={true} />);

    const container = screen.getByTestId('tree-container');
    expect(container).toBeInTheDocument();
  });

  it('applies custom className correctly', () => {
    render(
      <Tree
        treeData={mockTreeData}
        className="custom-tree-class"
        nodeClassName="custom-node-class"
        indentClassName="custom-indent-class"
        switcherClassName="custom-switcher-class"
        nodeTitleContentClassName="custom-content-class"
      />,
    );

    const container = screen.getByTestId('tree-container');
    expect(container).toHaveClass('custom-tree-class');
  });

  it('handles empty treeData correctly', () => {
    render(<Tree treeData={[]} />);

    const container = screen.getByTestId('tree-container');
    expect(container).toBeInTheDocument();
    expect(container).toBeEmptyDOMElement();
  });

  it('handles nodes without children correctly', () => {
    const leafOnlyData = [{ key: '1', title: '叶子节点' }];
    render(<Tree treeData={leafOnlyData} />);

    expect(screen.getByText('叶子节点')).toBeInTheDocument();
    expect(screen.queryByTestId('expand-icon')).not.toBeInTheDocument();
    expect(screen.getByTestId('leaf-icon')).toBeInTheDocument();
  });
});
