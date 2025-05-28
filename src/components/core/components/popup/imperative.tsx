import { type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import type { GetContainer } from '@/components/core/utils/render-to-container.ts';
import { resolveContainer } from '@/components/core/utils/render-to-container.ts';

export type ImperativeProps = {
  visible?: boolean;
  onClose?: () => void;
  afterClose?: () => void;
  getContainer?: GetContainer;
  destroyOnClose?: boolean;
};

export type ImperativeType = 'popup' | 'toast';
export type ImperativeConfig<T> = {
  defaultConfig?: Partial<T>;
  Component: React.ComponentType;
  /** 指令类型 */
  type: ImperativeType;
};

type CloseHandler = {
  close: (ignoreAfterClose?: boolean) => void;
  timer?: number;
};

const closeFnSet = new Map</** popupId */ string, CloseHandler>();

export function createImperative<
  T extends ImperativeProps,
  C extends Partial<Omit<T, 'visible' | 'onClose' | 'getContainer'>>,
  IC extends Partial<Omit<T, 'visible' | 'onClose' | 'getContainer'>> = C,
>({ defaultConfig = {}, Component, type }: ImperativeConfig<T>) {
  let currentConfig = { ...defaultConfig };

  const show = (
    content: ReactNode,
    config?: Omit<IC, 'children'> & {
      getContainer?: Omit<GetContainer, 'null'>;
    },
  ) => {
    const popupId = `${type}-imperative-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const mergedConfig = { ...currentConfig, ...config } as T;
    const { getContainer = document.body } = mergedConfig;
    const rootElement = resolveContainer(getContainer as GetContainer);
    const container = document.createElement('div');
    rootElement.appendChild(container);
    const root = createRoot(container);

    const destroy = () => {
      if (container) {
        container.parentNode?.removeChild(container);
      }
    };

    const handleClose = (ignoreAfterClose: boolean = false) => {
      root.render(
        <Component
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          {...(mergedConfig as any)}
          visible={false}
          getContainer={null}
          destroyOnClose
          afterClose={() => {
            destroy();
            closeFnSet.delete(popupId);
            if (!ignoreAfterClose) {
              mergedConfig.afterClose?.();
            }
          }}
          popupId={popupId}
        >
          {content}
        </Component>,
      );
    };

    const closeHandler: CloseHandler = {
      close: handleClose,
    };
    closeFnSet.set(popupId, closeHandler);

    root.render(
      <Component
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {...(mergedConfig as any)}
        visible={true}
        onClose={handleClose}
        getContainer={null}
        destroyOnClose
        popupId={popupId}
      >
        {content}
      </Component>,
    );

    return closeHandler;
  };

  const config = (conf: C) => {
    currentConfig = {
      ...currentConfig,
      ...conf,
    };
  };

  const clear = (type: ImperativeType, ignoreAfterClose?: boolean) => {
    const imperativeTypePrefix = `${type}-imperative-`;
    // 先找出所有匹配的项
    const handlersToClose = Array.from(closeFnSet.entries()).filter(
      ([popupId]) => popupId.startsWith(imperativeTypePrefix),
    );
    // 处理并清除匹配的项
    handlersToClose.forEach(([popupId, handler]) => {
      if (handler.timer) {
        window.clearTimeout(handler.timer);
      }
      handler.close(ignoreAfterClose);
      closeFnSet.delete(popupId);
    });
  };

  const getConfig = () => ({ ...currentConfig }) as T;

  return {
    show,
    config,
    clear,
    getConfig,
  };
}

export function generateTimeoutFunction(
  popupId: string,
  callback: () => void,
  duration: number,
): number {
  const timer = window.setTimeout(callback, duration);

  // 通过 popupId 找到对应的 handler
  const handler = closeFnSet.get(popupId);
  if (handler) {
    handler.timer = timer;
  }

  return timer;
}
