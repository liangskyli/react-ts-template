import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { InfiniteScrollContentProps } from '@/components/core/components/list/default-infinite-scroll-content.tsx';
import DefaultInfiniteScrollContent from '@/components/core/components/list/default-infinite-scroll-content.tsx';
import { isWindow } from '@/components/core/components/list/util.ts';
import { getScrollParent } from '@/components/core/utils/get-scroll-parent.ts';

export type InfiniteScrollProps = {
  /** 加载更多的回调函数 */
  loadMore: (isRetry: boolean) => Promise<void>;
  /** 加载更多的回调函数结束时的回调函数,成功失败都调用 */
  loadMoreFinally?: () => void;
  /** 是否还有更多内容 */
  hasMore: boolean;
  /** 触发加载事件的滚动触底距离阈值，单位为像素 */
  threshold?: number;
  /** 渲染自定义指引内容 */
  children?: (childrenProps: InfiniteScrollContentProps) => React.ReactNode;
};
const InfiniteScroll = (props: InfiniteScrollProps) => {
  const {
    hasMore,
    children = (childrenProps) => (
      <DefaultInfiniteScrollContent {...childrenProps} />
    ),
    loadMore,
    loadMoreFinally,
    threshold = 100,
  } = props;

  const elementRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  const doLoadMore = useCallback(
    async (isRetry: boolean) => {
      if (hasMore && !failed) {
        try {
          await loadMore(isRetry);
        } catch {
          setFailed(true);
        }
        loadMoreFinally?.();
      }
    },
    [hasMore, failed, loadMore, loadMoreFinally],
  );
  const [isClickRetry, setIsClickRetry] = useState(false);
  const retry = async () => {
    setIsClickRetry(true);
    setFailed(false);
  };

  const [scrollParent, setScrollParent] =
    useState<ReturnType<typeof getScrollParent>>();

  useEffect(() => {
    const element = elementRef.current;
    setScrollParent(getScrollParent(element));
  }, []);

  const lockScrollCheckRef = useRef(false);
  const scrollCheck = useCallback(async () => {
    if (lockScrollCheckRef.current) return;
    lockScrollCheckRef.current = true;
    const clientHeight = isWindow(scrollParent)
      ? window.innerHeight
      : scrollParent!.clientHeight;
    const scrollHeight = isWindow(scrollParent)
      ? document.body.scrollHeight
      : scrollParent!.scrollHeight;
    const scrollTop = isWindow(scrollParent)
      ? window.scrollY
      : scrollParent!.scrollTop;

    if (scrollHeight <= clientHeight + scrollTop + threshold) {
      await doLoadMore(false);
    }
    lockScrollCheckRef.current = false;
  }, [scrollParent, threshold, doLoadMore]);

  useEffect(() => {
    function onScroll() {
      scrollCheck();
    }
    scrollParent?.addEventListener('scroll', onScroll);
    return () => {
      scrollParent?.removeEventListener('scroll', onScroll);
    };
  }, [scrollCheck, scrollParent]);

  useEffect(() => {
    if (isClickRetry) {
      setIsClickRetry(false);
      doLoadMore(true);
    }
  }, [doLoadMore, isClickRetry]);

  return <div ref={elementRef}>{children({ hasMore, failed, retry })}</div>;
};
export default InfiniteScroll;
