import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import {
  type OffsetOptions,
  type Placement,
  arrow as arrowMiddleware,
  autoUpdate,
  flip as flipMiddleware,
  offset as offsetMiddleware,
  shift as shiftMiddleware,
  useFloating,
} from '@floating-ui/react';
import { cn } from '@/components/core/class-config';
import classConfig from '@/components/core/components/popover/class-config.ts';
import type { PopupProps } from '@/components/core/components/popup';
import Popup from '@/components/core/components/popup';

export type PopoverProps = {
  className?: string;
  /** 气泡框className */
  bubbleClassName?: string;
  /** 气泡框内容className */
  contentClassName?: string;
  /** 默认是否显示 */
  defaultVisible?: boolean;
  /** 触发 Popover 的元素 */
  children: ReactNode;
  /** 弹出内容 */
  content:
    | ReactNode
    | ((setOpen: React.Dispatch<React.SetStateAction<boolean>>) => ReactNode);
  /** 气泡框位置 */
  placement?: Placement;
  /** 气泡框偏移量 */
  offset?: OffsetOptions;
  /** 气泡框视图显示配置 */
  shiftOptions?: Parameters<typeof shiftMiddleware>[0];
  disabled?: boolean;
  /** 是否允许背景点击 */
  maskClickable?: boolean;
  /** 气泡框箭头 */
  arrow?: {
    /** 气泡框箭头className */
    className?: string;
    /** 箭头背景色 */
    bgColor?: string;
  };
  /** 点击外部是否关闭弹出层 */
  closeOnOutsideClick?: boolean;
} & Pick<PopupProps, 'disableBodyScroll' | 'getContainer'>;

// 获取 placement 的基本方向
const getBaseDirection = (direction: Placement) => {
  if (direction.startsWith('bottom')) return 'bottom';
  if (direction.startsWith('left')) return 'left';
  if (direction.startsWith('right')) return 'right';
  return 'top';
};

const getArrowStyles = (direction: Placement, bgColor: string) => {
  // 获取基本方向
  const baseDirection = getBaseDirection(direction);

  // 根据方向确定需要设置的边框颜色属性
  const borderColorProp = `border${baseDirection.charAt(0).toUpperCase() + baseDirection.slice(1)}Color`;

  // 创建样式对象，只设置箭头主要方向的颜色
  const arrowStyle: Record<string, string> = {
    [borderColorProp]: bgColor,
  };

  return {
    className: classConfig.floatingArrowDirectionConfig({ direction }),
    style: arrowStyle,
    direction: baseDirection,
  };
};

const Popover = (props: PopoverProps) => {
  const {
    children,
    content,
    placement = 'top',
    className,
    bubbleClassName,
    contentClassName,
    disabled,
    getContainer = document.body,
    maskClickable = true,
    arrow,
    closeOnOutsideClick = true,
    offset = 2,
    shiftOptions = { padding: 4, mainAxis: false, crossAxis: false },
    disableBodyScroll = false,
    defaultVisible = false,
  } = props;
  const { bgColor = 'white' } = arrow ?? {};
  const [open, setOpen] = useState(defaultVisible);
  const arrowRef = useRef(null);
  const referenceRef = useRef<HTMLDivElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);

  // 当前的placement
  const [currentPlacement, setCurrentPlacement] =
    useState<Placement>(placement);

  useEffect(() => {
    setCurrentPlacement(placement);
  }, [placement]);

  // 使用 floating-ui 处理定位
  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: currentPlacement,
    // 自动更新位置，处理滚动、调整大小等情况
    whileElementsMounted: autoUpdate,
    middleware: [
      offsetMiddleware(offset), // 设置偏移量
      flipMiddleware(), // 自动翻转以保持在视口内
      shiftMiddleware(shiftOptions), // 在需要时移动以保持在视口内
      // eslint-disable-next-line react-hooks/refs
      arrowMiddleware({ element: arrowRef }), // 箭头中间件
    ],
  });

  // 点击外部关闭弹出层
  useEffect(() => {
    if (!open || !closeOnOutsideClick) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // 如果点击的是触发元素或其子元素，不关闭弹出层
      if (referenceRef.current?.contains(target)) {
        return;
      }

      // 如果点击的是弹出层或其子元素，不关闭弹出层
      if (floatingRef.current?.contains(target)) {
        return;
      }

      // 其他情况，关闭弹出层
      setOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, closeOnOutsideClick]);

  const [arrowStyles, setArrowStyles] = useState(
    getArrowStyles(currentPlacement, bgColor),
  );

  // 当 context 或 placement 变化时更新方向和箭头样式
  useEffect(() => {
    if (context) {
      const newDirection = context.placement;
      setCurrentPlacement(newDirection);
      setArrowStyles(getArrowStyles(newDirection, bgColor));
    }
  }, [context, bgColor]);

  const floatingNode = (
    <div
      ref={(node) => {
        // 同时设置两个 ref
        refs.setFloating(node);
        if (floatingRef) {
          floatingRef.current = node;
        }
      }}
      className={cn(classConfig.floatingConfig.base, bubbleClassName)}
      style={floatingStyles}
    >
      <div
        className={cn(
          classConfig.floatingWrapConfig({ direction: currentPlacement }),
        )}
      >
        <div
          className={cn(classConfig.floatingContentConfig, contentClassName)}
        >
          {typeof content === 'function' ? content(setOpen) : content}
        </div>

        <div
          className={cn(
            classConfig.floatingArrowConfig,
            arrowStyles.className,
            arrow?.className,
          )}
          style={{
            ...arrowStyles.style,
          }}
          ref={arrowRef}
        />
      </div>
    </div>
  );

  return (
    <>
      <div
        className={cn(classConfig.popoverConfig, className)}
        ref={(node) => {
          // 同时设置两个 ref
          refs.setReference(node);
          if (referenceRef) {
            referenceRef.current = node;
          }
        }}
        onClick={() => !disabled && setOpen(!open)}
      >
        {children}
      </div>
      <Popup
        visible={open}
        onClose={() => setOpen(false)}
        maskClassName={cn(classConfig.popupMaskConfig({ maskClickable }))}
        bodyClassName={classConfig.popupBodyConfig}
        className={classConfig.popupConfig}
        getContainer={getContainer}
        position="none"
        destroyOnClose
        closeOnMaskClick={closeOnOutsideClick}
        disableBodyScroll={disableBodyScroll}
      >
        {floatingNode}
      </Popup>
    </>
  );
};

export default Popover;
