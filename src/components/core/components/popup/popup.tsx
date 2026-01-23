import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { Fragment, useState } from 'react';
import { Transition } from '@headlessui/react';
import Mask from '@/components/core/components/mask';
import type { PopupVariants } from '@/components/core/components/popup/class-config.ts';
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
} & PopupVariants;

const {
  popupBase,
  mask,
  body,
  enter,
  enterFrom,
  enterTo,
  leave,
  leaveFrom,
  leaveTo,
} = classConfig();

const Popup = (props: PopupProps) => {
  const {
    visible = false,
    position,
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
  const [popupId] = useState(
    () =>
      defaultPopupId ??
      `auto-generate-popup-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  );
  const [isContentTransitionFinish, setIsContentTransitionFinish] =
    useState(false);
  const [shouldRenderContent, setShouldRenderContent] = useState(visible);

  // 当 visible 变为 true 时，设置 shouldRenderContent 为 true
  if (visible && !shouldRenderContent) {
    setShouldRenderContent(true);
  }

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

  const node = (
    <div
      data-testid="popup"
      className={popupBase({ className })}
      data-popup-id={popupId}
    >
      <Mask
        className={mask({ className: maskClassName })}
        visible={visible}
        onMaskClick={closeOnMaskClick ? onClose : undefined}
        disableBodyScroll={disableBodyScroll}
        getContainer={null}
      />
      <Transition
        appear
        show={visible}
        as={Fragment}
        enter={enter({ position })}
        enterFrom={enterFrom({ position })}
        enterTo={enterTo({ position })}
        leave={leave({ position })}
        leaveFrom={leaveFrom({ position })}
        leaveTo={leaveTo({ position })}
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
          className={body({ position, className: bodyClassName })}
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
