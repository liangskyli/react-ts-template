import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import List from '@/components/core/components/list';

/* eslint-disable @typescript-eslint/no-explicit-any */

// 模拟 react-virtualized
vi.mock('react-virtualized', () => {
  return {
    AutoSizer: ({ children }: any) => children({ width: 400, height: 400 }),
    List: ({ onScroll, rowRenderer, rowCount }: any) => {
      // 存储 onScroll 回调，以便测试可以直接调用
      (global as any).__listOnScroll = onScroll;

      return (
        <div role="grid" data-testid="virtualized-list">
          {Array.from({ length: rowCount }).map((_, index) =>
            rowRenderer({ index, key: index, style: {} }),
          )}
        </div>
      );
    },
    CellMeasurer: ({ children }: any) =>
      children({ registerChild: (ref: unknown) => ref }),
    CellMeasurerCache: class {
      clearAll() {}
      clear() {}
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
      <List virtualScroll>
        {items.map((item) => (
          <List.Item
            key={item.id}
            title={item.title}
            description={item.description}
          />
        ))}
      </List>,
    );

    // 验证虚拟列表被渲染
    expect(screen.getByTestId('virtualized-list')).toBeInTheDocument();
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
    expect(item).toHaveClass('border-b');
  });

  it('renders the last item without bottom border', () => {
    render(
      <List>
        <List.Item title="First Item" data-testid="first-item" />
        <List.Item title="Last Item" data-testid="last-item" />
      </List>,
    );

    const lastItem = screen.getByTestId('last-item');
    expect(lastItem).toHaveClass('last:border-b-0');
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
  it('should call loadMore when scrolling near bottom', async () => {
    const loadMore = vi.fn().mockResolvedValue(undefined);

    render(
      <List
        infiniteScroll={{
          loadMore,
          hasMore: true,
          threshold: 100,
        }}
      >
        {Array.from({ length: 20 }, (_, i) => (
          <List.Item key={i} title={`Item ${i}`} />
        ))}
      </List>,
    );

    const list = screen.getByRole('list');

    await act(async () => {
      const scrollEvent = new Event('scroll');
      Object.defineProperties(list, {
        clientHeight: { value: 200, configurable: true },
        scrollHeight: { value: 1000, configurable: true },
        scrollTop: { value: 750, configurable: true },
      });
      list.dispatchEvent(scrollEvent);
    });

    expect(loadMore).toHaveBeenCalledWith(false);
  });

  // 添加测试以验证加载状态
  it('should show loading state during loadMore', async () => {
    const loadMore = vi
      .fn()
      .mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

    render(
      <List
        infiniteScroll={{
          loadMore,
          hasMore: true,
          threshold: 100,
        }}
      >
        <List.Item title="Item 1" />
      </List>,
    );

    const list = screen.getByRole('list');

    await act(async () => {
      const scrollEvent = new Event('scroll');
      Object.defineProperties(list, {
        clientHeight: { value: 200, configurable: true },
        scrollHeight: { value: 1000, configurable: true },
        scrollTop: { value: 750, configurable: true },
      });
      list.dispatchEvent(scrollEvent);
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

    render(
      <List
        infiniteScroll={{
          loadMore,
          hasMore: false,
          threshold: 100,
        }}
      >
        <List.Item title="Item 1" />
      </List>,
    );

    const list = screen.getByRole('list');

    await act(async () => {
      const scrollEvent = new Event('scroll');
      Object.defineProperties(list, {
        clientHeight: { value: 200, configurable: true },
        scrollHeight: { value: 1000, configurable: true },
        scrollTop: { value: 750, configurable: true },
      });
      list.dispatchEvent(scrollEvent);
    });

    expect(screen.getByText('没有更多数据了')).toBeInTheDocument();
  });

  // 验证边界情况
  it('should respect threshold value', async () => {
    const loadMore = vi.fn().mockResolvedValue(undefined);
    const threshold = 50;

    render(
      <List
        infiniteScroll={{
          loadMore,
          hasMore: true,
          threshold,
        }}
      >
        <List.Item title="Item 1" />
      </List>,
    );

    const list = screen.getByRole('list');

    // 不应该触发加载（距离底部还很远）
    await act(async () => {
      const scrollEvent = new Event('scroll');
      Object.defineProperties(list, {
        clientHeight: { value: 200, configurable: true },
        scrollHeight: { value: 1000, configurable: true },
        scrollTop: { value: 500, configurable: true },
      });
      list.dispatchEvent(scrollEvent);
    });

    expect(loadMore).not.toHaveBeenCalled();

    // 应该触发加载（达到阈值）
    await act(async () => {
      const scrollEvent = new Event('scroll');
      Object.defineProperties(list, {
        clientHeight: { value: 200, configurable: true },
        scrollHeight: { value: 1000, configurable: true },
        scrollTop: { value: 750, configurable: true },
      });
      list.dispatchEvent(scrollEvent);
    });

    expect(loadMore).toHaveBeenCalledWith(false);
  });

  it('handles retry after failure', async () => {
    const loadMore = vi
      .fn()
      .mockRejectedValueOnce(new Error('Failed to load'))
      .mockResolvedValueOnce(undefined);

    render(
      <List
        infiniteScroll={{
          loadMore,
          hasMore: true,
        }}
      >
        <List.Item title="Item 1" />
      </List>,
    );

    const list = screen.getByRole('list');

    // 触发滚动事件
    await act(async () => {
      Object.defineProperties(list, {
        clientHeight: { value: 200, configurable: true },
        scrollHeight: { value: 1000, configurable: true },
        scrollTop: { value: 750, configurable: true },
      });

      fireEvent.scroll(list);
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

    vi.restoreAllMocks();
  });

  it('clears cache after successful load more', async () => {
    const loadMore = vi.fn().mockResolvedValue(undefined);

    render(
      <List
        virtualScroll
        infiniteScroll={{
          loadMore,
          hasMore: true,
          threshold: 100,
        }}
      >
        <List.Item title="Item 1" />
      </List>,
    );

    // 直接调用存储的 onScroll 回调
    await act(async () => {
      (global as any).__listOnScroll({
        clientHeight: 400,
        scrollHeight: 1000,
        scrollTop: 500,
        clientWidth: 400,
        scrollWidth: 1000,
        scrollLeft: 0,
      });
    });

    expect(loadMore).toHaveBeenCalledWith(false);
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
      >
        <List.Item title="Item 1" />
      </List>,
    );

    expect(screen.getByText('Custom Loading')).toBeInTheDocument();
    expect(customContent).toHaveBeenCalledWith(
      true,
      false,
      expect.any(Function),
    );
  });

  it('does not trigger loadMore when already loading', async () => {
    const loadMore = vi
      .fn()
      .mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

    render(
      <List
        infiniteScroll={{
          loadMore,
          hasMore: true,
        }}
      >
        <>
          <List.Item title="Item 1" />
        </>
      </List>,
    );

    const list = screen.getByRole('list');

    // 触发多次滚动
    await act(async () => {
      const scrollEvent = new Event('scroll');
      Object.defineProperties(list, {
        clientHeight: { value: 200, configurable: true },
        scrollHeight: { value: 1000, configurable: true },
        scrollTop: { value: 750, configurable: true },
      });
      list.dispatchEvent(scrollEvent);
      list.dispatchEvent(scrollEvent);
      list.dispatchEvent(scrollEvent);
    });
    expect(loadMore).toHaveBeenCalledTimes(1);
  });

  it('no children', async () => {
    const loadMore = vi
      .fn()
      .mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

    render(
      <List
        infiniteScroll={{
          loadMore,
          hasMore: true,
        }}
      ></List>,
    );

    const list = screen.getByRole('list');

    await act(async () => {
      const scrollEvent = new Event('scroll');
      Object.defineProperties(list, {
        clientHeight: { value: 200, configurable: true },
        scrollHeight: { value: 1000, configurable: true },
        scrollTop: { value: 750, configurable: true },
      });
      list.dispatchEvent(scrollEvent);
    });
    expect(loadMore).toHaveBeenCalledTimes(1);
    expect(screen.getByText('加载中...')).toBeInTheDocument();
  });
});
