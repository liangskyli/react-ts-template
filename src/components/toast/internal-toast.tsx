import type { ReactNode } from 'react';
import { useEffect } from 'react';
import type { PopupProps } from '@/components/popup';
import Popup from '@/components/popup';
import Toast from '@/components/toast/index.tsx';
import { cn } from '@/utils/styles.ts';

export type InternalToastProps = {
  message?: ReactNode;
  duration?: number;
  position?: 'top' | 'bottom' | 'center';
  visible: boolean;
  onClose?: () => void;
  maskClickable?: boolean;
} & Pick<
  PopupProps,
  | 'maskClassName'
  | 'className'
  | 'bodyClassName'
  | 'afterClose'
  | 'destroyOnClose'
>;

export const InternalToast = (props: InternalToastProps) => {
  const {
    message,
    duration = 3000,
    position = 'center',
    visible,
    onClose,
    afterClose,
    maskClickable = false,
    destroyOnClose = true,
    maskClassName,
    className,
    bodyClassName,
  } = props;

  useEffect(() => {
    if (visible && duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  const positionStyles = {
    top: 'top-[20%]',
    center: 'top-1/2 -translate-y-1/2',
    bottom: 'bottom-[20%]',
  };

  const popupAfterClose = () => {
    if (destroyOnClose) {
      Toast.clear();
    }
    afterClose?.();
  };

  return (
    <Popup
      visible={visible}
      position="center"
      maskClassName={cn(
        'bg-mask/0',
        { 'pointer-events-auto': !maskClickable },
        { 'pointer-events-none': maskClickable },
        maskClassName,
      )}
      className={cn('z-toast', className)}
      bodyClassName={cn(
        'w-[80vw] bg-transparent',
        positionStyles[position],
        bodyClassName,
      )}
      afterClose={popupAfterClose}
      disableBodyScroll={!maskClickable}
      destroyOnClose={destroyOnClose}
      getContainer={null}
    >
      <div className="mx-auto w-fit min-w-[120px] rounded-lg bg-mask px-4 py-3">
        {message && (
          <div className="break-words text-center text-sm text-white">
            {message}
          </div>
        )}
      </div>
    </Popup>
  );
};
