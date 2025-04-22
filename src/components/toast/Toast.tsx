import type { ReactNode } from 'react';
import { useEffect } from 'react';
import Mask from '@/components/mask';
import { cn } from '@/utils/styles.ts';

export type ToastProps = {
  message?: ReactNode;
  duration?: number;
  position?: 'top' | 'bottom' | 'center';
  visible: boolean;
  onClose?: () => void;
  afterClose?: () => void;
  maskClickable?: boolean;
};

export const Toast = (props: ToastProps) => {
  const {
    message,
    duration = 3000,
    position = 'center',
    visible,
    onClose,
    afterClose,
    maskClickable = false,
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

  return (
    <Mask
      visible={visible}
      className={cn(
        'bg-mask/0',
        { 'pointer-events-auto': !maskClickable },
        { 'pointer-events-none': maskClickable },
      )}
      afterClose={afterClose}
      disableBodyScroll={!maskClickable}
    >
      <div
        className={cn(
          'absolute left-1/2 z-10 w-[80vw] -translate-x-1/2',
          positionStyles[position],
        )}
      >
        <div className="mx-auto w-fit min-w-[120px] rounded-lg bg-mask px-4 py-3">
          {message && (
            <div className="break-words text-center text-sm text-white">
              {message}
            </div>
          )}
        </div>
      </div>
    </Mask>
  );
};
