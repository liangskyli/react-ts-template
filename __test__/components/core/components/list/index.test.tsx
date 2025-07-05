import { createRef, useImperativeHandle } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ListRef } from '@/components/core/components/list';
import List from '@/components/core/components/list';
import * as getScrollParentModule from '@/components/core/utils/get-scroll-parent.ts';

/* eslint-disable @typescript-eslint/no-explicit-any */

// 模拟 VirtualScrollList
vi.mock('@/components/core/components/list/virtual-scroll.tsx', () => {
  return {
    default: function MockVirtualScrollList({
      cacheRef,
      rowCount,
      renderItem,
      virtualScrollToIndex,
      ref,
      getPositionCache,
    }: any) {
      // 创建一个 mock cache 实例
      const mockCache = {
        clearAll: vi.fn(),
        clear: vi.fn((rowIndex: number, columnIndex: number) => {
          (global as any).__lastClearCall = { rowIndex, columnIndex };
        }),
        rowHeight: vi.fn(() => 50),
      };

      // 使用 useImperativeHandle 来设置 cacheRef.current
      useImperativeHandle(cacheRef, () => mockCache, []);

      // 创建一个模拟的 scrollToPosition 方法
      const mockScrollToPosition = vi.fn();
      (global as any).__virtualizedListScrollToPosition = mockScrollToPosition;

      // 使用 useImperativeHandle 来设置 ref
      useImperativeHandle(
        ref,
        () => ({
          scrollToPosition: mockScrollToPosition,
        }),
        [],
      );

      // 模拟滚动事件处理
      const handleScroll = (scrollTop: number) => {
        if (getPositionCache) {
          getPositionCache({
            scrollTop,
            startIndex: 0,
            stopIndex: rowCount - 1,
          });
        }
      };

      // 存储滚动处理函数供测试使用
      (global as any).__virtualScrollOnScroll = handleScroll;

      const list = Array(rowCount).fill('');

      return (
        <div data-testid="virtual-scroll-list">
          <div data-testid="virtualScrollToIndex">{virtualScrollToIndex}</div>
          {list.map((_child, index) => {
            return <div key={index}>{renderItem(index)}</div>;
          })}
        </div>
      );
    },
  };
});

// 模拟 react-virtualized
vi.mock('react-virtualized', () => {
  return {
    AutoSizer: ({ children }: any) => children({ width: 400, height: 400 }),
    List: function MockList({
      rowRenderer,
      rowCount,
      ref,
      scrollToIndex,
    }: any) {
      // 创建一个模拟的 scrollToPosition 方法
      (global as any).__virtualizedListScrollToPosition = vi.fn();

      // 使用 useImperativeHandle 来模拟 ref 的行为
      useImperativeHandle(
        ref,
        () => ({
          scrollToPosition: (global as any).__virtualizedListScrollToPosition,
        }),
        [],
      );

      return (
        <div role="grid" data-testid="virtualized-list">
          <>
            <div data-testid="virtualScrollToIndex">{scrollToIndex}</div>
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

describe('List Component', () => {
  it('renders basic list correctly', () => {
    render(
      <List>
        <List.Item title="Item 1" description="Description 1" />
        <List.Item title="Item 2" description="Description 2" />
      </List>,
    );

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Description 2')).toBeInTheDocument();
  });

  it('renders list with custom className', () => {
    const { container } = render(
      <List className="custom-class">
        <List.Item title="Item 1" />
      </List>,
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders list items with prefix and suffix', () => {
    render(
      <List>
        <List.Item
          title="Item with prefix and suffix"
          prefix={<div data-testid="prefix">Prefix</div>}
          suffix={<div data-testid="suffix">Suffix</div>}
        />
      </List>,
    );

    expect(screen.getByTestId('prefix')).toBeInTheDocument();
    expect(screen.getByTestId('suffix')).toBeInTheDocument();
  });

  it('handles clickable list items', () => {
    const handleClick = vi.fn();

    render(
      <List>
        <List.Item
          title="Clickable Item"
          clickable
          onClick={handleClick}
          data-testid="clickable-item"
        />
      </List>,
    );

    // 使用 data-testid 直接找到列表项元素
    const item = screen.getByTestId('clickable-item');
    expect(item).toHaveAttribute('data-clickable');

    fireEvent.click(item);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('handles disabled list items', () => {
    const handleClick = vi.fn();

    render(
      <List>
        <List.Item
          title="Disabled Item"
          clickable
          disabled
          onClick={handleClick}
          data-testid="disabled-item"
        />
      </List>,
    );

    // 使用 data-testid 直接找到列表项元素
    const item = screen.getByTestId('disabled-item');
    expect(item).toHaveAttribute('data-disabled');

    fireEvent.click(item);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('renders list items with custom content', () => {
    render(
      <List>
        <List.Item>
          <div data-testid="custom-content">Custom Content</div>
        </List.Item>
      </List>,
    );

    expect(screen.getByTestId('custom-content')).toBeInTheDocument();
  });

  it('renders virtualized list correctly', () => {
    const items = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      title: `Item ${i}`,
      description: `Description ${i}`,
    }));

    render(
      <List virtualScroll list={items}>
        {(listData) => {
          return listData.map((item) => (
            <List.Item
              key={item.id}
              title={item.title}
              description={item.description}
            />
          ));
        }}
      </List>,
    );

    // 验证虚拟滚动列表被渲染
    expect(screen.getByTestId('virtual-scroll-list')).toBeInTheDocument();

    // 验证列表项被渲染
    expect(screen.getByText('Item 1')).toBeInTheDocument();
  });

  it('renders virtualized list error with not children function', () => {
    const items = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      title: `Item ${i}`,
      description: `Description ${i}`,
    }));

    render(
      <List virtualScroll>
        {items.map((item) => (
          <>
            <List.Item
              key={item.id}
              title={item.title}
              description={item.description}
            />
          </>
        ))}
      </List>,
    );

    // 验证虚拟滚动列表被渲染
    expect(screen.getByTestId('virtual-scroll-list')).toBeInTheDocument();

    // 验证列表项没有渲染
    expect(screen.queryByText('Item 1')).toBeNull();
  });

  it('renders virtualized list with infinite scroll correctly', () => {
    const loadMore = vi.fn().mockResolvedValue(undefined);

    render(
      <List
        virtualScroll
        infiniteScroll={{
          loadMore,
          hasMore: true,
        }}
        list={['Item 1', 'Item 2']}
      >
        {(listData) => {
          return listData.map((i) => <List.Item key={i} title={i} />);
        }}
      </List>,
    );

    // 验证虚拟滚动列表被渲染
    expect(screen.getByTestId('virtual-scroll-list')).toBeInTheDocument();
    // 验证列表项被渲染
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('applies correct styles to list items', () => {
    render(
      <List>
        <List.Item
          title="Styled Item"
          className="custom-item-class"
          data-testid="styled-item"
        />
      </List>,
    );

    const item = screen.getByTestId('styled-item');
    expect(item).toHaveClass('custom-item-class');
    expect(item).toHaveClass('flex');
    expect(item).toHaveClass('items-center');
  });

  it('correctly handles item click events', () => {
    const handleClick1 = vi.fn();
    const handleClick2 = vi.fn();

    render(
      <List>
        <List.Item
          title="First Clickable"
          clickable
          onClick={handleClick1}
          data-testid="first-clickable"
        />
        <List.Item
          title="Second Clickable"
          clickable
          onClick={handleClick2}
          data-testid="second-clickable"
        />
      </List>,
    );

    // 点击第一个项目
    fireEvent.click(screen.getByTestId('first-clickable'));
    expect(handleClick1).toHaveBeenCalledTimes(1);
    expect(handleClick2).not.toHaveBeenCalled();

    // 点击第二个项目
    fireEvent.click(screen.getByTestId('second-clickable'));
    expect(handleClick1).toHaveBeenCalledTimes(1);
    expect(handleClick2).toHaveBeenCalledTimes(1);
  });
});

describe('List InfiniteScroll', () => {
  // 添加测试以验证加载状态
  it('should show loading state during loadMore', async () => {
    const loadMore = vi
      .fn()
      .mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

    // 创建一个模拟的滚动容器
    const mockScrollContainer = document.createElement('div');
    Object.defineProperties(mockScrollContainer, {
      clientHeight: { value: 200, configurable: true },
      scrollHeight: { value: 1000, configurable: true },
      scrollTop: { value: 0, configurable: true },
    });

    // 在渲染前就模拟 getScrollParent 函数
    vi.spyOn(getScrollParentModule, 'getScrollParent').mockReturnValue(
      mockScrollContainer,
    );

    render(
      <List
        infiniteScroll={{
          loadMore,
          hasMore: true,
          threshold: 100,
        }}
        list={['Item 1']}
      >
        {(listData) => {
          return listData.map((i) => <List.Item key={i} title={i} />);
        }}
      </List>,
    );

    // 触发滚动事件
    await act(async () => {
      const scrollEvent = new Event('scroll');
      Object.defineProperties(mockScrollContainer, {
        clientHeight: { value: 200, configurable: true },
        scrollHeight: { value: 1000, configurable: true },
        scrollTop: { value: 750, configurable: true },
      });
      mockScrollContainer.dispatchEvent(scrollEvent);
    });

    // 验证加载状态
    expect(screen.getByText('加载中...')).toBeInTheDocument();
  });

  it('should show no more state during loadMore', async () => {
    const loadMore = vi
      .fn()
      .mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

    // 创建一个模拟的滚动容器
    const mockScrollContainer = document.createElement('div');
    Object.defineProperties(mockScrollContainer, {
      clientHeight: { value: 200, configurable: true },
      scrollHeight: { value: 1000, configurable: true },
      scrollTop: { value: 0, configurable: true },
    });

    // 在渲染前就模拟 getScrollParent 函数
    vi.spyOn(getScrollParentModule, 'getScrollParent').mockReturnValue(
      mockScrollContainer,
    );

    render(
      <List
        infiniteScroll={{
          loadMore,
          hasMore: false,
          threshold: 100,
        }}
        list={['Item 1']}
      >
        {(listData) => {
          return listData.map((i) => <List.Item key={i} title={i} />);
        }}
      </List>,
    );

    // 触发滚动事件
    await act(async () => {
      const scrollEvent = new Event('scroll');
      Object.defineProperties(mockScrollContainer, {
        clientHeight: { value: 200, configurable: true },
        scrollHeight: { value: 1000, configurable: true },
        scrollTop: { value: 750, configurable: true },
      });
      mockScrollContainer.dispatchEvent(scrollEvent);
    });

    expect(screen.getByText('没有更多数据了')).toBeInTheDocument();
  });

  // 验证边界情况
  it('should respect threshold value', async () => {
    const loadMore = vi.fn().mockResolvedValue(undefined);
    const threshold = 50;

    // 创建一个模拟的滚动容器
    const mockScrollContainer = document.createElement('div');
    Object.defineProperties(mockScrollContainer, {
      clientHeight: { value: 200, configurable: true },
      scrollHeight: { value: 1000, configurable: true },
      scrollTop: { value: 0, configurable: true },
    });
    // 在渲染前就模拟 getScrollParent 函数
    vi.spyOn(getScrollParentModule, 'getScrollParent').mockReturnValue(
      mockScrollContainer,
    );

    render(
      <List
        infiniteScroll={{
          loadMore,
          hasMore: true,
          threshold,
        }}
        list={['Item 1']}
      >
        {(listData) => {
          return listData.map((i) => <List.Item key={i} title={i} />);
        }}
      </List>,
    );

    // 不应该触发加载（距离底部还很远）
    await act(async () => {
      const scrollEvent = new Event('scroll');
      Object.defineProperties(mockScrollContainer, {
        clientHeight: { value: 200, configurable: true },
        scrollHeight: { value: 1000, configurable: true },
        scrollTop: { value: 500, configurable: true },
      });
      mockScrollContainer.dispatchEvent(scrollEvent);
    });

    expect(loadMore).not.toHaveBeenCalled();

    // 应该触发加载（达到阈值）
    await act(async () => {
      const scrollEvent = new Event('scroll');
      Object.defineProperties(mockScrollContainer, {
        clientHeight: { value: 200, configurable: true },
        scrollHeight: { value: 1000, configurable: true },
        scrollTop: { value: 750, configurable: true },
      });
      mockScrollContainer.dispatchEvent(scrollEvent);
    });

    expect(loadMore).toHaveBeenCalledWith(false);
  });

  it('handles retry after failure', async () => {
    const loadMore = vi
      .fn()
      .mockRejectedValueOnce(new Error('Failed to load'))
      .mockResolvedValueOnce(undefined);

    // 创建一个模拟的滚动容器
    const mockScrollContainer = document.createElement('div');
    Object.defineProperties(mockScrollContainer, {
      clientHeight: { value: 200, configurable: true },
      scrollHeight: { value: 1000, configurable: true },
      scrollTop: { value: 0, configurable: true },
    });

    // 在渲染前就模拟 getScrollParent 函数
    vi.spyOn(getScrollParentModule, 'getScrollParent').mockReturnValue(
      mockScrollContainer,
    );

    render(
      <List
        infiniteScroll={{
          loadMore,
          hasMore: true,
        }}
        list={['Item 1']}
      >
        {(listData) => {
          return listData.map((i) => <List.Item key={i} title={i} />);
        }}
      </List>,
    );

    // 触发滚动事件
    await act(async () => {
      const scrollEvent = new Event('scroll');
      Object.defineProperties(mockScrollContainer, {
        clientHeight: { value: 200, configurable: true },
        scrollHeight: { value: 1000, configurable: true },
        scrollTop: { value: 750, configurable: true },
      });
      mockScrollContainer.dispatchEvent(scrollEvent);
    });

    // 查找并点击重试按钮
    const retryButton = await screen.findByText('重新加载');
    expect(retryButton).toBeInTheDocument();

    // 点击重试按钮
    await act(async () => {
      fireEvent.click(retryButton);
    });

    // 验证调用
    expect(loadMore).toHaveBeenCalledTimes(2);
    expect(loadMore.mock.calls).toEqual([
      [false], // 初始加载
      [true], // 重试
    ]);
  });

  it('clears cache after successful load more', async () => {
    const loadMore = vi.fn().mockResolvedValue(undefined);

    // 创建一个模拟的滚动容器
    const mockScrollContainer = document.createElement('div');
    Object.defineProperties(mockScrollContainer, {
      clientHeight: { value: 200, configurable: true },
      scrollHeight: { value: 1000, configurable: true },
      scrollTop: { value: 0, configurable: true },
    });

    // 在渲染前就模拟 getScrollParent 函数
    vi.spyOn(getScrollParentModule, 'getScrollParent').mockReturnValue(
      mockScrollContainer,
    );

    render(
      <List
        virtualScroll
        infiniteScroll={{
          loadMore,
          hasMore: true,
          threshold: 100,
        }}
        list={['Item 1']}
      >
        {(listData) => {
          return listData.map((i) => <List.Item key={i} title={i} />);
        }}
      </List>,
    );

    // 触发滚动事件
    await act(async () => {
      const scrollEvent = new Event('scroll');
      Object.defineProperties(mockScrollContainer, {
        clientHeight: { value: 200, configurable: true },
        scrollHeight: { value: 1000, configurable: true },
        scrollTop: { value: 750, configurable: true },
      });
      mockScrollContainer.dispatchEvent(scrollEvent);
    });

    expect(loadMore).toHaveBeenCalledWith(false);

    // 等待 loadMore 完成，这样 loadMoreFinally 才会被调用
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // 验证 cache clear 是否被调用
    expect((global as any).__lastClearCall).toEqual({
      rowIndex: 1, // childrenArray.length - 1 = 2 - 1 = 1
      columnIndex: 0,
    });
  });

  it('renders custom infinite scroll content', () => {
    const customContent = vi.fn().mockReturnValue(<div>Custom Loading</div>);

    render(
      <List
        infiniteScroll={{
          loadMore: vi.fn(),
          hasMore: true,
          children: customContent,
        }}
        list={['Item 1']}
      >
        {(listData) => {
          return listData.map((i) => <List.Item key={i} title={i} />);
        }}
      </List>,
    );

    expect(screen.getByText('Custom Loading')).toBeInTheDocument();
    expect(customContent).toHaveBeenCalledWith({
      hasMore: true,
      failed: false,
      retry: expect.any(Function),
    });
  });

  it('does not trigger loadMore when already loading', async () => {
    const loadMore = vi
      .fn()
      .mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

    // 创建一个模拟的滚动容器
    const mockScrollContainer = document.createElement('div');
    Object.defineProperties(mockScrollContainer, {
      clientHeight: { value: 200, configurable: true },
      scrollHeight: { value: 1000, configurable: true },
      scrollTop: { value: 0, configurable: true },
    });

    // 在渲染前就模拟 getScrollParent 函数
    vi.spyOn(getScrollParentModule, 'getScrollParent').mockReturnValue(
      mockScrollContainer,
    );

    render(
      <List
        infiniteScroll={{
          loadMore,
          hasMore: true,
        }}
        list={['Item 1']}
      >
        {(listData) => {
          return listData.map((i) => <List.Item key={i} title={i} />);
        }}
      </List>,
    );

    // 触发多次滚动
    await act(async () => {
      const scrollEvent = new Event('scroll');
      Object.defineProperties(mockScrollContainer, {
        clientHeight: { value: 200, configurable: true },
        scrollHeight: { value: 1000, configurable: true },
        scrollTop: { value: 750, configurable: true },
      });
      mockScrollContainer.dispatchEvent(scrollEvent);
      mockScrollContainer.dispatchEvent(scrollEvent);
      mockScrollContainer.dispatchEvent(scrollEvent);
    });
    expect(loadMore).toHaveBeenCalledTimes(1);
  });

  it('no children', async () => {
    const loadMore = vi
      .fn()
      .mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

    // 创建一个模拟的滚动容器
    const mockScrollContainer = document.createElement('div');
    Object.defineProperties(mockScrollContainer, {
      clientHeight: { value: 200, configurable: true },
      scrollHeight: { value: 1000, configurable: true },
      scrollTop: { value: 0, configurable: true },
    });

    // 在渲染前就模拟 getScrollParent 函数
    vi.spyOn(getScrollParentModule, 'getScrollParent').mockReturnValue(
      mockScrollContainer,
    );

    render(
      // @ts-expect-error test
      <List
        infiniteScroll={{
          loadMore,
          hasMore: true,
        }}
      ></List>,
    );

    // 触发滚动事件
    await act(async () => {
      const scrollEvent = new Event('scroll');
      Object.defineProperties(mockScrollContainer, {
        clientHeight: { value: 200, configurable: true },
        scrollHeight: { value: 1000, configurable: true },
        scrollTop: { value: 750, configurable: true },
      });
      mockScrollContainer.dispatchEvent(scrollEvent);
    });
    expect(loadMore).toHaveBeenCalledTimes(0);
    expect(screen.queryByText('加载中...')).not.toBeInTheDocument();
  });
});

describe('List ref methods', () => {
  it('scrollToPosition works with virtualScroll enabled', async () => {
    const ref = createRef<ListRef>();

    render(
      <List ref={ref} virtualScroll={true} list={['Item 1', 'Item 2']}>
        {(listData) =>
          listData.map((item) => <List.Item key={item} title={item} />)
        }
      </List>,
    );

    // Call the ref method
    ref.current?.scrollToPosition(100);

    // Verify the virtual list's scrollToPosition was called
    expect(
      (global as any).__virtualizedListScrollToPosition,
    ).toHaveBeenLastCalledWith(100);
  });

  it('scrollToPosition works with virtualScroll disabled', async () => {
    const ref = createRef<ListRef>();

    render(
      <List ref={ref} virtualScroll={false} list={['Item 1', 'Item 2']}>
        {(listData) =>
          listData.map((item) => <List.Item key={item} title={item} />)
        }
      </List>,
    );

    // Call the ref method
    ref.current?.scrollToPosition(100);

    // 等待 setTimeout 执行完成
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Verify scrollTop was set
    expect(screen.getByRole('list').scrollTop).toBe(100);
  });

  it('virtualScrollToIndex works with virtualScroll enabled', async () => {
    const ref = createRef<ListRef>();

    render(
      <List ref={ref} virtualScroll={{}} list={['Item 1', 'Item 2']}>
        {(listData) =>
          listData.map((item) => <List.Item key={item} title={item} />)
        }
      </List>,
    );

    // Call the ref method
    await act(async () => {
      ref.current?.virtualScrollToIndex(5);
    });

    expect(screen.getByTestId('virtualScrollToIndex').textContent).toBe('5');
  });

  it('virtualScrollToIndex does nothing with virtualScroll disabled', async () => {
    const ref = createRef<ListRef>();

    render(
      <List ref={ref} virtualScroll={false} list={['Item 1', 'Item 2']}>
        {(listData) =>
          listData.map((item) => <List.Item key={item} title={item} />)
        }
      </List>,
    );

    // Call the ref method
    await act(async () => {
      ref.current?.virtualScrollToIndex(5);
    });

    expect(
      screen.queryByTestId('virtualScrollToIndex'),
    ).not.toBeInTheDocument();
  });
});
describe('getPositionCache methods', () => {
  it('calls getPositionCache in virtual scroll mode', async () => {
    const getPositionCache = vi.fn();

    render(
      <List
        virtualScroll
        getPositionCache={getPositionCache}
        list={['Item 1', 'Item 2', 'Item 3']}
      >
        {(listData) => {
          return listData.map((i) => <List.Item key={i} title={i} />);
        }}
      </List>,
    );

    // 模拟虚拟滚动的滚动事件
    await act(async () => {
      (global as any).__virtualScrollOnScroll(500);
    });

    // 验证 getPositionCache 被调用
    expect(getPositionCache).toHaveBeenCalledWith({
      scrollTop: 500,
      startIndex: 0,
      stopIndex: 2, // childrenArray.length - 1 = 3 - 1 = 2
    });
  });

  it('calls getPositionCache in non-virtual scroll mode', async () => {
    const getPositionCache = vi.fn();

    render(
      <List
        virtualScroll={false}
        getPositionCache={getPositionCache}
        list={['Item 1', 'Item 2']}
      >
        {(listData) => {
          return listData.map((i) => <List.Item key={i} title={i} />);
        }}
      </List>,
    );

    const list = screen.getByRole('list');

    // 触发滚动事件
    await act(async () => {
      const scrollEvent = new Event('scroll');
      Object.defineProperties(list, {
        scrollTop: { value: 300, configurable: true },
      });
      list.dispatchEvent(scrollEvent);
    });

    // 验证 getPositionCache 被调用
    expect(getPositionCache).toHaveBeenCalledWith({
      scrollTop: 300,
    });
  });
});
