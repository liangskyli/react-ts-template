import React, { useState } from 'react';
import type { ListRowRenderer } from 'react-virtualized';
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  List as VirtualizedList,
} from 'react-virtualized';
import type { CellMeasurerChildProps } from 'react-virtualized/dist/es/CellMeasurer';
import { cn } from '@/components/class-config';
import classConfig from '@/components/list/class-config.ts';

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

const ListBase = (props: ListProps) => {
  const {
    virtualScroll = false,
    virtualConfig = {},
    className,
    children,
  } = props;

  const { defaultHeight, minHeight } = virtualConfig;

  const [cache] = useState(
    new CellMeasurerCache({
      defaultHeight: defaultHeight,
      minHeight: minHeight,
      fixedWidth: true,
    }),
  );
  // 将children转换为数组，以便在rowRenderer中使用
  const childrenArray = React.Children.toArray(children);

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

  return (
    <div className={cn(classConfig.listConfig({ virtualScroll }), className)}>
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
              />
            );
          }}
        </AutoSizer>
      ) : (
        <>{children}</>
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
