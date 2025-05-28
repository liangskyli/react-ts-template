import type { ReactNode } from 'react';
import { cn } from '@/components/core/class-config';
import { createImperative } from '@/components/core/components/popup/imperative.tsx';
import Popup, {
  type PopupProps,
} from '@/components/core/components/popup/popup.tsx';
import classConfig from '@/components/core/components/toast/class-config.ts';
import type { GetContainer } from '@/components/core/utils/render-to-container.ts';

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
    <div className={classConfig.contentConfig.wrap}>
      <div className={classConfig.contentConfig.text}>{content}</div>
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
    maskClassName: cn(classConfig.maskConfig({ maskClickable }), maskClassName),
    className: cn(classConfig.toastConfig, className),
    bodyClassName: cn(
      classConfig.bodyConfig({ position: toastPosition }),
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
