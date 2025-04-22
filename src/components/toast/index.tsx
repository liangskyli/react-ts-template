import type { ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import type { ToastProps } from './Toast';
import { Toast as InternalToast } from './Toast';

let toastRoot: ReturnType<typeof createRoot> | null = null;
let container: HTMLDivElement | null = null;

const destroy = () => {
  if (container && toastRoot) {
    toastRoot.unmount();
    document.body.removeChild(container);
    container = null;
    toastRoot = null;
  }
};

const show = (props: Omit<ToastProps, 'visible' | 'onClose'>) => {
  if (!container) {
    container = document.createElement('div');
    document.body.appendChild(container);
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
    options?: Omit<ToastProps, 'message' | 'visible' | 'onClose'>,
  ) => show({ message, ...options }),

  clear: () => {
    destroy();
  },
};

export type { ToastProps } from './Toast';
export default Toast;
