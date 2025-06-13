import React from 'react';
import { cn } from '@/components/core/class-config';
import classConfig from '@/components/core/components/list/class-config.ts';

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
export const ListItem = (props: ListItemProps) => {
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
