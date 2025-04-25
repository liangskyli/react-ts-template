import { type ReactNode } from 'react';
import { type Root, createRoot } from 'react-dom/client';
import type { GetContainer } from '@/utils/render-to-container.ts';
import { resolveContainer } from '@/utils/render-to-container.ts';
import { InternalToast, type InternalToastProps } from './internal-toast.tsx';

let container: HTMLElement | null = null;
let toastRoot: Root | null = null;

const destroy = () => {
  if (container) {
    container.parentNode?.removeChild(container);
    container = null;
  }
  toastRoot = null;
};

type IToastProps = Omit<InternalToastProps, 'visible' | 'onClose'> & {
  getContainer?: Omit<GetContainer, 'null'>;
};

const show = (props: IToastProps) => {
  const { getContainer = document.body, destroyOnClose = true } = props;
  if (destroyOnClose) {
    destroy();
  }

  if (!container) {
    const toastRootElement = resolveContainer(getContainer as GetContainer);
    container = document.createElement('div');
    toastRootElement.appendChild(container);
    toastRoot = createRoot(container);
  }

  const handleClose = () => {
    if (toastRoot) {
      toastRoot.render(
        <InternalToast {...props} visible={false} onClose={destroy} />,
      );
    }
  };

  toastRoot!.render(
    <InternalToast {...props} visible={true} onClose={handleClose} />,
  );

  return handleClose;
};

const Toast = {
  show: (
    message: ReactNode,
    options?: Omit<IToastProps, 'message' | 'visible' | 'onClose'>,
  ) => show({ message, ...options }),

  clear: () => {
    // 强制销毁
    destroy();
  },
};

export type { InternalToastProps } from './internal-toast.tsx';
export default Toast;
