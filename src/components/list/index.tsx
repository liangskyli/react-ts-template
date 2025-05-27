import React, { useCallback, useEffect, useRef, useState } from 'react';
import type {
  ListRowRenderer,
  ListProps as VirtualizedListProps,
} from 'react-virtualized';
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  List as VirtualizedList,
} from 'react-virtualized';
import type { CellMeasurerChildProps } from 'react-virtualized/dist/es/CellMeasurer';
import { cn } from '@/components/class-config';
import classConfig from '@/components/list/class-config.ts';
import InfiniteScrollContent from '@/components/list/infinite-scroll-content.tsx';

export type ListProps = {
  /** 是否启用虚拟滚动 */
  virtualScroll?: boolean;
  /** 虚拟滚动配置 */
  virtualConfig?: {
    /** 每项默认高度 */
    defaultHeight?: number;
    /** 每项最小高度 */
    minHeight?: number;
  };
  /** 无限滚动,分页加载数据 */
  infiniteScroll?: {
    /** 加载更多的回调函数 */
    loadMore: (isRetry: boolean) => Promise<void>;
    /** 是否还有更多内容 */
    hasMore: boolean;
    /** 触发加载事件的滚动触底距离阈值，单位为像素 */
    threshold?: number;
    /** 渲染自定义指引内容 */
    children?: (
      hasMore: boolean,
      failed: boolean,
      retry: () => void,
    ) => React.ReactNode;
  };
  /** 自定义类名 */
  className?: string;
  /** 列表内容 */
  children?: React.ReactNode;
};

export type ListItemProps = {
  /** 列表项标题 */
  title?: React.ReactNode;
  /** 列表项描述 */
  description?: React.ReactNode;
  /** 列表项前缀 */
  prefix?: React.ReactNode;
  /** 列表项后缀 */
  suffix?: React.ReactNode;
  /** 是否可点击 */
  clickable?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 点击事件 */
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  /** 列表项内容 */
  children?: React.ReactNode;
};

const flattenChildren = (children: React.ReactNode): React.ReactNode[] => {
  const result: React.ReactNode[] = [];

  const flatten = (child: React.ReactNode) => {
    if (child == null) return;

    if (Array.isArray(child)) {
      child.forEach(flatten);
    } else if (
      typeof child === 'object' &&
      'type' in child &&
      child.type === React.Fragment
    ) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      flatten((child as any).props.children);
    } else {
      result.push(child);
    }
  };

  flatten(children);
  return result;
};

const ListBase = (props: ListProps) => {
  const {
    virtualScroll = false,
    virtualConfig = {},
    className,
    children,
    infiniteScroll,
  } = props;

  const { defaultHeight, minHeight } = virtualConfig;

  // 将children转换为数组，以便在rowRenderer中使用
  const childrenArray = flattenChildren(children);
  const [cache] = useState(
    new CellMeasurerCache({
      defaultHeight: defaultHeight,
      minHeight: minHeight,
      fixedWidth: true,
    }),
  );

  const [failed, setFailed] = useState(false);
  const [isLoadMoreLoading, setIsLoadMoreLoading] = useState(false);
  const lockRef = useRef(false);
  const doLoadMore = useCallback(
    async (isRetry: boolean) => {
      if (infiniteScroll?.hasMore && !isLoadMoreLoading && !failed) {
        if (lockRef.current) return;
        lockRef.current = true;
        const rowIndex = childrenArray.length;
        setIsLoadMoreLoading(true);

        try {
          await props.infiniteScroll?.loadMore(isRetry);
        } catch {
          setFailed(true);
        } finally {
          setIsLoadMoreLoading(false);
        }
        cache.clear?.(rowIndex - 1, 0);
        lockRef.current = false;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      infiniteScroll?.hasMore,
      isLoadMoreLoading,
      failed,
      childrenArray.length,
      props.infiniteScroll,
    ],
  );
  const [isClickRetry, setIsClickRetry] = useState(false);
  const retry = async () => {
    setIsClickRetry(true);
    setFailed(false);
  };
  useEffect(() => {
    if (isClickRetry) {
      setIsClickRetry(false);
      if (!failed) {
        doLoadMore(true);
      }
    }
  }, [doLoadMore, failed, isClickRetry]);

  if (infiniteScroll) {
    const {
      hasMore,
      children = (hasMore, failed, retry) =>
        (
          <InfiniteScrollContent
            hasMore={hasMore}
            failed={failed}
            retry={retry}
          />
        ) as React.ReactNode,
    } = infiniteScroll;
    childrenArray.push(children(hasMore, failed, retry) as never);
  }

  const rowRenderer: ListRowRenderer = (props) => {
    // eslint-disable-next-line react/prop-types
    const { key, index, style, parent } = props;
    const child = childrenArray[index];
    const itemRender = (opts: {
      registerChild: CellMeasurerChildProps['registerChild'];
    }) => {
      const { registerChild } = opts;
      return (
        <div ref={registerChild} style={style}>
          {child}
        </div>
      );
    };
    return (
      <CellMeasurer
        cache={cache}
        columnIndex={0}
        key={key}
        parent={parent}
        rowIndex={index}
      >
        {({ registerChild }) => itemRender({ registerChild })}
      </CellMeasurer>
    );
  };

  const onScroll: VirtualizedListProps['onScroll'] = async (params) => {
    const { clientHeight, scrollHeight, scrollTop } = params;
    if (infiniteScroll) {
      const { threshold = 100 } = infiniteScroll;
      if (scrollHeight <= clientHeight + scrollTop + threshold) {
        await doLoadMore(false);
      }
    }
  };

  const onDivInfiniteScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!virtualScroll && !!infiniteScroll) {
      const { clientHeight, scrollHeight, scrollTop } =
        e.target as HTMLDivElement;
      onScroll({
        clientHeight,
        scrollHeight,
        scrollTop,
        clientWidth: 0,
        scrollLeft: 0,
        scrollWidth: 0,
      });
    }
  };

  return (
    <div
      className={cn(
        classConfig.listConfig({ isScroll: virtualScroll || !!infiniteScroll }),
        className,
      )}
      onScroll={onDivInfiniteScroll}
      role="list"
    >
      {virtualScroll ? (
        <AutoSizer>
          {(opts) => {
            const { width, height } = opts;
            return (
              <VirtualizedList
                width={width}
                height={height}
                rowCount={childrenArray.length}
                deferredMeasurementCache={cache}
                rowHeight={cache.rowHeight}
                rowRenderer={rowRenderer}
                onScroll={onScroll}
              />
            );
          }}
        </AutoSizer>
      ) : (
        <>
          {childrenArray.map((child, index) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return <div key={(child as any).key ?? index}>{child}</div>;
          })}
        </>
      )}
    </div>
  );
};

const ListItem = (props: ListItemProps) => {
  const {
    title,
    description,
    prefix,
    suffix,
    clickable = false,
    disabled = false,
    className,
    onClick,
    children,
    ...rest
  } = props;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    onClick?.(e);
  };

  return (
    <div
      className={cn(classConfig.itemConfig, className)}
      data-clickable={clickable && !disabled ? true : undefined}
      data-disabled={disabled ? true : undefined}
      onClick={handleClick}
      {...rest}
    >
      {prefix && <div className={classConfig.itemPrefixConfig}>{prefix}</div>}

      <div className={classConfig.itemContentConfig.wrap}>
        {children || (
          <>
            {title && (
              <div className={classConfig.itemContentConfig.title}>{title}</div>
            )}
            {description && (
              <div className={classConfig.itemContentConfig.description}>
                {description}
              </div>
            )}
          </>
        )}
      </div>

      {suffix && <div className={classConfig.itemSuffixConfig}>{suffix}</div>}
    </div>
  );
};

type ListType = typeof ListBase & {
  Item: typeof ListItem;
};

const List = ListBase as ListType;
List.Item = ListItem;

export default List;
