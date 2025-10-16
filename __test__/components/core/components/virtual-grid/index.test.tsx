import React, { createRef } from 'react';
import { act, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import VirtualGrid from '@/components/core/components/virtual-grid';

/* eslint-disable @typescript-eslint/no-explicit-any */

// 模拟 react-virtualized
vi.mock('react-virtualized', () => {
  return {
    AutoSizer: ({ children }: any) => children({ width: 400, height: 400 }),
    WindowScroller: ({ children }: any) =>
      children({
        height: 400,
        isScrolling: false,
        onChildScroll: vi.fn(),
        scrollTop: 0,
        registerChild: vi.fn(),
      }),
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
      'data-testid': dataTestId = 'centerBodyGrid',
    }: any) {
      // 存储回调函数，以便测试可以直接调用
      (global as any).__virtualizedGridOnScroll = onScroll;

      // 根据data-testid来存储不同Grid的onSectionRendered和onScroll回调
      switch (dataTestId) {
        case 'leftHeaderGrid':
          (global as any).__onLeftHeaderSectionRendered = onSectionRendered;
          break;
        case 'centerHeaderGrid':
          (global as any).__onCenterHeaderSectionRendered = onSectionRendered;
          (global as any).__onCenterHeaderScroll = onScroll;
          break;
        case 'rightHeaderGrid':
          (global as any).__onRightHeaderSectionRendered = onSectionRendered;
          break;
        case 'leftBodyGrid':
          (global as any).__onLeftBodySectionRendered = onSectionRendered;
          (global as any).__onLeftBodyScroll = onScroll;
          break;
        case 'centerBodyGrid':
          (global as any).__onCenterBodySectionRendered = onSectionRendered;
          (global as any).__onCenterBodyScroll = onScroll;
          break;
        case 'rightBodyGrid':
          (global as any).__onRightBodySectionRendered = onSectionRendered;
          (global as any).__onRightBodyScroll = onScroll;
          break;
        default:
          (global as any).__virtualizedGridOnSectionRendered =
            onSectionRendered;
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
        [
          mockMeasureAllCells,
          mockRecomputeGridSize,
          mockScrollToCell,
          mockScrollToPosition,
        ],
      );

      return (
        <div role="grid" data-testid={dataTestId} style={style}>
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
    (global as any).__onRightBodyScroll = undefined;
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

    expect(screen.getByTestId('centerBodyGrid')).toBeInTheDocument();
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

    expect(screen.getByTestId('centerBodyGrid')).toBeInTheDocument();
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

    // 验证所有网格都被正确渲染
    expect(screen.getByTestId('leftHeaderGrid')).toBeInTheDocument();
    expect(screen.getByTestId('centerHeaderGrid')).toBeInTheDocument();
    expect(screen.getByTestId('rightHeaderGrid')).toBeInTheDocument();
    expect(screen.getByTestId('leftBodyGrid')).toBeInTheDocument();
    expect(screen.getByTestId('centerBodyGrid')).toBeInTheDocument();
    expect(screen.getByTestId('rightBodyGrid')).toBeInTheDocument();
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
      (global as any).__onCenterBodySectionRendered({
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

  it('calls getPositionCache when fixedWidth and fixedHeight', async () => {
    const getPositionCache = vi.fn();

    render(
      <VirtualGrid
        rowCount={2}
        columnCount={2}
        fixedWidth
        fixedHeight
        cellRenderer={({ rowIndex, columnIndex }) => (
          <div>{`Item ${rowIndex}-${columnIndex}`}</div>
        )}
        getPositionCache={getPositionCache}
      />,
    );

    // 模拟 onSectionRendered 回调
    await act(async () => {
      (global as any).__onCenterBodySectionRendered({
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
    const gridElement = screen.getByTestId('centerBodyGrid');
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
        className="className"
        leftHeaderClass="custom-left-header"
        centerHeaderClass="custom-center-header"
        rightHeaderClass="custom-right-header"
        leftBodyClass="custom-left-body"
        centerBodyClass="custom-center-body"
        rightBodyClass="custom-right-body"
      />,
    );

    expect(screen.getByTestId('centerBodyGrid')).toBeInTheDocument();
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

    // 验证中心头部网格的滚动条隐藏
    const centerHeaderGrid = screen.getByTestId('centerHeaderGrid');
    expect(centerHeaderGrid).toHaveStyle({ overflow: 'hidden' });

    // 验证左侧主体网格的滚动条隐藏
    const leftBodyGrid = screen.getByTestId('leftBodyGrid');
    expect(leftBodyGrid).toHaveStyle({ overflow: 'hidden' });

    // 验证右侧主体网格的滚动条隐藏
    const rightBodyGrid = screen.getByTestId('rightBodyGrid');
    expect(rightBodyGrid).toHaveStyle({ overflow: 'hidden' });
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
    expect(screen.queryByTestId('centerBodyGrid')).not.toBeInTheDocument();
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

    // 验证所有网格都被正确渲染
    expect(screen.getByTestId('leftHeaderGrid')).toBeInTheDocument();
    expect(screen.getByTestId('centerHeaderGrid')).toBeInTheDocument();
    expect(screen.getByTestId('rightHeaderGrid')).toBeInTheDocument();
    expect(screen.getByTestId('leftBodyGrid')).toBeInTheDocument();
    expect(screen.getByTestId('centerBodyGrid')).toBeInTheDocument();
    expect(screen.getByTestId('rightBodyGrid')).toBeInTheDocument();
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

    // 验证只渲染左、中、右主体网格
    expect(screen.getByTestId('leftBodyGrid')).toBeInTheDocument();
    expect(screen.getByTestId('centerBodyGrid')).toBeInTheDocument();
    expect(screen.getByTestId('rightBodyGrid')).toBeInTheDocument();
    expect(screen.queryByTestId('leftHeaderGrid')).not.toBeInTheDocument();
    expect(screen.queryByTestId('centerHeaderGrid')).not.toBeInTheDocument();
    expect(screen.queryByTestId('rightHeaderGrid')).not.toBeInTheDocument();
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

    // 验证只渲染头部和主体网格
    expect(screen.getByTestId('centerHeaderGrid')).toBeInTheDocument();
    expect(screen.getByTestId('centerBodyGrid')).toBeInTheDocument();
    expect(screen.queryByTestId('leftBodyGrid')).not.toBeInTheDocument();
    expect(screen.queryByTestId('rightBodyGrid')).not.toBeInTheDocument();
    expect(screen.queryByTestId('leftHeaderGrid')).not.toBeInTheDocument();
    expect(screen.queryByTestId('rightHeaderGrid')).not.toBeInTheDocument();
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

    expect(screen.getByTestId('centerBodyGrid')).toBeInTheDocument();
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

    // 验证网格渲染
    expect(screen.getByTestId('leftHeaderGrid')).toBeInTheDocument();
    expect(screen.getByTestId('centerHeaderGrid')).toBeInTheDocument();
    expect(screen.getByTestId('leftBodyGrid')).toBeInTheDocument();
    expect(screen.getByTestId('centerBodyGrid')).toBeInTheDocument();
  });

  describe('scroll and grid size recalculation', () => {
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

      // 验证初始渲染
      expect(screen.getByTestId('leftHeaderGrid')).toBeInTheDocument();
      expect(screen.getByTestId('centerHeaderGrid')).toBeInTheDocument();
      expect(screen.getByTestId('leftBodyGrid')).toBeInTheDocument();
      expect(screen.getByTestId('centerBodyGrid')).toBeInTheDocument();

      // 模拟滚动事件
      await act(async () => {
        (global as any).__onCenterBodyScroll({
          scrollTop: 100,
          scrollLeft: 50,
        });
      });

      // 模拟 onSectionRendered
      await act(async () => {
        (global as any).__onCenterBodySectionRendered({
          columnStartIndex: 0,
          columnStopIndex: 2,
          rowStartIndex: 0,
          rowStopIndex: 2,
        });
      });

      expect(getPositionCache).toHaveBeenCalled();
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

      // 模拟滚动事件
      await act(async () => {
        (global as any).__onCenterBodyScroll({
          scrollTop: 100,
          scrollLeft: 50,
        });
      });

      expect(gridRef.current).toBeDefined();
    });

    it('handles header grid height updates correctly', async () => {
      const rowHeight = ({ index }: { index: number }) => 50 + index * 10;
      render(
        <VirtualGrid
          rowCount={10}
          columnCount={10}
          cellRenderer={({ rowIndex, columnIndex }) => (
            <div
              style={{ height: rowHeight({ index: rowIndex }) }}
            >{`Item ${rowIndex}-${columnIndex}`}</div>
          )}
          rowHeight={rowHeight}
          fixedTopRowCount={2}
          fixedLeftColumnCount={2}
          fixedRightColumnCount={1}
        />,
      );

      // 首次渲染时headerGridHeight为0
      expect(screen.getByTestId('leftHeaderGrid')).toBeInTheDocument();
      expect(screen.getByTestId('centerHeaderGrid')).toBeInTheDocument();
      expect(screen.getByTestId('rightHeaderGrid')).toBeInTheDocument();

      // 触发左上角网格的onSectionRendered
      await act(async () => {
        (global as any).__onLeftHeaderSectionRendered({
          columnStartIndex: 0,
          columnStopIndex: 1,
          rowStartIndex: 0,
          rowStopIndex: 1,
        });
      });

      // 触发中间头部网格的onSectionRendered
      await act(async () => {
        (global as any).__onCenterHeaderSectionRendered({
          columnStartIndex: 0,
          columnStopIndex: 1,
          rowStartIndex: 0,
          rowStopIndex: 1,
        });
      });

      // 触发右上角网格的onSectionRendered
      await act(async () => {
        (global as any).__onRightHeaderSectionRendered({
          columnStartIndex: 0,
          columnStopIndex: 0,
          rowStartIndex: 0,
          rowStopIndex: 1,
        });
      });

      // 验证所有网格都被正确渲染，包括主体网格
      expect(screen.getByTestId('leftHeaderGrid')).toBeInTheDocument();
      expect(screen.getByTestId('centerHeaderGrid')).toBeInTheDocument();
      expect(screen.getByTestId('rightHeaderGrid')).toBeInTheDocument();
      expect(screen.getByTestId('leftBodyGrid')).toBeInTheDocument();
      expect(screen.getByTestId('centerBodyGrid')).toBeInTheDocument();
      expect(screen.getByTestId('rightBodyGrid')).toBeInTheDocument();
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

      // 验证所有网格都被正确渲染
      expect(screen.getByTestId('leftHeaderGrid')).toBeInTheDocument();
      expect(screen.getByTestId('centerHeaderGrid')).toBeInTheDocument();
      expect(screen.getByTestId('rightHeaderGrid')).toBeInTheDocument();
      expect(screen.getByTestId('leftBodyGrid')).toBeInTheDocument();
      expect(screen.getByTestId('centerBodyGrid')).toBeInTheDocument();
      expect(screen.getByTestId('rightBodyGrid')).toBeInTheDocument();

      // 模拟中心头部滚动事件
      await act(async () => {
        (global as any).__onCenterHeaderScroll({
          scrollTop: 0,
          scrollLeft: 100,
        });
      });

      // 模拟左侧主体滚动事件
      await act(async () => {
        (global as any).__onLeftBodyScroll({ scrollTop: 50, scrollLeft: 0 });
      });

      // 模拟右侧主体滚动事件
      await act(async () => {
        (global as any).__onRightBodyScroll({ scrollTop: 75, scrollLeft: 0 });
      });

      // 验证所有网格仍然存在
      expect(screen.getByTestId('leftHeaderGrid')).toBeInTheDocument();
      expect(screen.getByTestId('centerHeaderGrid')).toBeInTheDocument();
      expect(screen.getByTestId('rightHeaderGrid')).toBeInTheDocument();
      expect(screen.getByTestId('leftBodyGrid')).toBeInTheDocument();
      expect(screen.getByTestId('centerBodyGrid')).toBeInTheDocument();
      expect(screen.getByTestId('rightBodyGrid')).toBeInTheDocument();
    });

    it('handles center body grid scroll with WindowScroller', async () => {
      render(
        <VirtualGrid
          rowCount={20}
          columnCount={10}
          cellRenderer={({ rowIndex, columnIndex }) => (
            <div>{`Item ${rowIndex}-${columnIndex}`}</div>
          )}
          windowScroller={true}
        />,
      );

      // 触发中心主体网格的滚动
      await act(async () => {
        (global as any).__onCenterBodyScroll({
          scrollTop: 100,
          scrollLeft: 50,
        });
      });

      expect(screen.getByTestId('centerBodyGrid')).toBeInTheDocument();
    });

    it('handles WindowScroller with custom scroll element', () => {
      const customScrollElement = document.createElement('div');
      render(
        <VirtualGrid
          rowCount={10}
          columnCount={10}
          cellRenderer={({ rowIndex, columnIndex }) => (
            <div>{`Item ${rowIndex}-${columnIndex}`}</div>
          )}
          windowScroller={{
            scrollElement: customScrollElement,
          }}
        />,
      );

      expect(screen.getByTestId('centerBodyGrid')).toBeInTheDocument();
    });
  });
});
