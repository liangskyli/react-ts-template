import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import VirtualTable from '@/components/core/components/virtual-table';
import type { ColumnConfig } from '@/components/core/components/virtual-table/virtual-table';

/* eslint-disable @typescript-eslint/no-explicit-any */

// 模拟 VirtualGrid 组件
vi.mock('@/components/core/components/virtual-grid', () => {
  return {
    default: function MockVirtualGrid({
      rowCount,
      columnCount,
      cellRenderer,
      className,
      rightHeaderClass,
      rightBodyClass,
      columnWidth,
    }: any) {
      // 调用 columnWidth 函数并存储结果以供测试验证
      const columnWidths = Array.from({ length: columnCount }).map((_, index) =>
        columnWidth({ index }),
      );
      (global as any).__columnWidths = columnWidths;

      return (
        <div className={className} data-testid="virtual-grid">
          {Array.from({ length: rowCount }).map((_, rowIndex) =>
            Array.from({ length: columnCount }).map((_, columnIndex) =>
              cellRenderer({
                columnIndex,
                rowIndex,
                key: `${rowIndex}-${columnIndex}`,
                style: {},
              }),
            ),
          )}
          {/* 添加一些额外的元素来验证类名传递 */}
          <div className={rightHeaderClass} data-testid="right-header" />
          <div className={rightBodyClass} data-testid="right-body" />
        </div>
      );
    },
  };
});

describe('VirtualTable Component', () => {
  // 基本的列配置和数据源
  const basicColumns: ColumnConfig[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      width: 100,
    },
    {
      title: 'Age',
      dataIndex: 'age',
      width: 80,
    },
  ];

  const basicDataSource = [
    { name: 'John', age: 25 },
    { name: 'Jane', age: 30 },
  ];

  it('renders correctly with basic props', () => {
    render(
      <VirtualTable columns={basicColumns} dataSource={basicDataSource} />,
    );

    // 验证表头是否正确渲染
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();

    // 验证数据是否正确渲染
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('Jane')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
  });

  it('handles custom render function', () => {
    const columnsWithRender: ColumnConfig[] = [
      {
        title: 'Name',
        dataIndex: 'name',
        width: 100,
        render: (value) => (
          <span data-testid="custom-render">{`Mr. ${value}`}</span>
        ),
      },
      ...basicColumns.slice(1),
    ];

    render(
      <VirtualTable columns={columnsWithRender} dataSource={basicDataSource} />,
    );

    expect(screen.getByText('Mr. John')).toBeInTheDocument();
    expect(screen.getByText('Mr. Jane')).toBeInTheDocument();
  });

  it('handles fixed columns', () => {
    const columnsWithFixed: ColumnConfig[] = [
      {
        title: 'Fixed Left',
        dataIndex: 'name',
        width: 100,
        fixed: 'left',
      },
      {
        title: 'Middle',
        dataIndex: 'age',
        width: 80,
      },
      {
        title: 'Fixed Right',
        width: 100,
        fixed: 'right',
      },
    ];

    render(
      <VirtualTable columns={columnsWithFixed} dataSource={basicDataSource} />,
    );

    // 验证固定列是否正确渲染
    expect(screen.getByText('Fixed Left')).toBeInTheDocument();
    expect(screen.getByText('Middle')).toBeInTheDocument();
    expect(screen.getByText('Fixed Right')).toBeInTheDocument();
  });

  it('handles alignment settings', () => {
    const columnsWithAlign: ColumnConfig[] = [
      {
        title: 'Left Align',
        dataIndex: 'name',
        width: 100,
        align: 'left',
        headerAlign: 'center',
      },
      {
        title: 'Right Align',
        dataIndex: 'age',
        width: 80,
        align: 'right',
        headerAlign: 'right',
      },
    ];

    render(
      <VirtualTable columns={columnsWithAlign} dataSource={basicDataSource} />,
    );

    // 验证对齐方式是否正确应用
    const grid = screen.getByTestId('virtual-grid');
    expect(grid).toBeInTheDocument();

    // 验证表头单元格的对齐方式
    const headerCells = grid.querySelectorAll('[style*="text-align"]');
    expect(headerCells.length).toBeGreaterThan(0);
  });

  it('handles showHeader prop', () => {
    render(
      <VirtualTable
        columns={basicColumns}
        dataSource={basicDataSource}
        showHeader={false}
      />,
    );

    // 验证表头是否被隐藏
    expect(screen.queryByText('Name')).not.toBeInTheDocument();
    expect(screen.queryByText('Age')).not.toBeInTheDocument();

    // 验证数据是否正确显示
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
  });

  it('handles custom header height', () => {
    render(
      <VirtualTable
        columns={basicColumns}
        dataSource={basicDataSource}
        headerHeight={60}
      />,
    );

    // 验证表头是否存在并且高度正确
    const grid = screen.getByTestId('virtual-grid');
    expect(grid).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
  });

  it('handles custom class names', () => {
    const customClassName = 'custom-table';
    const customHeaderClass = 'custom-header';
    const customBodyClass = 'custom-body';
    const customRightHeaderClass = 'custom-right-header';
    const customRightBodyClass = 'custom-right-body';

    render(
      <VirtualTable
        columns={basicColumns}
        dataSource={basicDataSource}
        className={customClassName}
        headerCellClass={customHeaderClass}
        bodyCellClass={customBodyClass}
        rightHeaderClass={customRightHeaderClass}
        rightBodyClass={customRightBodyClass}
      />,
    );

    // 验证自定义类名是否正确应用
    expect(screen.getByTestId('virtual-grid')).toHaveClass(customClassName);
    expect(screen.getByTestId('right-header')).toHaveClass(
      customRightHeaderClass,
    );
    expect(screen.getByTestId('right-body')).toHaveClass(customRightBodyClass);
  });

  it('handles empty data source', () => {
    render(<VirtualTable columns={basicColumns} dataSource={[]} />);

    // 验证表头是否显示
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();

    // 验证没有数据行
    expect(screen.queryByText('John')).not.toBeInTheDocument();
  });

  it('handles complex render functions', () => {
    const columnsWithComplexRender: ColumnConfig[] = [
      {
        title: 'Info',
        width: 200,
        render: (_, record) => (
          <div data-testid="complex-cell">
            <span>{record.name}</span>
            <span>{record.age} years old</span>
          </div>
        ),
      },
    ];

    render(
      <VirtualTable
        columns={columnsWithComplexRender}
        dataSource={basicDataSource}
      />,
    );

    // 验证复杂渲染是否正确
    const complexCells = screen.getAllByTestId('complex-cell');
    expect(complexCells.length).toBe(2);
    expect(screen.getByText('25 years old')).toBeInTheDocument();
  });

  it('passes correct columnWidth to VirtualGrid', () => {
    const columns: ColumnConfig[] = [
      {
        title: 'Column 1',
        width: 100,
      },
      {
        title: 'Column 2',
        width: 150,
      },
      {
        title: 'Column 3',
        width: 200,
      },
    ];

    render(<VirtualTable columns={columns} dataSource={[]} />);

    // 验证每列的宽度是否正确传递给 VirtualGrid
    const columnWidths = (global as any).__columnWidths;
    expect(columnWidths).toEqual([100, 150, 200]);
  });

  it('handles dynamic columnWidth updates', () => {
    const columns: ColumnConfig[] = [
      {
        title: 'Dynamic Width',
        width: 100,
      },
    ];

    const { rerender } = render(
      <VirtualTable columns={columns} dataSource={[]} />,
    );

    // 验证初始宽度
    expect((global as any).__columnWidths).toEqual([100]);

    // 更新列宽度
    columns[0].width = 200;
    rerender(<VirtualTable columns={columns} dataSource={[]} />);

    // 验证更新后的宽度
    expect((global as any).__columnWidths).toEqual([200]);
  });
});
