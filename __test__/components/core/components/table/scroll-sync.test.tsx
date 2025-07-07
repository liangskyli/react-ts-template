import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Table from '@/components/core/components/table';

// 模拟 react-virtualized
vi.mock('react-virtualized', () => {
  const mockScrollToPosition = vi.fn();
  
  return {
    AutoSizer: ({ children }: any) => children({ width: 800, height: 400 }),
    Grid: function MockGrid({
      cellRenderer,
      columnCount,
      rowCount,
      onScroll,
    }: any) {
      // 模拟Grid组件的ref方法
      const gridRef = {
        scrollToPosition: mockScrollToPosition,
      };
      
      // 模拟滚动事件
      const handleTestScroll = () => {
        if (onScroll) {
          onScroll({ scrollTop: 100, scrollLeft: 50 });
        }
      };

      return (
        <div 
          data-testid="grid"
          data-scroll-handler={onScroll ? 'true' : 'false'}
          onClick={handleTestScroll} // 用点击模拟滚动
        >
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

describe('Table Scroll Synchronization', () => {
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

  it('should render grids with scroll handlers for left and right fixed columns', () => {
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
    
    const grids = screen.getAllByTestId('grid');
    
    // 应该有6个Grid：3个表头 + 3个数据体（左固定、中间、右固定）
    expect(grids).toHaveLength(6);
    
    // 检查哪些Grid有滚动处理器
    const gridsWithScrollHandler = grids.filter(grid => 
      grid.getAttribute('data-scroll-handler') === 'true'
    );
    
    // 应该有3个Grid有滚动处理器（左固定数据、中间数据、右固定数据）
    expect(gridsWithScrollHandler).toHaveLength(3);
  });

  it('should render correct number of grids for different fixed column configurations', () => {
    // 测试只有左固定列
    const leftOnlyColumns = [
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
    ];

    const { rerender } = render(<Table columns={leftOnlyColumns} dataSource={mockDataSource} />);
    
    let grids = screen.getAllByTestId('grid');
    // 应该有4个Grid：2个表头（左固定、中间）+ 2个数据体（左固定、中间）
    expect(grids).toHaveLength(4);

    // 测试只有右固定列
    const rightOnlyColumns = [
      {
        key: 'name',
        title: '姓名',
        dataIndex: 'name',
        width: 120,
      },
      {
        key: 'action',
        title: '操作',
        width: 100,
        fixed: 'right' as const,
        render: () => <span>操作</span>,
      },
    ];

    rerender(<Table columns={rightOnlyColumns} dataSource={mockDataSource} />);
    
    grids = screen.getAllByTestId('grid');
    // 应该有4个Grid：2个表头（中间、右固定）+ 2个数据体（中间、右固定）
    expect(grids).toHaveLength(4);

    // 测试无固定列
    const noFixedColumns = [
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

    rerender(<Table columns={noFixedColumns} dataSource={mockDataSource} />);
    
    grids = screen.getAllByTestId('grid');
    // 应该有2个Grid：1个表头（中间）+ 1个数据体（中间）
    expect(grids).toHaveLength(2);
  });

  it('should render table headers and data separately', () => {
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
    ];

    render(<Table columns={columns} dataSource={mockDataSource} />);
    
    // 检查表头和数据是否分离渲染
    expect(screen.getByText('姓名')).toBeInTheDocument(); // 表头
    expect(screen.getByText('年龄')).toBeInTheDocument(); // 表头
    expect(screen.getByText('张三')).toBeInTheDocument(); // 数据
    expect(screen.getByText('李四')).toBeInTheDocument(); // 数据
    expect(screen.getByText('32')).toBeInTheDocument(); // 数据
    expect(screen.getByText('28')).toBeInTheDocument(); // 数据
  });
});
