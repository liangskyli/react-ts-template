import type { PopupProps, Position } from '@/components/popup/popup.tsx';
import Popup from '@/components/popup/popup.tsx';
import * as methods from './methods.tsx';

export type { PopupProps, Position };

// eslint-disable-next-line react-refresh/only-export-components
export default Object.assign(Popup, methods);
