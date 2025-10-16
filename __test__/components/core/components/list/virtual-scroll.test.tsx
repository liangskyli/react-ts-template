import React, { createRef } from 'react';
import { act, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { VirtualScrollListProps } from '@/components/core/components/list/virtual-scroll.tsx';
import VirtualScrollList from '@/components/core/components/list/virtual-scroll.tsx';

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
      scrollToRow,
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
          scrollToCell: vi.fn(),
          measureAllCells: vi.fn(),
          recomputeGridSize: vi.fn(),
          getCache: vi.fn(),
        }),
        [mockScrollToPosition],
      );

      return (
        <div role="grid" data-testid="virtualized-grid">
          <div data-testid="scrollToIndex">{scrollToRow}</div>
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

describe('VirtualScrollList Component', () => {
  it('renders correctly with children array', () => {
    render(
      <VirtualScrollList
        rowCount={3}
        renderItem={(index) => <div key={index}>Item {index + 1}</div>}
        virtualScrollToIndex={undefined}
      />,
    );

    expect(screen.getByTestId('virtualized-grid')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });

  it('handles scrollToIndex correctly', () => {
    render(
      <VirtualScrollList
        rowCount={2}
        renderItem={(index) => <div key={index}>Item {index + 1}</div>}
        virtualScrollToIndex={5}
      />,
    );

    expect(screen.getByTestId('scrollToIndex').textContent).toBe('5');
  });

  it('calls getPositionCache when scrolling', async () => {
    const getPositionCache = vi.fn();

    render(
      <VirtualScrollList
        rowCount={2}
        renderItem={(index) => <div key={index}>Item {index + 1}</div>}
        virtualScrollToIndex={undefined}
        getPositionCache={getPositionCache}
      />,
    );

    // 模拟 OnSectionRendered 回调
    await act(async () => {
      (global as any).__virtualizedGridOnSectionRendered({
        rowStartIndex: 0,
        rowStopIndex: 1,
      });
    });

    // 模拟滚动事件
    await act(async () => {
      (global as any).__virtualizedGridOnScroll({
        scrollTop: 50,
        clientHeight: 400,
        scrollHeight: 1000,
      });
    });

    // 第二次滚动事件，这次应该会调用 getPositionCache
    await act(async () => {
      (global as any).__virtualizedGridOnScroll({
        scrollTop: 100,
        clientHeight: 400,
        scrollHeight: 1000,
      });
    });

    // 验证 getPositionCache 被调用
    expect(getPositionCache).toHaveBeenCalledWith({
      scrollTop: 0,
      startIndex: 0,
      stopIndex: 1,
    });
  });

  it('sets up ref correctly', () => {
    const virtualizedListRef: VirtualScrollListProps['ref'] = createRef();

    render(
      <VirtualScrollList
        rowCount={1}
        renderItem={(index) => <div key={index}>Item {index + 1}</div>}
        virtualScrollToIndex={undefined}
        ref={virtualizedListRef}
      />,
    );

    // 验证 virtualizedListRef.current 有正确的值
    expect(virtualizedListRef.current).toBeDefined();
    expect(typeof virtualizedListRef.current?.scrollToPosition).toBe(
      'function',
    );
    expect(typeof virtualizedListRef.current?.scrollToCell).toBe('function');
    expect(typeof virtualizedListRef.current?.measureAllCells).toBe('function');
    expect(typeof virtualizedListRef.current?.recomputeGridSize).toBe(
      'function',
    );
    expect(typeof virtualizedListRef.current?.getCache).toBe('function');
  });

  it('handles virtualConfig correctly', () => {
    const virtualConfig = {
      defaultHeight: 60,
      minHeight: 40,
      scrollToAlignment: 'start' as const,
    };

    render(
      <VirtualScrollList
        rowCount={1}
        renderItem={(index) => <div key={index}>Item {index + 1}</div>}
        virtualScrollToIndex={undefined}
        virtualConfig={virtualConfig}
      />,
    );

    expect(screen.getByTestId('virtualized-grid')).toBeInTheDocument();
  });

  it('sets up virtualizedListRef correctly', () => {
    const virtualizedListRef: VirtualScrollListProps['ref'] = createRef();

    render(
      <VirtualScrollList
        rowCount={1}
        renderItem={(index) => <div key={index}>Item {index + 1}</div>}
        virtualScrollToIndex={undefined}
        ref={virtualizedListRef}
      />,
    );

    // 验证 virtualizedListRef.current 有正确的值
    expect(virtualizedListRef.current).toBeDefined();
    expect(typeof virtualizedListRef.current?.scrollToPosition).toBe(
      'function',
    );
  });

  it('calls scrollToPosition method', async () => {
    const virtualizedListRef: VirtualScrollListProps['ref'] = createRef();

    render(
      <VirtualScrollList
        rowCount={1}
        renderItem={(index) => <div key={index}>Item {index + 1}</div>}
        virtualScrollToIndex={undefined}
        ref={virtualizedListRef}
      />,
    );

    // 验证ref被正确设置并且方法存在
    expect(virtualizedListRef.current).toBeDefined();
    expect(typeof virtualizedListRef.current?.scrollToPosition).toBe(
      'function',
    );

    // 调用 scrollToPosition 方法不应该抛出错误
    await act(async () => {
      virtualizedListRef.current?.scrollToPosition({
        scrollTop: 200,
        scrollLeft: 0,
      });
    });

    // 验证方法被调用（这里我们只验证没有抛出错误）
    expect(virtualizedListRef.current?.scrollToPosition).toBeDefined();
  });

  it('handles empty children array', () => {
    const { container } = render(
      <VirtualScrollList
        rowCount={0}
        renderItem={(index) => <div key={index}>Item {index + 1}</div>}
        virtualScrollToIndex={undefined}
      />,
    );

    // 当rowCount为0时，VirtualGrid不会渲染Grid组件，只会渲染容器
    expect(container.querySelector('.relative')).toBeInTheDocument();
  });

  it('handles undefined virtualScrollToIndex', () => {
    render(
      <VirtualScrollList
        rowCount={1}
        renderItem={(index) => <div key={index}>Item {index + 1}</div>}
        virtualScrollToIndex={undefined}
      />,
    );

    expect(screen.getByTestId('scrollToIndex').textContent).toBe('');
  });

  it('handles zero virtualScrollToIndex', () => {
    render(
      <VirtualScrollList
        rowCount={1}
        renderItem={(index) => <div key={index}>Item {index + 1}</div>}
        virtualScrollToIndex={0}
      />,
    );

    expect(screen.getByTestId('scrollToIndex').textContent).toBe('0');
  });
});
