import { createImperative } from '@/components/popup/imperative.tsx';
import type { PopupProps } from './popup.tsx';
import Popup from './popup.tsx';

type PopupConfigProps = Omit<
  PopupProps,
  'children' | 'visible' | 'onClose' | 'getContainer' | 'destroyOnClose'
>;

const imperativePopup = createImperative<PopupProps, PopupConfigProps>({
  defaultConfig: {
    position: 'center',
  },
  Component: Popup,
  type: 'popup',
});

const { show, config, clear: clearImperative, getConfig } = imperativePopup;
const clear = (ignoreAfterClose?: boolean) => {
  clearImperative('popup', ignoreAfterClose);
};

export { show, config, clear, getConfig };
