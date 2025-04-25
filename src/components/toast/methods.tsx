import { type ReactNode } from 'react';
import { type Root, createRoot } from 'react-dom/client';
import type { GetContainer } from '@/utils/render-to-container.ts';
import { resolveContainer } from '@/utils/render-to-container.ts';
import { InternalToast, type InternalToastProps } from './internal-toast.tsx';

let container: HTMLElement | null = null;
let toastRoot: Root | null = null;

// 默认配置
let defaultConfig: Partial<IToastProps> = {
  duration: 3000,
  position: 'center',
  maskClickable: false,
  destroyOnClose: true,
};

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

const showFunction = (props: IToastProps) => {
  // 合并默认配置
  const mergedProps = { ...defaultConfig, ...props };
  const { getContainer = document.body, destroyOnClose = true } = mergedProps;

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
        <InternalToast {...mergedProps} visible={false} onClose={destroy} />,
      );
    }
  };

  toastRoot!.render(
    <InternalToast {...mergedProps} visible={true} onClose={handleClose} />,
  );

  return handleClose;
};

const show = (
  message: ReactNode,
  options?: Omit<IToastProps, 'message' | 'visible' | 'onClose'>,
) => showFunction({ message, ...options });

const config = (conf: Partial<Omit<IToastProps, 'message'>>) => {
  defaultConfig = {
    ...defaultConfig,
    ...conf,
  };
};
const clear = () => {
  destroy();
};
// 获取当前默认配置的方法（用于测试）
const getConfig = () => ({ ...defaultConfig });

export { show, config, clear, getConfig };
