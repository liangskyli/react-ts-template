import type { ReactNode } from 'react';
import { createImperative } from '@/components/popup/imperative.tsx';
import Popup, { type PopupProps } from '@/components/popup/popup.tsx';
import type { GetContainer } from '@/utils/render-to-container.ts';
import { cn } from '@/utils/styles.ts';

// Toast的位置类型
type ToastPosition = 'top' | 'bottom' | 'center';
// Popup的位置类型
type PopupPosition = PopupProps['position'];

// Toast对外的Props类型
type ToastProps = {
  message?: ReactNode;
  position: ToastPosition;
  onClose?: () => void;
  maskClickable?: boolean;
  getContainer?: Omit<GetContainer, 'null'>;
} & Pick<
  PopupProps,
  | 'maskClassName'
  | 'className'
  | 'bodyClassName'
  | 'afterClose'
  | 'disableBodyScroll'
  | 'closeOnMaskClick'
  | 'duration'
>;
type ToastConfigProps = Omit<ToastProps, 'message' | 'onClose' | 'position'> &
  Pick<Partial<ToastProps>, 'position'>;

type ImperativeConfigProps = Omit<
  ToastProps,
  'message' | 'onClose' | 'position'
> &
  Omit<PopupProps, 'getContainer'>;

// Toast内部使用的Props类型，position使用Popup的类型
type ToastInternalProps = Omit<ToastProps, 'position' | 'getContainer'> & {
  position: PopupPosition;
};

// 默认配置
const defaultConfig: Partial<Omit<ToastProps, 'position'>> &
  Pick<ToastProps, 'position'> = {
  duration: 3000,
  position: 'center',
  maskClickable: false,
};

const imperativeToast = createImperative<
  ToastInternalProps,
  ToastConfigProps,
  ImperativeConfigProps
>({
  defaultConfig,
  Component: Popup,
  type: 'toast',
});

const positionStyles = {
  top: 'top-[20%]',
  center: 'top-1/2 -translate-y-1/2',
  bottom: 'bottom-[20%]',
};

const {
  show: showImperative,
  config,
  clear: clearImperative,
  getConfig,
} = imperativeToast;
const clear = (ignoreAfterClose?: boolean) => {
  clearImperative('toast', ignoreAfterClose);
};
const show = (
  content: ReactNode,
  config?: Partial<Omit<ToastProps, 'message'>>,
) => {
  const {
    maskClickable = false,
    maskClassName,
    className,
    bodyClassName,
    getContainer,
    afterClose,
    disableBodyScroll = true,
    closeOnMaskClick = false,
    position,
  } = config ?? {};

  // 单例模式
  clear(true);
  const newContent = (
    <div className="mx-auto w-fit min-w-[120px] rounded-lg bg-mask px-4 py-3">
      <div className="break-words text-center text-sm text-white">
        {content}
      </div>
    </div>
  );
  const { position: defaultConfigPosition } = getConfig();

  // Toast的position用于样式定位，而Popup的position设为none
  const toastPosition = position ?? (defaultConfigPosition as ToastPosition);

  return showImperative(newContent, {
    ...config,
    // 统一设置为none
    position: 'none',
    // 强制关闭时销毁内容
    destroyOnClose: true,
    maskClassName: cn(
      'bg-mask/0',
      { 'pointer-events-auto': !maskClickable },
      { 'pointer-events-none': maskClickable },
      maskClassName,
    ),
    className: cn('z-toast', className),
    bodyClassName: cn(
      'bg-transparent left-1/2 -translate-x-1/2 w-[80vw] max-h-[80vh]',
      positionStyles[toastPosition],
      bodyClassName,
    ),
    getContainer,
    disableBodyScroll,
    closeOnMaskClick,
    afterClose: () => {
      afterClose?.();
    },
  });
};

export { show, config, clear, getConfig };
