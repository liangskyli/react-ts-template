import React, { createRef } from 'react';
import type { Grid } from 'react-virtualized';
import { act, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
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
    }: any) {
      // 存储回调函数，以便测试可以直接调用
      (global as any).__virtualizedGridOnScroll = onScroll;
      (global as any).__virtualizedGridOnSectionRendered = onSectionRendered;

      // 调用 rowHeight 和 columnWidth 函数
      if (typeof rowHeight === 'function') {
        rowHeight({ index: 0 });
      }
      if (typeof columnWidth === 'function') {
        columnWidth({ index: 0 });
      }

      // 创建一个模拟的 scrollToPosition 方法
      const mockScrollToPosition = vi.fn();
      (global as any).__virtualizedGridScrollToPosition = mockScrollToPosition;

      // 使用 useImperativeHandle 来模拟 ref 的行为
      React.useImperativeHandle(
        ref,
        () => ({
          scrollToPosition: mockScrollToPosition,
        }),
        [],
      );

      return (
        <div role="grid" data-testid="virtualized-grid">
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
      private keyMapperFn: (rowIndex: number, columnIndex: number) => string;

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
  it('renders correctly with basic props', () => {
    render(
      <VirtualGrid
        rowCount={2}
        columnCount={2}
        renderItem={({ rowIndex, columnIndex }) => (
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
        renderItem={({ rowIndex, columnIndex }) => (
          <div>{`Item ${rowIndex}-${columnIndex}`}</div>
        )}
      />,
    );

    expect(screen.getByText('Item 0-0')).toBeInTheDocument();
    expect(screen.getByText('Item 1-0')).toBeInTheDocument();
  });

  it('sets up cacheRef correctly', () => {
    const cacheRef = createRef<any>();

    render(
      <VirtualGrid
        rowCount={1}
        columnCount={1}
        renderItem={({ rowIndex, columnIndex }) => (
          <div>{`Item ${rowIndex}-${columnIndex}`}</div>
        )}
        cacheRef={cacheRef}
        defaultWidth={100}
        defaultHeight={50}
        minWidth={50}
        minHeight={25}
        fixedWidth={true}
        fixedHeight={true}
      />,
    );

    expect(cacheRef.current).toBeDefined();
    expect(typeof cacheRef.current.clear).toBe('function');
    expect(typeof cacheRef.current.clearAll).toBe('function');
    expect(cacheRef.current.defaultWidth).toBe(100);
    expect(cacheRef.current.defaultHeight).toBe(50);
    expect(cacheRef.current.minWidth).toBe(50);
    expect(cacheRef.current.minHeight).toBe(25);
    expect(cacheRef.current.fixedWidth).toBe(true);
    expect(cacheRef.current.fixedHeight).toBe(true);
  });

  it('calls getPositionCache when scrolling', async () => {
    const getPositionCache = vi.fn();

    render(
      <VirtualGrid
        rowCount={2}
        columnCount={2}
        renderItem={({ rowIndex, columnIndex }) => (
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
        scrollTop: 50,
        scrollLeft: 50,
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
        rowCount={2}
        columnCount={2}
        renderItem={({ rowIndex, columnIndex }) => (
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
        renderItem={({ rowIndex, columnIndex }) => (
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
    const gridRef = createRef<Grid>();

    render(
      <VirtualGrid
        rowCount={1}
        columnCount={1}
        renderItem={({ rowIndex, columnIndex }) => (
          <div>{`Item ${rowIndex}-${columnIndex}`}</div>
        )}
        ref={gridRef}
      />,
    );

    expect(gridRef.current).toBeDefined();
    expect(typeof gridRef.current?.scrollToPosition).toBe('function');
  });

  it('uses correct keyMapper function', () => {
    const cacheRef = createRef<any>();

    render(
      <VirtualGrid
        rowCount={1}
        columnCount={1}
        renderItem={({ rowIndex, columnIndex }) => (
          <div>{`Item ${rowIndex}-${columnIndex}`}</div>
        )}
        cacheRef={cacheRef}
      />,
    );

    const keyMapper = cacheRef.current.getKeyMapper();
    expect(keyMapper).toBeDefined();

    // 测试不同的行列组合
    expect(keyMapper(0, 0)).toBe('0-0');
    expect(keyMapper(1, 2)).toBe('1-2');
    expect(keyMapper(2, 1)).toBe('2-1');
    expect(keyMapper(10, 20)).toBe('10-20');
  });
});
