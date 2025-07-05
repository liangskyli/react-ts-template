import React, { createRef } from 'react';
import { act, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import VirtualScrollList from '@/components/core/components/list/virtual-scroll.tsx';
import type { VirtualizedList } from '@/components/core/components/list/virtual-scroll.tsx';

/* eslint-disable @typescript-eslint/no-explicit-any */

// 模拟 react-virtualized
vi.mock('react-virtualized', () => {
  return {
    AutoSizer: ({ children }: any) => children({ width: 400, height: 400 }),
    List: function MockList({
      onScroll,
      rowRenderer,
      rowCount,
      ref,
      scrollToIndex,
      onRowsRendered,
    }: any) {
      // 存储 onScroll 回调，以便测试可以直接调用
      (global as any).__virtualizedListOnScroll = onScroll;
      (global as any).__virtualizedListOnRowsRendered = onRowsRendered;

      // 创建一个模拟的 scrollToPosition 方法
      const mockScrollToPosition = vi.fn();
      (global as any).__virtualizedListScrollToPosition = mockScrollToPosition;

      // 使用 useImperativeHandle 来模拟 ref 的行为
      React.useImperativeHandle(
        ref,
        () => ({
          scrollToPosition: mockScrollToPosition,
        }),
        [],
      );

      return (
        <div role="grid" data-testid="virtualized-list">
          <>
            <div data-testid="scrollToIndex">{scrollToIndex}</div>
            {Array.from({ length: rowCount }).map((_, index) =>
              rowRenderer({ index, key: index, style: {} }),
            )}
          </>
        </div>
      );
    },
    CellMeasurer: ({ children }: any) =>
      children({ registerChild: (ref: unknown) => ref }),
    CellMeasurerCache: class MockCellMeasurerCache {
      constructor() {
        // 模拟构造函数
      }

      clearAll() {}
      clear(rowIndex: number, columnIndex: number) {
        // 模拟 clear 方法，可以在这里添加断言或记录调用
        (global as any).__lastClearCall = { rowIndex, columnIndex };
      }
      rowHeight() {
        return 50;
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

    expect(screen.getByTestId('virtualized-list')).toBeInTheDocument();
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

    // 模拟 onRowsRendered 回调
    await act(async () => {
      (global as any).__virtualizedListOnRowsRendered({
        startIndex: 0,
        stopIndex: 1,
      });
    });

    // 模拟滚动事件
    await act(async () => {
      (global as any).__virtualizedListOnScroll({
        scrollTop: 50,
        clientHeight: 400,
        scrollHeight: 1000,
      });
    });

    // 第二次滚动事件，这次应该会调用 getPositionCache
    await act(async () => {
      (global as any).__virtualizedListOnScroll({
        scrollTop: 100,
        clientHeight: 400,
        scrollHeight: 1000,
      });
    });

    // 验证 getPositionCache 被调用
    expect(getPositionCache).toHaveBeenCalledWith({
      scrollTop: 100,
      startIndex: 0,
      stopIndex: 1,
    });
  });

  it('sets up cacheRef correctly', () => {
    const cacheRef = createRef<any>();

    render(
      <VirtualScrollList
        rowCount={1}
        renderItem={(index) => <div key={index}>Item {index + 1}</div>}
        virtualScrollToIndex={undefined}
        cacheRef={cacheRef}
      />,
    );

    // 验证 cacheRef.current 有正确的值
    expect(cacheRef.current).toBeDefined();
    expect(typeof cacheRef.current.clear).toBe('function');
    expect(typeof cacheRef.current.clearAll).toBe('function');
    expect(typeof cacheRef.current.rowHeight).toBe('function');
  });

  it('calls cache clear method', async () => {
    const cacheRef = createRef<any>();

    render(
      <VirtualScrollList
        rowCount={1}
        renderItem={(index) => <div key={index}>Item {index + 1}</div>}
        virtualScrollToIndex={undefined}
        cacheRef={cacheRef}
      />,
    );

    // 调用 cache 的 clear 方法
    await act(async () => {
      cacheRef.current?.clear(1, 0);
    });

    // 验证 clear 方法被调用
    expect((global as any).__lastClearCall).toEqual({
      rowIndex: 1,
      columnIndex: 0,
    });
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

    expect(screen.getByTestId('virtualized-list')).toBeInTheDocument();
  });

  it('sets up virtualizedListRef correctly', () => {
    const virtualizedListRef = createRef<VirtualizedList>();

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
    const virtualizedListRef = createRef<VirtualizedList>();

    render(
      <VirtualScrollList
        rowCount={1}
        renderItem={(index) => <div key={index}>Item {index + 1}</div>}
        virtualScrollToIndex={undefined}
        ref={virtualizedListRef}
      />,
    );

    // 调用 scrollToPosition 方法
    await act(async () => {
      virtualizedListRef.current?.scrollToPosition(200);
    });

    // 验证 scrollToPosition 被调用
    expect(
      (global as any).__virtualizedListScrollToPosition,
    ).toHaveBeenCalledWith(200);
  });

  it('handles empty children array', () => {
    render(
      <VirtualScrollList
        rowCount={0}
        renderItem={(index) => <div key={index}>Item {index + 1}</div>}
        virtualScrollToIndex={undefined}
      />,
    );

    expect(screen.getByTestId('virtualized-list')).toBeInTheDocument();
    expect(screen.getByTestId('scrollToIndex').textContent).toBe('');
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
