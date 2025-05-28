import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { Fragment, useState } from 'react';
import { Transition } from '@headlessui/react';
import { cn } from '@/components/core/class-config';
import Mask from '@/components/core/components/mask';
import classConfig from '@/components/core/components/popup/class-config.ts';
import { generateTimeoutFunction } from '@/components/core/components/popup/imperative.tsx';
import type { GetContainer } from '@/components/core/utils/render-to-container.ts';
import { renderToContainer } from '@/components/core/utils/render-to-container.ts';

export type Position = 'bottom' | 'top' | 'left' | 'right' | 'center' | 'none';

export type PopupProps = {
  /** 是否可见 */
  visible?: boolean;
  /** 内容 */
  children?: ReactNode;
  /** 弹出位置 */
  position?: Position;
  /** 遮罩类名 */
  maskClassName?: string;
  /** 容器类名 */
  className?: string;
  /** 内容区域类名 */
  bodyClassName?: string;
  /** 点击蒙层是否关闭 */
  closeOnMaskClick?: boolean;
  /** 关闭时的回调 */
  onClose?: () => void;
  /** 完全关闭后的回调 */
  afterClose?: () => void;
  /** 是否在关闭时销毁内容 */
  destroyOnClose?: boolean;
  /** 指定挂载的节点,如果为 null 的话，会渲染到当前节点 */
  getContainer?: GetContainer;
  /** 是否禁用 body 滚动 */
  disableBodyScroll?: boolean;
  /** 显示持续时间(毫秒)，设置为 0 则不会自动关闭 */
  duration?: number;
  /** 唯一标识符，不建议手动设置 */
  popupId?: string;
};

const transitionStyles: Record<
  Position,
  {
    enter: string;
    enterFrom: string;
    enterTo: string;
    leave: string;
    leaveFrom: string;
    leaveTo: string;
  }
> = classConfig.transitionConfig;

const Popup = (props: PopupProps) => {
  const {
    visible = false,
    position = 'bottom',
    children,
    maskClassName,
    className,
    bodyClassName,
    closeOnMaskClick = true,
    onClose,
    afterClose,
    destroyOnClose = false,
    getContainer = document.body,
    disableBodyScroll,
    duration = 0,
    popupId: defaultPopupId,
  } = props;
  const [popupId, setPopupId] = useState(defaultPopupId);
  const [isContentTransitionFinish, setIsContentTransitionFinish] =
    useState(false);
  const [shouldRenderContent, setShouldRenderContent] = useState(visible);

  useEffect(() => {
    const generatePopupId = `auto-generate-popup-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setPopupId(defaultPopupId ?? generatePopupId);
  }, [defaultPopupId]);

  // 当 visible 变为 true 时，设置 shouldRenderContent 为 true
  useEffect(() => {
    if (visible) {
      setShouldRenderContent(true);
    }
  }, [visible]);

  useEffect(() => {
    if (visible && duration > 0) {
      const timer = generateTimeoutFunction(
        popupId!,
        () => {
          onClose?.();
        },
        duration,
      );
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose, popupId]);

  if (!shouldRenderContent) {
    return null;
  }

  const transition = transitionStyles[position];

  const node = (
    <div
      data-testid="popup"
      className={cn(classConfig.popupConfig, className)}
      data-popup-id={popupId}
    >
      <Mask
        className={cn(classConfig.maskConfig, maskClassName)}
        visible={visible}
        onMaskClick={closeOnMaskClick ? onClose : undefined}
        disableBodyScroll={disableBodyScroll}
        getContainer={null}
      />
      <Transition
        appear
        show={visible}
        as={Fragment}
        enter={transition.enter}
        enterFrom={transition.enterFrom}
        enterTo={transition.enterTo}
        leave={transition.leave}
        leaveFrom={transition.leaveFrom}
        leaveTo={transition.leaveTo}
        beforeEnter={() => setIsContentTransitionFinish(false)}
        afterEnter={() => setIsContentTransitionFinish(true)}
        beforeLeave={() => setIsContentTransitionFinish(false)}
        afterLeave={() => {
          afterClose?.();
          if (destroyOnClose) {
            setShouldRenderContent(false);
          }
        }}
      >
        <div
          className={cn(classConfig.bodyConfig({ position }), bodyClassName)}
          style={{
            pointerEvents: isContentTransitionFinish ? 'auto' : 'none',
          }}
        >
          {children}
        </div>
      </Transition>
    </div>
  );

  return renderToContainer(getContainer, node);
};

export default Popup;
