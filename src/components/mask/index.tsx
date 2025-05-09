import type { MouseEvent, ReactNode } from 'react';
import { Fragment, useRef } from 'react';
import { Transition } from '@headlessui/react';
import {
  type GetContainer,
  renderToContainer,
} from '@/utils/render-to-container.ts';
import { cn } from '@/utils/styles.ts';
import { useLockScroll } from '@/utils/use-lock-scroll.ts';

export type MaskProps = {
  /** 自定义类名 */
  className?: string;
  /** 是否可见 */
  visible?: boolean;
  /** 点击蒙层自身时触发 */
  onMaskClick?: (event: MouseEvent<HTMLDivElement>) => void;
  /** 指定挂载的节点 */
  getContainer?: GetContainer;
  /** 蒙层的内容 */
  children?: ReactNode;
  /** 是否在关闭时销毁子元素 */
  destroyOnClose?: boolean;
  /** 是否禁用 body 滚动 */
  disableBodyScroll?: boolean;
  afterClose?: () => void;
};
const Mask = (props: MaskProps) => {
  const {
    visible = false,
    children,
    getContainer = document.body,
    className = '',
    onMaskClick,
    destroyOnClose = false,
    disableBodyScroll = true,
    afterClose,
  } = props;

  const ref = useRef<HTMLDivElement>(null);
  useLockScroll(ref, visible && disableBodyScroll);

  // 如果不可见且需要销毁，直接返回 null
  if (!visible && destroyOnClose) {
    return null;
  }

  const maskContent = (
    <div
      ref={ref}
      className={cn('fixed inset-0 z-mask bg-mask', className)}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onMaskClick?.(e);
        }
      }}
    >
      {children}
    </div>
  );

  const node = (
    <Transition
      show={visible}
      as={Fragment}
      enter="transition-opacity duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      unmount={destroyOnClose}
      afterLeave={afterClose}
    >
      {maskContent}
    </Transition>
  );

  return renderToContainer(getContainer, node);
};
export default Mask;
