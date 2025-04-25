import { type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import type { GetContainer } from '@/utils/render-to-container';
import { resolveContainer } from '@/utils/render-to-container';
import Popup, { type PopupProps } from './popup.tsx';

// 默认配置
let defaultConfig: Partial<PopupConfigProps> = {
  position: 'center',
};

export const closeFnSet = new Set<() => void>();

type PopupConfigProps = Omit<
  PopupProps,
  'children' | 'visible' | 'onClose' | 'getContainer' | 'destroyOnClose'
> & {
  getContainer?: Omit<GetContainer, 'null'>;
};

const show = (content: ReactNode, config?: PopupConfigProps) => {
  // 合并默认配置
  const mergedConfig = { ...defaultConfig, ...config };
  const { getContainer = document.body } = mergedConfig;

  const popupRootElement = resolveContainer(getContainer as GetContainer);
  const container: HTMLElement = document.createElement('div');
  popupRootElement.appendChild(container);
  const popupRoot = createRoot(container);

  const handleClose = () => {
    popupRoot.render(
      <Popup
        {...mergedConfig}
        visible={false}
        getContainer={null}
        destroyOnClose
        afterClose={() => {
          container.parentNode?.removeChild(container);
          closeFnSet.delete(handleClose);
          mergedConfig.afterClose?.();
        }}
      >
        {content}
      </Popup>,
    );
  };

  closeFnSet.add(handleClose);

  popupRoot.render(
    <Popup
      {...mergedConfig}
      visible={true}
      onClose={handleClose}
      getContainer={null}
      destroyOnClose
    >
      {content}
    </Popup>,
  );

  return { close: handleClose };
};

const config = (conf: Partial<PopupConfigProps>) => {
  defaultConfig = {
    ...defaultConfig,
    ...conf,
  };
};

const clear = () => {
  closeFnSet.forEach((close) => {
    close();
  });
};

export default {
  show,
  config,
  clear,
};
