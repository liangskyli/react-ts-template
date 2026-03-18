import type {
  PopupProps,
  Position,
} from '@/components/core/components/popup/popup.tsx';
import Popup from '@/components/core/components/popup/popup.tsx';
import * as methods from './methods.tsx';

export type { PopupProps, Position };

export default Object.assign(Popup, methods);
