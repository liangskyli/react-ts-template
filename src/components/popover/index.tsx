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
import type { PopupProps } from '@/components/popup';
import Popup from '@/components/popup';
import { cn } from '@/utils/styles';

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
  const baseStyles = 'w-0 h-0 relative';

  // 基本箭头样式，不包含颜色
  const placementStyles: Record<Placement, string> = {
    // 上方位置的箭头指向下方
    top: 'mx-auto border-l-8 border-t-8 border-r-8 border-transparent mt-[-1px]',
    'top-start':
      'ml-4 border-l-8 border-t-8 border-r-8 border-transparent mt-[-1px]',
    'top-end':
      'mr-4 ml-auto border-l-8 border-t-8 border-r-8 border-transparent mt-[-1px]',

    // 下方位置的箭头指向上方
    bottom:
      'mx-auto border-l-8 border-b-8 border-r-8 border-transparent mb-[-1px]',
    'bottom-start':
      'ml-4 border-l-8 border-b-8 border-r-8 border-transparent mb-[-1px]',
    'bottom-end':
      'mr-4 ml-auto border-l-8 border-b-8 border-r-8 border-transparent mb-[-1px]',

    // 左侧位置的箭头指向右侧
    left: 'my-auto border-t-8 border-l-8 border-b-8 border-transparent ml-[-1px]',
    'left-start':
      'mt-4 border-t-8 border-l-8 border-b-8 border-transparent ml-[-1px]',
    'left-end':
      'mb-4 mt-auto border-t-8 border-l-8 border-b-8 border-transparent ml-[-1px]',

    // 右侧位置的箭头指向左侧
    right:
      'my-auto border-t-8 border-r-8 border-b-8 border-transparent mr-[-1px]',
    'right-start':
      'mt-4 border-t-8 border-r-8 border-b-8 border-transparent mr-[-1px]',
    'right-end':
      'mb-4 mt-auto border-t-8 border-r-8 border-b-8 border-transparent mr-[-1px]',
  };

  // 获取基本方向
  const baseDirection = getBaseDirection(direction);

  // 根据方向确定需要设置的边框颜色属性
  const borderColorProp = `border${baseDirection.charAt(0).toUpperCase() + baseDirection.slice(1)}Color`;

  // 创建样式对象，只设置箭头主要方向的颜色
  const arrowStyle: Record<string, string> = {
    [borderColorProp]: bgColor,
  };

  return {
    className: `${baseStyles} ${placementStyles[direction]}`,
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
      className={cn('z-0', bubbleClassName)}
      style={floatingStyles}
    >
      <div
        className={cn(
          'relative',
          currentPlacement === 'top' && 'flex flex-col items-center',
          currentPlacement === 'bottom' && 'flex flex-col-reverse items-center',
          currentPlacement === 'left' && 'flex flex-row items-center',
          currentPlacement === 'right' && 'flex flex-row-reverse items-center',
          currentPlacement === 'top-start' && 'flex flex-col items-start',
          currentPlacement === 'top-end' && 'flex flex-col items-end',
          currentPlacement === 'bottom-start' &&
            'flex flex-col-reverse items-start',
          currentPlacement === 'bottom-end' &&
            'flex flex-col-reverse items-end',
          currentPlacement === 'left-start' && 'flex flex-row items-start',
          currentPlacement === 'left-end' && 'flex flex-row items-end',
          currentPlacement === 'right-start' &&
            'flex flex-row-reverse items-start',
          currentPlacement === 'right-end' && 'flex flex-row-reverse items-end',
        )}
      >
        <div
          className={cn(
            'rounded-lg p-3',
            'shadow-[0_0_30px_0_rgba(0,0,0,.2)]',
            'bg-white text-left',
            contentClassName,
          )}
        >
          {typeof content === 'function' ? content(setOpen) : content}
        </div>

        <div
          className={cn(
            'relative z-0',
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
        className={cn('inline-block', className)}
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
        maskClassName={cn(
          'bg-mask/0',
          { 'pointer-events-auto': !maskClickable },
          { 'pointer-events-none': maskClickable },
        )}
        bodyClassName="bg-transparent static"
        className="absolute"
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
