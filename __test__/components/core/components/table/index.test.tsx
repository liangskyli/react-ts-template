import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Table from '@/components/core/components/table';

// 模拟 react-virtualized
vi.mock('react-virtualized', () => {
  return {
    AutoSizer: ({ children }: any) => children({ width: 800, height: 400 }),
    Grid: function MockGrid({
      cellRenderer,
      columnCount,
      rowCount,
    }: any) {
      return (
        <div data-testid="grid">
          {Array.from({ length: rowCount }).map((_, rowIndex) =>
            Array.from({ length: columnCount }).map((_, columnIndex) => {
              const cell = cellRenderer({
                columnIndex,
                rowIndex,
                key: `${rowIndex}-${columnIndex}`,
                style: {},
              });
              return (
                <div key={`${rowIndex}-${columnIndex}`} data-testid={`cell-${rowIndex}-${columnIndex}`}>
                  {cell}
                </div>
              );
            })
          )}
        </div>
      );
    },
    MultiGrid: function MockMultiGrid({
      cellRenderer,
      columnCount,
      rowCount,
    }: any) {
      return (
        <div data-testid="multi-grid">
          {Array.from({ length: rowCount }).map((_, rowIndex) =>
            Array.from({ length: columnCount }).map((_, columnIndex) => {
              const cell = cellRenderer({
                columnIndex,
                rowIndex,
                key: `${rowIndex}-${columnIndex}`,
                style: {},
              });
              return (
                <div key={`${rowIndex}-${columnIndex}`} data-testid={`cell-${rowIndex}-${columnIndex}`}>
                  {cell}
                </div>
              );
            })
          )}
        </div>
      );
    },
  };
});

describe('Table', () => {
  const mockColumns = [
    {
      key: 'name',
      title: '姓名',
      dataIndex: 'name',
      width: 120,
    },
    {
      key: 'age',
      title: '年龄',
      dataIndex: 'age',
      width: 80,
    },
    {
      key: 'address',
      title: '地址',
      dataIndex: 'address',
      width: 200,
    },
  ];

  const mockDataSource = [
    {
      key: '1',
      name: '张三',
      age: 32,
      address: '北京市朝阳区',
    },
    {
      key: '2',
      name: '李四',
      age: 28,
      address: '上海市浦东新区',
    },
  ];

  it('should render table with basic props', () => {
    render(<Table columns={mockColumns} dataSource={mockDataSource} />);

    // 应该渲染多个 Grid 组件（表头+数据体）
    const grids = screen.getAllByTestId('grid');
    expect(grids.length).toBeGreaterThanOrEqual(2); // 至少有表头和数据体两个Grid
  });

  it('should render table headers', () => {
    render(<Table columns={mockColumns} dataSource={mockDataSource} />);
    
    // 检查表头是否渲染
    expect(screen.getByText('姓名')).toBeInTheDocument();
    expect(screen.getByText('年龄')).toBeInTheDocument();
    expect(screen.getByText('地址')).toBeInTheDocument();
  });

  it('should render table data', () => {
    render(<Table columns={mockColumns} dataSource={mockDataSource} />);
    
    // 检查数据是否渲染
    expect(screen.getByText('张三')).toBeInTheDocument();
    expect(screen.getByText('李四')).toBeInTheDocument();
    expect(screen.getByText('32')).toBeInTheDocument();
    expect(screen.getByText('28')).toBeInTheDocument();
  });

  it('should render custom content with render function', () => {
    const columnsWithRender = [
      ...mockColumns,
      {
        key: 'action',
        title: '操作',
        width: 100,
        render: () => <button>编辑</button>,
      },
    ];

    render(<Table columns={columnsWithRender} dataSource={mockDataSource} />);
    
    // 检查自定义渲染内容
    expect(screen.getAllByText('编辑')).toHaveLength(2); // 两行数据，每行一个编辑按钮
  });

  it('should handle fixed columns', () => {
    const columnsWithFixed = [
      {
        ...mockColumns[0],
        fixed: 'left' as const,
      },
      ...mockColumns.slice(1),
      {
        key: 'action',
        title: '操作',
        width: 100,
        fixed: 'right' as const,
        render: () => <span>操作</span>,
      },
    ];

    render(<Table columns={columnsWithFixed} dataSource={mockDataSource} />);

    // 应该渲染多个 Grid 组件（表头+数据体，左固定+中间+右固定）
    const grids = screen.getAllByTestId('grid');
    expect(grids.length).toBeGreaterThanOrEqual(6); // 3个表头Grid + 3个数据Grid
  });

  it('should handle empty data source', () => {
    render(<Table columns={mockColumns} dataSource={[]} />);

    // 应该至少渲染表头Grid
    const grids = screen.getAllByTestId('grid');
    expect(grids.length).toBeGreaterThanOrEqual(1);
    // 只有表头，没有数据行
    expect(screen.getByText('姓名')).toBeInTheDocument();
  });

  it('should handle custom className', () => {
    const { container } = render(
      <Table 
        columns={mockColumns} 
        dataSource={mockDataSource} 
        className="custom-table"
      />
    );
    
    expect(container.querySelector('.custom-table')).toBeInTheDocument();
  });
});
