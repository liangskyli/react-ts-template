import type { ReactNode } from 'react';
import { Fragment, useState } from 'react';
import { Transition } from '@headlessui/react';
import Mask from '@/components/mask';
import type { GetContainer } from '@/utils/render-to-container.ts';
import { renderToContainer } from '@/utils/render-to-container.ts';
import { cn } from '@/utils/styles.ts';

export type Position = 'bottom' | 'top' | 'left' | 'right' | 'center';

export type PopupProps = {
  /** 是否可见 */
  visible?: boolean;
  /** 内容 */
  children?: ReactNode;
  /** 弹出位置 */
  position?: Position;
  /** 遮罩类名 */
  maskClassName?: string;
  /** 弹出层类名 */
  className?: string;
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
};

const positionStyles: Record<Position, string> = {
  bottom: 'bottom-0 left-0 right-0 max-h-[80vh]',
  top: 'top-0 left-0 right-0 max-h-[80vh]',
  left: 'left-0 top-0 bottom-0 max-w-[80vw]',
  right: 'right-0 top-0 bottom-0 max-w-[80vw]',
  center:
    'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] max-h-[80vh]',
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
> = {
  bottom: {
    enter: 'transform transition ease-out duration-300',
    enterFrom: 'translate-y-full',
    enterTo: 'translate-y-0',
    leave: 'transform transition ease-in duration-200',
    leaveFrom: 'translate-y-0',
    leaveTo: 'translate-y-full',
  },
  top: {
    enter: 'transform transition ease-out duration-300',
    enterFrom: '-translate-y-full',
    enterTo: 'translate-y-0',
    leave: 'transform transition ease-in duration-200',
    leaveFrom: 'translate-y-0',
    leaveTo: '-translate-y-full',
  },
  left: {
    enter: 'transform transition ease-out duration-300',
    enterFrom: '-translate-x-full',
    enterTo: 'translate-x-0',
    leave: 'transform transition ease-in duration-200',
    leaveFrom: 'translate-x-0',
    leaveTo: '-translate-x-full',
  },
  right: {
    enter: 'transform transition ease-out duration-300',
    enterFrom: 'translate-x-full',
    enterTo: 'translate-x-0',
    leave: 'transform transition ease-in duration-200',
    leaveFrom: 'translate-x-0',
    leaveTo: 'translate-x-full',
  },
  center: {
    enter: 'transform transition ease-out duration-300',
    enterFrom: 'opacity-0 scale-75',
    enterTo: 'opacity-100 scale-100',
    leave: 'transform transition ease-in duration-200',
    leaveFrom: 'opacity-100 scale-100',
    leaveTo: 'opacity-0 scale-75',
  },
};

const Popup = (props: PopupProps) => {
  const {
    visible = false,
    position = 'bottom',
    children,
    maskClassName,
    className,
    closeOnMaskClick = true,
    onClose,
    afterClose,
    destroyOnClose = false,
    getContainer = document.body,
    disableBodyScroll,
  } = props;

  const [isContentTransitionFinish, setIsContentTransitionFinish] =
    useState(false);

  if (!visible && destroyOnClose) {
    afterClose?.();
    return null;
  }

  const transition = transitionStyles[position];

  const node = (
    <div className="fixed z-popup">
      <Mask
        className={cn('z-0', maskClassName)}
        visible={visible}
        onMaskClick={closeOnMaskClick ? onClose : undefined}
        disableBodyScroll={disableBodyScroll}
        getContainer={null}
      />
      <Transition
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
        afterLeave={afterClose}
        unmount={destroyOnClose}
      >
        <div
          className={cn(
            'z-1 fixed overflow-auto bg-white',
            positionStyles[position],
            className,
          )}
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
