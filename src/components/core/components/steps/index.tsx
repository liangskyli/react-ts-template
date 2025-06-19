import type { ReactNode } from 'react';
import { cn } from '@/components/core/class-config';
import classConfig from '@/components/core/components/steps/class-config.ts';

export type StepStatus = 'wait' | 'process' | 'finish' | 'error';
export type StepDirection = 'horizontal' | 'vertical';

export interface StepItem {
  /** 步骤标题 */
  title: ReactNode;
  /** 步骤描述 */
  description?: ReactNode;
  /** 步骤状态，如果不设置，会根据 current 自动推断 */
  status?: StepStatus;
  /** 自定义图标 */
  icon?: ReactNode;
  /** 是否禁用点击 */
  disabled?: boolean;
}

export interface StepsProps {
  /** 步骤数据 */
  items: StepItem[];
  /** 当前步骤，从 0 开始 */
  current?: number;
  /** 步骤条方向 */
  direction?: StepDirection;
  /** 是否可点击切换步骤 */
  clickable?: boolean;
  /** 点击步骤时的回调 */
  onChange?: (current: number) => void;
  /** 自定义容器 CSS 类名 */
  className?: string;
  /** 自定义步骤项 CSS 类名 */
  itemClassName?: string;
  /** 自定义步骤项内部容器 CSS 类名 */
  itemInnerClassName?: string;
  /** 自定义图标和连接线容器 CSS 类名 */
  indicatorContainerClassName?: string;
  /** 自定义水平方向左侧连接线 CSS 类名 */
  horizontalLeftLineClassName?: string;
  /** 自定义水平方向右侧连接线 CSS 类名 */
  horizontalRightLineClassName?: string;
  /** 自定义垂直方向连接线 CSS 类名 */
  verticalLineClassName?: string;
  /** 自定义图标 CSS 类名 */
  iconClassName?: string;
  /** 自定义内容区域 CSS 类名 */
  contentClassName?: string;
  /** 自定义标题 CSS 类名 */
  titleClassName?: string;
  /** 自定义描述 CSS 类名 */
  descriptionClassName?: string;
}

const Steps = (props: StepsProps) => {
  const {
    items = [],
    current = 0,
    direction = 'horizontal',
    clickable = false,
    onChange,
    className,
    itemClassName,
    itemInnerClassName,
    indicatorContainerClassName,
    horizontalLeftLineClassName,
    horizontalRightLineClassName,
    verticalLineClassName,
    iconClassName,
    contentClassName,
    titleClassName,
    descriptionClassName,
  } = props;

  const getStepStatus = (index: number, item: StepItem): StepStatus => {
    if (item.status) {
      return item.status;
    }
    if (index < current) {
      return 'finish';
    }
    if (index === current) {
      return 'process';
    }
    return 'wait';
  };

  const handleStepClick = (index: number, item: StepItem) => {
    if (clickable && !item.disabled && onChange) {
      onChange(index);
    }
  };

  const renderIcon = (icon?: ReactNode) => {
    // 默认图标
    let iconNode = (
      <div
        className={cn(
          classConfig.iconConfig.base,
          classConfig.iconConfig.defaultIcon,
          iconClassName,
        )}
      >
        {/* 空内容，只显示圆点背景 */}
      </div>
    );
    // 如果有自定义图标，则使用自定义图标
    if (icon) {
      iconNode = (
        <div className={cn(classConfig.iconConfig.base, iconClassName)}>
          {icon}
        </div>
      );
    }

    return iconNode;
  };

  const getContent = (item: StepItem) => {
    return (
      <>
        {(item.title || item.description) && (
          <div className={cn(classConfig.contentConfig, contentClassName)}>
            {item.title && (
              <div className={cn(classConfig.titleConfig, titleClassName)}>
                {item.title}
              </div>
            )}
            {item.description && (
              <div
                className={cn(
                  classConfig.descriptionConfig,
                  descriptionClassName,
                )}
              >
                {item.description}
              </div>
            )}
          </div>
        )}
      </>
    );
  };

  return (
    <div className={cn(classConfig.containerConfig({ direction }), className)}>
      {items.map((item, index) => {
        const status = getStepStatus(index, item);
        const isClickable = clickable && !item.disabled;

        return (
          <div
            key={index}
            className={cn(classConfig.itemConfig({ direction }), itemClassName)}
            data-status={status}
            data-previous-status={
              index > 0 ? getStepStatus(index - 1, items[index - 1]) : undefined
            }
            data-is-clickable={isClickable}
            data-disabled={item.disabled}
            data-direction={direction}
          >
            <div
              className={cn(classConfig.itemInnerConfig, itemInnerClassName)}
              onClick={() => handleStepClick(index, item)}
            >
              {/* 图标和线条容器 */}
              {direction === 'horizontal' ? (
                <div
                  className={cn(
                    classConfig.indicatorContainerConfig.horizontal.base,
                    indicatorContainerClassName,
                  )}
                >
                  {/* 图标 */}
                  {renderIcon(item.icon)}

                  {/* 左侧连接线 */}
                  {index > 0 && (
                    <div
                      className={cn(
                        classConfig.indicatorContainerConfig.horizontal
                          .leftLine,
                        horizontalLeftLineClassName,
                      )}
                    />
                  )}

                  {/* 右侧连接线 */}
                  {index < items.length - 1 && (
                    <div
                      className={cn(
                        classConfig.indicatorContainerConfig.horizontal
                          .rightLine,
                        horizontalRightLineClassName,
                      )}
                    />
                  )}
                </div>
              ) : (
                <div
                  className={cn(
                    classConfig.indicatorContainerConfig.vertical.base,
                    indicatorContainerClassName,
                  )}
                >
                  {/* 图标 */}
                  {renderIcon(item.icon)}

                  {/* 垂直连接线 */}
                  {index < items.length - 1 && (
                    <div
                      className={cn(
                        classConfig.indicatorContainerConfig.vertical.line,
                        verticalLineClassName,
                      )}
                    />
                  )}
                </div>
              )}

              {getContent(item)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Steps;
