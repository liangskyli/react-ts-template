import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import InfiniteScroll from '@/components/core/components/list/infinite-scroll.tsx';
import * as utilModule from '@/components/core/components/list/util.ts';
import * as getScrollParentModule from '@/components/core/utils/get-scroll-parent.ts';

describe('InfiniteScroll', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render with default content', () => {
    const loadMore = vi.fn().mockResolvedValue(undefined);
    render(<InfiniteScroll loadMore={loadMore} hasMore={true} />);

    // 默认内容应该被渲染
    expect(screen.getByText('加载中...')).toBeInTheDocument();
  });

  it('should render with custom content', () => {
    const loadMore = vi.fn().mockResolvedValue(undefined);
    const customContent = vi.fn().mockReturnValue(<div>Custom Content</div>);

    render(
      <InfiniteScroll
        loadMore={loadMore}
        hasMore={true}
        /* eslint-disable-next-line react/no-children-prop */
        children={customContent}
      />,
    );

    expect(screen.getByText('Custom Content')).toBeInTheDocument();
    expect(customContent).toHaveBeenCalledWith({
      hasMore: true,
      failed: false,
      retry: expect.any(Function),
    });
  });

  it('should load more when scrolling to threshold', async () => {
    // 创建一个模拟的滚动容器
    const mockScrollContainer = document.createElement('div');
    Object.defineProperties(mockScrollContainer, {
      clientHeight: { value: 200, configurable: true },
      scrollHeight: { value: 1000, configurable: true },
      scrollTop: { value: 750, configurable: true },
    });

    // 模拟 getScrollParent 函数返回我们的模拟滚动容器
    vi.spyOn(getScrollParentModule, 'getScrollParent').mockReturnValue(
      mockScrollContainer,
    );

    const loadMore = vi.fn().mockResolvedValue(undefined);
    const loadMoreFinally = vi.fn();

    render(
      <InfiniteScroll
        loadMore={loadMore}
        loadMoreFinally={loadMoreFinally}
        hasMore={true}
        threshold={100}
      />,
    );

    // 触发滚动事件
    await act(async () => {
      const scrollEvent = new Event('scroll');
      mockScrollContainer.dispatchEvent(scrollEvent);
    });

    // 验证 loadMore 被调用
    expect(loadMore).toHaveBeenCalledWith(false);
    expect(loadMoreFinally).toHaveBeenCalled();
  });

  it('should not load more when hasMore is false', async () => {
    // 创建一个模拟的滚动容器
    const mockScrollContainer = document.createElement('div');
    Object.defineProperties(mockScrollContainer, {
      clientHeight: { value: 200, configurable: true },
      scrollHeight: { value: 1000, configurable: true },
      scrollTop: { value: 750, configurable: true },
    });

    // 模拟 getScrollParent 函数
    vi.spyOn(getScrollParentModule, 'getScrollParent').mockReturnValue(
      mockScrollContainer,
    );

    const loadMore = vi.fn().mockResolvedValue(undefined);

    render(
      <InfiniteScroll loadMore={loadMore} hasMore={false} threshold={100} />,
    );

    // 触发滚动事件
    await act(async () => {
      const scrollEvent = new Event('scroll');
      mockScrollContainer.dispatchEvent(scrollEvent);
    });

    // 验证 loadMore 没有被调用
    expect(loadMore).not.toHaveBeenCalled();
  });

  it('should not load more when already loading', async () => {
    // 创建一个模拟的滚动容器
    const mockScrollContainer = document.createElement('div');
    Object.defineProperties(mockScrollContainer, {
      clientHeight: { value: 200, configurable: true },
      scrollHeight: { value: 1000, configurable: true },
      scrollTop: { value: 750, configurable: true },
    });

    // 模拟 getScrollParent 函数
    vi.spyOn(getScrollParentModule, 'getScrollParent').mockReturnValue(
      mockScrollContainer,
    );

    // 创建一个延迟解析的 Promise
    const loadMore = vi
      .fn()
      .mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

    render(
      <InfiniteScroll loadMore={loadMore} hasMore={true} threshold={100} />,
    );

    // 触发多次滚动事件
    await act(async () => {
      const scrollEvent = new Event('scroll');
      mockScrollContainer.dispatchEvent(scrollEvent);
      mockScrollContainer.dispatchEvent(scrollEvent);
    });

    // 验证 loadMore 只被调用一次
    expect(loadMore).toHaveBeenCalledTimes(1);
  });

  it('should handle load more failure', async () => {
    // 创建一个模拟的滚动容器
    const mockScrollContainer = document.createElement('div');
    Object.defineProperties(mockScrollContainer, {
      clientHeight: { value: 200, configurable: true },
      scrollHeight: { value: 1000, configurable: true },
      scrollTop: { value: 750, configurable: true },
    });

    // 模拟 getScrollParent 函数
    vi.spyOn(getScrollParentModule, 'getScrollParent').mockReturnValue(
      mockScrollContainer,
    );

    // 创建一个会抛出错误的 Promise
    const loadMore = vi.fn().mockRejectedValue(new Error('Failed to load'));
    const loadMoreFinally = vi.fn();

    render(
      <InfiniteScroll
        loadMore={loadMore}
        loadMoreFinally={loadMoreFinally}
        hasMore={true}
        threshold={100}
      />,
    );

    // 触发滚动事件
    await act(async () => {
      const scrollEvent = new Event('scroll');
      mockScrollContainer.dispatchEvent(scrollEvent);
    });

    // 验证失败状态 - 分别检查两个元素
    expect(screen.getByText('加载失败')).toBeInTheDocument();
    expect(screen.getByText('重新加载')).toBeInTheDocument();
    expect(loadMoreFinally).toHaveBeenCalled();
  });

  it('should retry loading after failure', async () => {
    // 创建一个模拟的滚动容器
    const mockScrollContainer = document.createElement('div');
    Object.defineProperties(mockScrollContainer, {
      clientHeight: { value: 200, configurable: true },
      scrollHeight: { value: 1000, configurable: true },
      scrollTop: { value: 750, configurable: true },
    });

    // 模拟 getScrollParent 函数
    vi.spyOn(getScrollParentModule, 'getScrollParent').mockReturnValue(
      mockScrollContainer,
    );

    // 第一次失败，第二次成功
    const loadMore = vi
      .fn()
      .mockRejectedValueOnce(new Error('Failed to load'))
      .mockResolvedValueOnce(undefined);

    render(
      <InfiniteScroll loadMore={loadMore} hasMore={true} threshold={100} />,
    );

    // 触发滚动事件
    await act(async () => {
      const scrollEvent = new Event('scroll');
      mockScrollContainer.dispatchEvent(scrollEvent);
    });

    // 验证失败状态
    const retryButton = screen.getByText('重新加载');
    expect(retryButton).toBeInTheDocument();

    // 点击重试按钮
    await act(async () => {
      fireEvent.click(retryButton);
    });

    // 验证 loadMore 被调用了两次，第二次是重试
    expect(loadMore).toHaveBeenCalledTimes(2);
    expect(loadMore.mock.calls[0][0]).toBe(false); // 第一次不是重试
    expect(loadMore.mock.calls[1][0]).toBe(true); // 第二次是重试
  });

  it('should handle window as scroll parent', async () => {
    // 模拟 isWindow 返回 true
    vi.spyOn(utilModule, 'isWindow').mockReturnValue(true);

    // 保存原始的 window 属性
    const originalInnerHeight = window.innerHeight;
    const originalScrollY = window.scrollY;
    const originalScrollHeight = document.body.scrollHeight;

    // 模拟 window 属性
    Object.defineProperty(window, 'innerHeight', {
      value: 200,
      configurable: true,
    });
    Object.defineProperty(window, 'scrollY', {
      value: 750,
      configurable: true,
    });
    Object.defineProperty(document.body, 'scrollHeight', {
      value: 1000,
      configurable: true,
    });

    // 模拟 getScrollParent 返回 window
    vi.spyOn(getScrollParentModule, 'getScrollParent').mockReturnValue(window);

    const loadMore = vi.fn().mockResolvedValue(undefined);

    render(
      <InfiniteScroll loadMore={loadMore} hasMore={true} threshold={100} />,
    );

    // 触发滚动事件
    await act(async () => {
      const scrollEvent = new Event('scroll');
      window.dispatchEvent(scrollEvent);
    });

    // 验证 loadMore 被调用
    expect(loadMore).toHaveBeenCalledWith(false);

    // 恢复原始的 window 属性
    Object.defineProperty(window, 'innerHeight', {
      value: originalInnerHeight,
      configurable: true,
    });
    Object.defineProperty(window, 'scrollY', {
      value: originalScrollY,
      configurable: true,
    });
    Object.defineProperty(document.body, 'scrollHeight', {
      value: originalScrollHeight,
      configurable: true,
    });
  });

  it('should respect threshold value', async () => {
    // 创建一个模拟的滚动容器
    const mockScrollContainer = document.createElement('div');

    // 模拟 getScrollParent 函数
    vi.spyOn(getScrollParentModule, 'getScrollParent').mockReturnValue(
      mockScrollContainer,
    );

    const loadMore = vi.fn().mockResolvedValue(undefined);
    const threshold = 50;

    render(
      <InfiniteScroll
        loadMore={loadMore}
        hasMore={true}
        threshold={threshold}
      />,
    );

    // 设置滚动位置（不触发加载）
    Object.defineProperties(mockScrollContainer, {
      clientHeight: { value: 200, configurable: true },
      scrollHeight: { value: 1000, configurable: true },
      scrollTop: { value: 700, configurable: true },
    });

    // 触发滚动事件
    await act(async () => {
      const scrollEvent = new Event('scroll');
      mockScrollContainer.dispatchEvent(scrollEvent);
    });

    // 验证 loadMore 没有被调用
    expect(loadMore).not.toHaveBeenCalled();

    // 设置滚动位置（触发加载）
    Object.defineProperties(mockScrollContainer, {
      clientHeight: { value: 200, configurable: true },
      scrollHeight: { value: 1000, configurable: true },
      scrollTop: { value: 750, configurable: true },
    });

    // 触发滚动事件
    await act(async () => {
      const scrollEvent = new Event('scroll');
      mockScrollContainer.dispatchEvent(scrollEvent);
    });

    // 验证 loadMore 被调用
    expect(loadMore).toHaveBeenCalledWith(false);
  });

  it('should clean up event listeners on unmount', async () => {
    // 创建一个模拟的滚动容器
    const mockScrollContainer = document.createElement('div');
    const removeEventListenerSpy = vi.spyOn(
      mockScrollContainer,
      'removeEventListener',
    );

    // 模拟 getScrollParent 函数
    vi.spyOn(getScrollParentModule, 'getScrollParent').mockReturnValue(
      mockScrollContainer,
    );

    const loadMore = vi.fn().mockResolvedValue(undefined);

    const { unmount } = render(
      <InfiniteScroll loadMore={loadMore} hasMore={true} />,
    );

    // 卸载组件
    unmount();

    // 验证 removeEventListener 被调用
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function),
    );
  });

  it('should handle lock mechanism correctly', async () => {
    // 创建一个模拟的滚动容器
    const mockScrollContainer = document.createElement('div');
    Object.defineProperties(mockScrollContainer, {
      clientHeight: { value: 200, configurable: true },
      scrollHeight: { value: 1000, configurable: true },
      scrollTop: { value: 750, configurable: true },
    });

    // 模拟 getScrollParent 函数
    vi.spyOn(getScrollParentModule, 'getScrollParent').mockReturnValue(
      mockScrollContainer,
    );

    // 创建一个延迟解析的 Promise
    const loadMore = vi
      .fn()
      .mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

    render(
      <InfiniteScroll loadMore={loadMore} hasMore={true} threshold={100} />,
    );

    // 触发滚动事件
    await act(async () => {
      const scrollEvent = new Event('scroll');
      mockScrollContainer.dispatchEvent(scrollEvent);
    });

    // 立即再次触发滚动事件（应该被锁定）
    await act(async () => {
      const scrollEvent = new Event('scroll');
      mockScrollContainer.dispatchEvent(scrollEvent);
    });

    // 验证 loadMore 只被调用一次
    expect(loadMore).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });
});
