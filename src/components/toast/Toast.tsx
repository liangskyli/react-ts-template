import type { ReactNode } from 'react';
import { useEffect } from 'react';
import Popup from '@/components/popup';
import { cn } from '@/utils/styles.ts';

export type ToastProps = {
  message?: ReactNode;
  duration?: number;
  position?: 'top' | 'bottom' | 'center';
  visible: boolean;
  onClose?: () => void;
  afterClose?: () => void;
  maskClickable?: boolean;
  /** 是否在关闭时销毁内容 */
  destroyOnClose?: boolean;
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
    destroyOnClose = true,
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
    <Popup
      visible={visible}
      position="center"
      maskClassName={cn(
        'bg-mask/0',
        { 'pointer-events-auto': !maskClickable },
        { 'pointer-events-none': maskClickable },
      )}
      className={cn('w-[80vw] bg-transparent', positionStyles[position])}
      afterClose={afterClose}
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
