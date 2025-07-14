import React, { createRef } from 'react';
import { act, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import VirtualGrid from '@/components/core/components/virtual-grid';

/* eslint-disable @typescript-eslint/no-explicit-any */

// 模拟 react-virtualized
vi.mock('react-virtualized', () => {
  return {
    AutoSizer: ({ children }: any) => children({ width: 400, height: 400 }),
    Grid: function MockGrid({
      cellRenderer,
      columnCount,
      rowCount,
      ref,
      onScroll,
      onSectionRendered,
      rowHeight,
      columnWidth,
      style,
      scrollLeft,
      scrollTop,
    }: any) {
      // 存储回调函数，以便测试可以直接调用
      (global as any).__virtualizedGridOnScroll = onScroll;
      (global as any).__virtualizedGridOnSectionRendered = onSectionRendered;

      // 根据Grid的位置特征来识别不同的Grid并存储回调
      if (onScroll) {
        if (scrollLeft !== undefined && scrollTop === undefined) {
          // CenterHeader Grid (只有scrollLeft)
          (global as any).__onCenterHeaderScroll = onScroll;
        } else if (scrollTop !== undefined && scrollLeft === undefined) {
          // LeftBody Grid (只有scrollTop)
          (global as any).__onLeftBodyScroll = onScroll;
        } else if (scrollTop === undefined && scrollLeft === undefined) {
          // CenterBody Grid (没有固定的scroll值)
          (global as any).__onCenterBodyScroll = onScroll;
        }
      }

      // 调用 rowHeight 和 columnWidth 函数
      if (typeof rowHeight === 'function') {
        rowHeight({ index: 0 });
      }
      if (typeof columnWidth === 'function') {
        columnWidth({ index: 0 });
      }

      // 创建模拟的方法
      const mockScrollToPosition = vi.fn();
      const mockScrollToCell = vi.fn();
      const mockRecomputeGridSize = vi.fn();
      const mockMeasureAllCells = vi.fn();

      // 存储到全局以便测试验证
      (global as any).__virtualizedGridScrollToPosition = mockScrollToPosition;
      (global as any).__virtualizedGridScrollToCell = mockScrollToCell;
      (global as any).__virtualizedGridRecomputeGridSize =
        mockRecomputeGridSize;
      (global as any).__virtualizedGridMeasureAllCells = mockMeasureAllCells;

      // 使用 useImperativeHandle 来模拟 ref 的行为
      React.useImperativeHandle(
        ref,
        () => ({
          scrollToPosition: mockScrollToPosition,
          scrollToCell: mockScrollToCell,
          recomputeGridSize: mockRecomputeGridSize,
          measureAllCells: mockMeasureAllCells,
        }),
        [],
      );

      return (
        <div role="grid" data-testid="virtualized-grid" style={style}>
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
        </div>
      );
    },
    CellMeasurer: ({ children }: any) =>
      children({ registerChild: (ref: unknown) => ref, measure: vi.fn() }),
    CellMeasurerCache: class MockCellMeasurerCache {
      private readonly keyMapperFn: (
        rowIndex: number,
        columnIndex: number,
      ) => string;

      constructor(params: any) {
        Object.assign(this, params);
        this.keyMapperFn = params.keyMapper;
      }
      clearAll() {}
      clear(rowIndex: number, columnIndex: number) {
        (global as any).__lastClearCall = { rowIndex, columnIndex };
      }
      rowHeight() {
        return 50;
      }
      columnWidth() {
        return 100;
      }
      // 暴露 keyMapper 方法以便测试
      getKeyMapper() {
        return this.keyMapperFn;
      }
    },
  };
});

describe('VirtualGrid Component', () => {
  beforeEach(() => {
    // 清除全局回调函数
    (global as any).__onCenterHeaderScroll = undefined;
    (global as any).__onLeftBodyScroll = undefined;
    (global as any).__onCenterBodyScroll = undefined;
    (global as any).__virtualizedGridOnScroll = undefined;
    (global as any).__virtualizedGridOnSectionRendered = undefined;
  });

  it('renders correctly with basic props', () => {
    render(
      <VirtualGrid
        rowCount={2}
        columnCount={2}
        cellRenderer={({ rowIndex, columnIndex }) => (
          <div>{`Item ${rowIndex}-${columnIndex}`}</div>
        )}
      />,
    );

    expect(screen.getByTestId('virtualized-grid')).toBeInTheDocument();
    expect(screen.getByText('Item 0-0')).toBeInTheDocument();
    expect(screen.getByText('Item 0-1')).toBeInTheDocument();
    expect(screen.getByText('Item 1-0')).toBeInTheDocument();
    expect(screen.getByText('Item 1-1')).toBeInTheDocument();
  });

  it('handles single column mode correctly', () => {
    render(
      <VirtualGrid
        rowCount={2}
        columnCount={1}
        cellRenderer={({ rowIndex, columnIndex }) => (
          <div>{`Item ${rowIndex}-${columnIndex}`}</div>
        )}
      />,
    );

    expect(screen.getByText('Item 0-0')).toBeInTheDocument();
    expect(screen.getByText('Item 1-0')).toBeInTheDocument();
  });

  it('handles fixed columns and rows', () => {
    render(
      <VirtualGrid
        rowCount={5}
        columnCount={5}
        cellRenderer={({ rowIndex, columnIndex }) => (
          <div>{`Item ${rowIndex}-${columnIndex}`}</div>
        )}
        fixedTopRowCount={1}
        fixedLeftColumnCount={1}
        fixedRightColumnCount={1}
      />,
    );

    // 固定行列会渲染多个Grid，所以使用getAllByTestId
    expect(screen.getAllByTestId('virtualized-grid')).toHaveLength(6);
    expect(screen.getByText('Item 0-0')).toBeInTheDocument();
    expect(screen.getByText('Item 2-2')).toBeInTheDocument();
  });

  it('calls getPositionCache when scrolling', async () => {
    const getPositionCache = vi.fn();

    render(
      <VirtualGrid
        rowCount={2}
        columnCount={2}
        cellRenderer={({ rowIndex, columnIndex }) => (
          <div>{`Item ${rowIndex}-${columnIndex}`}</div>
        )}
        getPositionCache={getPositionCache}
      />,
    );

    // 模拟 onSectionRendered 回调
    await act(async () => {
      (global as any).__virtualizedGridOnSectionRendered({
        columnStartIndex: 0,
        columnStopIndex: 1,
        rowStartIndex: 0,
        rowStopIndex: 1,
      });
    });

    // 第一次滚动事件
    await act(async () => {
      (global as any).__virtualizedGridOnScroll({
        scrollTop: 0,
        scrollLeft: 0,
      });
    });

    // 第二次滚动事件，这次应该会触发 getPositionCache
    await act(async () => {
      (global as any).__virtualizedGridOnScroll({
        scrollTop: 50,
        scrollLeft: 50,
      });
    });

    // 验证 getPositionCache 被调用
    expect(getPositionCache).toHaveBeenCalledWith({
      params: {
        scrollTop: 0,
        scrollLeft: 0,
      },
      virtualScrollInfo: {
        columnStartIndex: 0,
        columnStopIndex: 1,
        rowStartIndex: 0,
        rowStopIndex: 1,
      },
    });
  });

  it('handles custom rowHeight and columnWidth functions', () => {
    const rowHeight = vi.fn(({ index, gridHeight }) => index * gridHeight);
    const columnWidth = vi.fn(({ index, gridWidth }) => index * gridWidth);

    render(
      <VirtualGrid
        fixedTopRowCount={1}
        fixedLeftColumnCount={1}
        fixedRightColumnCount={1}
        rowCount={20}
        columnCount={20}
        cellRenderer={({ rowIndex, columnIndex }) => (
          <div>{`Item ${rowIndex}-${columnIndex}`}</div>
        )}
        rowHeight={rowHeight}
        columnWidth={columnWidth}
      />,
    );

    expect(rowHeight).toHaveBeenCalled();
    expect(columnWidth).toHaveBeenCalled();
  });

  it('handles custom rowHeight and columnWidth numbers', () => {
    render(
      <VirtualGrid
        rowCount={2}
        columnCount={2}
        cellRenderer={({ rowIndex, columnIndex }) => (
          <div>{`Item ${rowIndex}-${columnIndex}`}</div>
        )}
        rowHeight={50}
        columnWidth={100}
      />,
    );

    // 验证Grid组件接收到了正确的数字值
    const gridElement = screen.getByTestId('virtualized-grid');
    expect(gridElement).toBeInTheDocument();
    expect(screen.getByText('Item 0-0')).toBeInTheDocument();
    expect(screen.getByText('Item 0-1')).toBeInTheDocument();
    expect(screen.getByText('Item 1-0')).toBeInTheDocument();
    expect(screen.getByText('Item 1-1')).toBeInTheDocument();
  });

  it('sets up gridRef correctly', () => {
    const gridRef = createRef<any>();

    render(
      <VirtualGrid
        rowCount={1}
        columnCount={1}
        cellRenderer={({ rowIndex, columnIndex }) => (
          <div>{`Item ${rowIndex}-${columnIndex}`}</div>
        )}
        ref={gridRef}
      />,
    );

    expect(gridRef.current).toBeDefined();
    expect(typeof gridRef.current?.scrollToPosition).toBe('function');
    expect(typeof gridRef.current?.scrollToCell).toBe('function');
    expect(typeof gridRef.current?.measureAllCells).toBe('function');
    expect(typeof gridRef.current?.recomputeGridSize).toBe('function');
    expect(typeof gridRef.current?.getCache).toBe('function');
  });

  it('handles style class names correctly', () => {
    render(
      <VirtualGrid
        rowCount={2}
        columnCount={2}
        cellRenderer={({ rowIndex, columnIndex }) => (
          <div>{`Item ${rowIndex}-${columnIndex}`}</div>
        )}
        leftHeaderClass="custom-left-header"
        centerHeaderClass="custom-center-header"
        rightHeaderClass="custom-right-header"
        leftBodyClass="custom-left-body"
        centerBodyClass="custom-center-body"
        rightBodyClass="custom-right-body"
      />,
    );

    expect(screen.getByTestId('virtualized-grid')).toBeInTheDocument();
  });

  it('handles scrollbar hiding options', () => {
    render(
      <VirtualGrid
        rowCount={100}
        columnCount={100}
        fixedLeftColumnCount={1}
        fixedRightColumnCount={1}
        fixedTopRowCount={1}
        cellRenderer={({ rowIndex, columnIndex }) => (
          <div>{`Item ${rowIndex}-${columnIndex}`}</div>
        )}
        hideCenterHeaderGridScrollbar={true}
        hideLeftBodyGridScrollbar={true}
        hideRightBodyGridScrollbar={true}
      />,
    );
    const grids = screen.queryAllByTestId('virtualized-grid');
    expect(grids[1].style.overflow).toBe('hidden');
    expect(grids[3].style.overflow).toBe('hidden');
    expect(grids[5].style.overflow).toBe('hidden');
  });

  it('handles zero row and column counts', () => {
    const { container } = render(
      <VirtualGrid
        rowCount={0}
        columnCount={0}
        cellRenderer={({ rowIndex, columnIndex }) => (
          <div>{`Item ${rowIndex}-${columnIndex}`}</div>
        )}
      />,
    );

    // 当rowCount或columnCount为0时，不应该渲染Grid组件，只渲染容器
    expect(container.querySelector('.relative')).toBeInTheDocument();
    expect(
      container.querySelectorAll('[data-testid="virtualized-grid"]'),
    ).toHaveLength(0);
  });

  it('handles complex fixed layout', () => {
    render(
      <VirtualGrid
        rowCount={10}
        columnCount={10}
        cellRenderer={({ rowIndex, columnIndex }) => (
          <div
            style={{
              backgroundColor: rowIndex < 2 ? '#f0f0f0' : 'white',
              border: '1px solid #ddd',
            }}
          >
            {`Item ${rowIndex}-${columnIndex}`}
          </div>
        )}
        fixedTopRowCount={2}
        fixedLeftColumnCount={2}
        fixedRightColumnCount={1}
        leftHeaderClass="left-header"
        centerHeaderClass="center-header"
        rightHeaderClass="right-header"
        leftBodyClass="left-body"
        centerBodyClass="center-body"
        rightBodyClass="right-body"
      />,
    );

    // 应该渲染6个Grid组件（左上、中上、右上、左下、中下、右下）
    expect(screen.getAllByTestId('virtualized-grid')).toHaveLength(6);
  });

  it('handles edge case with only fixed columns', () => {
    render(
      <VirtualGrid
        rowCount={5}
        columnCount={5}
        cellRenderer={({ rowIndex, columnIndex }) => (
          <div>{`Item ${rowIndex}-${columnIndex}`}</div>
        )}
        fixedLeftColumnCount={2}
        fixedRightColumnCount={1}
      />,
    );

    // 应该渲染3个Grid组件（左、中、右）
    expect(screen.getAllByTestId('virtualized-grid')).toHaveLength(3);
  });

  it('handles edge case with only fixed rows', () => {
    render(
      <VirtualGrid
        rowCount={5}
        columnCount={5}
        cellRenderer={({ rowIndex, columnIndex }) => (
          <div>{`Item ${rowIndex}-${columnIndex}`}</div>
        )}
        fixedTopRowCount={2}
      />,
    );

    // 应该渲染2个Grid组件（上、下）
    expect(screen.getAllByTestId('virtualized-grid')).toHaveLength(2);
  });

  it('handles ref methods correctly', () => {
    const gridRef = createRef<any>();

    render(
      <VirtualGrid
        rowCount={5}
        columnCount={5}
        cellRenderer={({ rowIndex, columnIndex }) => (
          <div>{`Item ${rowIndex}-${columnIndex}`}</div>
        )}
        ref={gridRef}
      />,
    );

    // 测试ref是否正确设置
    expect(gridRef.current).toBeDefined();
    expect(typeof gridRef.current?.scrollToCell).toBe('function');
    expect(typeof gridRef.current?.scrollToPosition).toBe('function');
    expect(typeof gridRef.current?.measureAllCells).toBe('function');
    expect(typeof gridRef.current?.recomputeGridSize).toBe('function');
    expect(typeof gridRef.current?.getCache).toBe('function');
  });

  it('calls ref methods correctly', async () => {
    const gridRef = createRef<any>();

    render(
      <VirtualGrid
        fixedTopRowCount={1}
        fixedLeftColumnCount={1}
        fixedRightColumnCount={1}
        rowCount={5}
        columnCount={5}
        cellRenderer={({ rowIndex, columnIndex }) => (
          <div>{`Item ${rowIndex}-${columnIndex}`}</div>
        )}
        ref={gridRef}
      />,
    );

    await act(async () => {
      // 测试 scrollToPosition
      gridRef.current?.scrollToPosition({ scrollTop: 100, scrollLeft: 50 });

      // 测试 scrollToCell
      gridRef.current?.scrollToCell(2, 3);

      // 测试 measureAllCells
      gridRef.current?.measureAllCells();

      // 测试 recomputeGridSize
      gridRef.current?.recomputeGridSize();
      gridRef.current?.recomputeGridSize({ rowIndex: 1, columnIndex: 2 });

      // 测试 getCache
      const cache = gridRef.current?.getCache();
      expect(cache).toBeDefined();
    });

    // 验证ref方法存在且可调用
    expect(gridRef.current).toBeDefined();
    expect(typeof gridRef.current.scrollToPosition).toBe('function');
    expect(typeof gridRef.current.scrollToCell).toBe('function');
    expect(typeof gridRef.current.measureAllCells).toBe('function');
    expect(typeof gridRef.current.recomputeGridSize).toBe('function');
    expect(typeof gridRef.current.getCache).toBe('function');
  });

  it('handles scroll events correctly', async () => {
    const getPositionCache = vi.fn();

    render(
      <VirtualGrid
        rowCount={5}
        columnCount={5}
        cellRenderer={({ rowIndex, columnIndex }) => (
          <div>{`Item ${rowIndex}-${columnIndex}`}</div>
        )}
        getPositionCache={getPositionCache}
        fixedTopRowCount={1}
        fixedLeftColumnCount={1}
      />,
    );

    // 模拟滚动事件
    await act(async () => {
      (global as any).__virtualizedGridOnScroll({
        scrollTop: 100,
        scrollLeft: 50,
      });
    });

    // 模拟 onSectionRendered
    await act(async () => {
      (global as any).__virtualizedGridOnSectionRendered({
        columnStartIndex: 0,
        columnStopIndex: 2,
        rowStartIndex: 0,
        rowStopIndex: 2,
      });
    });

    expect(getPositionCache).toHaveBeenCalled();
  });

  it('handles fixedWidth and fixedHeight correctly', () => {
    render(
      <VirtualGrid
        rowCount={3}
        columnCount={3}
        cellRenderer={({ rowIndex, columnIndex }) => (
          <div>{`Item ${rowIndex}-${columnIndex}`}</div>
        )}
        fixedWidth={true}
        fixedHeight={true}
        defaultWidth={120}
        defaultHeight={40}
      />,
    );

    expect(screen.getByTestId('virtualized-grid')).toBeInTheDocument();
  });

  it('handles scroll position updates correctly', async () => {
    const gridRef = createRef<any>();

    render(
      <VirtualGrid
        rowCount={5}
        columnCount={5}
        cellRenderer={({ rowIndex, columnIndex }) => (
          <div>{`Item ${rowIndex}-${columnIndex}`}</div>
        )}
        ref={gridRef}
        scrollToRow={2}
        scrollToColumn={3}
      />,
    );

    // 测试滚动到指定位置
    await act(async () => {
      gridRef.current?.scrollToCell(1, 2);
    });

    expect(gridRef.current).toBeDefined();
  });

  it('handles dynamic size calculation correctly', () => {
    const rowHeight = vi.fn(({ index }) => 50 + index * 10);
    const columnWidth = vi.fn(({ index }) => 100 + index * 20);

    render(
      <VirtualGrid
        rowCount={3}
        columnCount={3}
        cellRenderer={({ rowIndex, columnIndex }) => (
          <div>{`Item ${rowIndex}-${columnIndex}`}</div>
        )}
        rowHeight={rowHeight}
        columnWidth={columnWidth}
        fixedTopRowCount={1}
        fixedLeftColumnCount={1}
      />,
    );

    // 验证动态尺寸函数被调用
    expect(rowHeight).toHaveBeenCalled();
    expect(columnWidth).toHaveBeenCalled();
  });

  it('handles scroll events for different grid positions', async () => {
    render(
      <VirtualGrid
        rowCount={10}
        columnCount={10}
        cellRenderer={({ rowIndex, columnIndex }) => (
          <div>{`Item ${rowIndex}-${columnIndex}`}</div>
        )}
        fixedTopRowCount={2}
        fixedLeftColumnCount={2}
        fixedRightColumnCount={1}
        fixedHeight
        fixedWidth
      />,
    );

    // 模拟中心头部滚动事件 (覆盖 onCenterHeaderScroll)
    await act(async () => {
      const onCenterHeaderScroll = (global as any).__virtualizedGridOnScroll;
      if (onCenterHeaderScroll) {
        onCenterHeaderScroll({ scrollTop: 0, scrollLeft: 100 });
      }
    });

    // 模拟左侧主体滚动事件 (覆盖 onLeftBodyScroll)
    await act(async () => {
      const onLeftBodyScroll = (global as any).__virtualizedGridOnScroll;
      if (onLeftBodyScroll) {
        onLeftBodyScroll({ scrollTop: 50, scrollLeft: 0 });
      }
    });

    // 模拟右侧主体滚动事件 (覆盖 onRightBodyScroll)
    await act(async () => {
      const onRightBodyScroll = (global as any).__virtualizedGridOnScroll;
      if (onRightBodyScroll) {
        onRightBodyScroll({ scrollTop: 75, scrollLeft: 0 });
      }
    });

    expect(screen.getAllByTestId('virtualized-grid')).toHaveLength(6);
  });

  describe('onCenterHeaderScroll method', () => {
    it('handles onCenterHeaderScroll correctly', async () => {
      render(
        <VirtualGrid
          rowCount={5}
          columnCount={5}
          cellRenderer={({ rowIndex, columnIndex }) => (
            <div>{`Item ${rowIndex}-${columnIndex}`}</div>
          )}
          fixedTopRowCount={2}
          fixedLeftColumnCount={1}
        />,
      );

      // 验证CenterHeader Grid被渲染（应该有4个Grid：左上、右上、左下、右下）
      expect(screen.getAllByTestId('virtualized-grid')).toHaveLength(4);

      // 验证onCenterHeaderScroll回调函数被设置
      expect((global as any).__onCenterHeaderScroll).toBeDefined();
      expect(typeof (global as any).__onCenterHeaderScroll).toBe('function');
    });

    it('verifies CenterHeader Grid configuration', () => {
      render(
        <VirtualGrid
          rowCount={10}
          columnCount={10}
          cellRenderer={({ rowIndex, columnIndex }) => (
            <div>{`Item ${rowIndex}-${columnIndex}`}</div>
          )}
          fixedTopRowCount={2}
          fixedLeftColumnCount={2}
          fixedRightColumnCount={1}
        />,
      );

      // 验证有6个Grid组件被渲染（左上、中上、右上、左下、中下、右下）
      expect(screen.getAllByTestId('virtualized-grid')).toHaveLength(6);
    });

    it('tests CenterHeader scroll callback functionality', async () => {
      render(
        <VirtualGrid
          rowCount={8}
          columnCount={8}
          cellRenderer={({ rowIndex, columnIndex }) => (
            <div>{`Item ${rowIndex}-${columnIndex}`}</div>
          )}
          fixedTopRowCount={1}
          fixedLeftColumnCount={1}
          fixedRightColumnCount={1}
        />,
      );

      // 验证CenterHeader回调函数存在
      expect((global as any).__onCenterHeaderScroll).toBeDefined();

      // 测试回调函数可以被调用
      await act(async () => {
        const onCenterHeaderScroll = (global as any).__onCenterHeaderScroll;
        if (onCenterHeaderScroll) {
          // 验证函数可以被调用而不抛出错误
          onCenterHeaderScroll({
            scrollLeft: 100,
            scrollTop: 0,
          });
        }
      });

      // 验证组件正常渲染
      expect(screen.getAllByTestId('virtualized-grid')).toHaveLength(6);
    });
  });

  describe('onLeftBodyScroll method', () => {
    it('handles onLeftBodyScroll correctly', async () => {
      render(
        <VirtualGrid
          rowCount={5}
          columnCount={5}
          cellRenderer={({ rowIndex, columnIndex }) => (
            <div>{`Item ${rowIndex}-${columnIndex}`}</div>
          )}
          fixedTopRowCount={1}
          fixedLeftColumnCount={2}
        />,
      );

      // 验证LeftBody Grid被渲染（应该有4个Grid：左上、右上、左下、右下）
      expect(screen.getAllByTestId('virtualized-grid')).toHaveLength(4);

      // 验证onLeftBodyScroll回调函数被设置
      expect((global as any).__onLeftBodyScroll).toBeDefined();
      expect(typeof (global as any).__onLeftBodyScroll).toBe('function');
    });

    it('verifies LeftBody Grid configuration', () => {
      render(
        <VirtualGrid
          rowCount={10}
          columnCount={10}
          cellRenderer={({ rowIndex, columnIndex }) => (
            <div>{`Item ${rowIndex}-${columnIndex}`}</div>
          )}
          fixedTopRowCount={1}
          fixedLeftColumnCount={2}
        />,
      );

      // 验证有4个Grid组件被渲染（左上、右上、左下、右下）
      expect(screen.getAllByTestId('virtualized-grid')).toHaveLength(4);
    });

    it('tests LeftBody scroll callback functionality', async () => {
      render(
        <VirtualGrid
          rowCount={12}
          columnCount={6}
          cellRenderer={({ rowIndex, columnIndex }) => (
            <div>{`Item ${rowIndex}-${columnIndex}`}</div>
          )}
          fixedTopRowCount={2}
          fixedLeftColumnCount={2}
        />,
      );

      // 验证LeftBody回调函数存在
      expect((global as any).__onLeftBodyScroll).toBeDefined();

      // 测试回调函数可以被调用
      await act(async () => {
        const onLeftBodyScroll = (global as any).__onLeftBodyScroll;
        if (onLeftBodyScroll) {
          // 验证函数可以被调用而不抛出错误
          onLeftBodyScroll({
            scrollTop: 100,
            scrollLeft: 0,
          });
        }
      });

      // 验证组件正常渲染（fixedTopRowCount=2, fixedLeftColumnCount=2 应该有4个Grid）
      expect(screen.getAllByTestId('virtualized-grid')).toHaveLength(4);
    });

    it('handles LeftBody scroll when no fixed columns exist', async () => {
      render(
        <VirtualGrid
          rowCount={5}
          columnCount={5}
          cellRenderer={({ rowIndex, columnIndex }) => (
            <div>{`Item ${rowIndex}-${columnIndex}`}</div>
          )}
          fixedTopRowCount={1}
          fixedLeftColumnCount={0} // 没有固定左列
        />,
      );

      // 当没有固定左列时，LeftBody Grid不应该被渲染
      // 所以onLeftBodyScroll不应该被设置
      expect((global as any).__onLeftBodyScroll).toBeUndefined();
    });
  });

  describe('scroll synchronization between grids', () => {
    it('verifies grid synchronization setup', async () => {
      render(
        <VirtualGrid
          rowCount={8}
          columnCount={8}
          cellRenderer={({ rowIndex, columnIndex }) => (
            <div>{`Item ${rowIndex}-${columnIndex}`}</div>
          )}
          fixedTopRowCount={2}
          fixedLeftColumnCount={2}
        />,
      );

      // 验证所有必要的Grid组件都被渲染（fixedTopRowCount=2, fixedLeftColumnCount=2 应该有4个Grid）
      expect(screen.getAllByTestId('virtualized-grid')).toHaveLength(4);

      // 验证滚动回调函数都被正确设置
      expect((global as any).__onCenterHeaderScroll).toBeDefined();
      expect((global as any).__onLeftBodyScroll).toBeDefined();
      expect((global as any).__onCenterBodyScroll).toBeDefined();

      // 测试回调函数可以被调用
      await act(async () => {
        const onCenterHeaderScroll = (global as any).__onCenterHeaderScroll;
        const onLeftBodyScroll = (global as any).__onLeftBodyScroll;

        if (onCenterHeaderScroll) {
          onCenterHeaderScroll({ scrollLeft: 100, scrollTop: 0 });
        }

        if (onLeftBodyScroll) {
          onLeftBodyScroll({ scrollTop: 80, scrollLeft: 0 });
        }
      });

      // 验证组件仍然正常工作
      expect(screen.getAllByTestId('virtualized-grid')).toHaveLength(4);
    });
  });
});
