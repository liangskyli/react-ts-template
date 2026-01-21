import type { MouseEvent, ReactNode } from 'react';
import { Fragment, useRef } from 'react';
import { Transition } from '@headlessui/react';
import classConfig from '@/components/core/components/mask/class-config.ts';
import {
  type GetContainer,
  renderToContainer,
} from '@/components/core/utils/render-to-container.ts';
import { useLockScroll } from '@/components/core/utils/use-lock-scroll.ts';

const classConfigData = classConfig();

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
      className={classConfigData.content({ className })}
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
      enter={classConfigData.transitionEnter()}
      enterFrom={classConfigData.transitionEnterFrom()}
      enterTo={classConfigData.transitionEnterTo()}
      leave={classConfigData.transitionLeave()}
      leaveFrom={classConfigData.transitionLeaveFrom()}
      leaveTo={classConfigData.transitionLeaveTo()}
      unmount={destroyOnClose}
      afterLeave={afterClose}
    >
      {maskContent}
    </Transition>
  );

  return renderToContainer(getContainer, node);
};
export default Mask;
