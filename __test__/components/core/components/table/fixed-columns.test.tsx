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
  };
});

describe('Table Fixed Columns', () => {
  const mockDataSource = [
    {
      key: '1',
      name: '张三',
      age: 32,
      email: 'zhangsan@example.com',
      address: '北京市朝阳区',
    },
    {
      key: '2',
      name: '李四',
      age: 28,
      email: 'lisi@example.com',
      address: '上海市浦东新区',
    },
  ];

  it('should render left fixed columns', () => {
    const columns = [
      {
        key: 'name',
        title: '姓名',
        dataIndex: 'name',
        width: 120,
        fixed: 'left' as const,
      },
      {
        key: 'age',
        title: '年龄',
        dataIndex: 'age',
        width: 80,
      },
      {
        key: 'email',
        title: '邮箱',
        dataIndex: 'email',
        width: 200,
      },
    ];

    render(<Table columns={columns} dataSource={mockDataSource} />);
    
    // 应该渲染两个 Grid：左固定列 + 中间列
    expect(screen.getAllByTestId('grid')).toHaveLength(2);
    expect(screen.getByText('姓名')).toBeInTheDocument();
    expect(screen.getByText('张三')).toBeInTheDocument();
  });

  it('should render right fixed columns', () => {
    const columns = [
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
        key: 'action',
        title: '操作',
        width: 100,
        fixed: 'right' as const,
        render: () => <span>操作</span>,
      },
    ];

    render(<Table columns={columns} dataSource={mockDataSource} />);
    
    // 应该渲染两个 Grid：中间列 + 右固定列
    expect(screen.getAllByTestId('grid')).toHaveLength(2);
    expect(screen.getByText('操作')).toBeInTheDocument();
  });

  it('should render left and right fixed columns', () => {
    const columns = [
      {
        key: 'name',
        title: '姓名',
        dataIndex: 'name',
        width: 120,
        fixed: 'left' as const,
      },
      {
        key: 'age',
        title: '年龄',
        dataIndex: 'age',
        width: 80,
      },
      {
        key: 'email',
        title: '邮箱',
        dataIndex: 'email',
        width: 200,
      },
      {
        key: 'action',
        title: '操作',
        width: 100,
        fixed: 'right' as const,
        render: () => <span>操作</span>,
      },
    ];

    render(<Table columns={columns} dataSource={mockDataSource} />);
    
    // 应该渲染三个 Grid：左固定列 + 中间列 + 右固定列
    expect(screen.getAllByTestId('grid')).toHaveLength(3);
    expect(screen.getByText('姓名')).toBeInTheDocument();
    expect(screen.getByText('操作')).toBeInTheDocument();
  });

  it('should render only center columns when no fixed columns', () => {
    const columns = [
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
    ];

    render(<Table columns={columns} dataSource={mockDataSource} />);
    
    // 应该只渲染一个 Grid：中间列
    expect(screen.getAllByTestId('grid')).toHaveLength(1);
    expect(screen.getByText('姓名')).toBeInTheDocument();
    expect(screen.getByText('年龄')).toBeInTheDocument();
  });
});
