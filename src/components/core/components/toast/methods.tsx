import type { ReactNode } from 'react';
import { createImperative } from '@/components/core/components/popup/imperative.tsx';
import Popup, {
  type PopupProps,
  type SemanticClassNames,
} from '@/components/core/components/popup/popup.tsx';
import type { ToastVariants } from '@/components/core/components/toast/class-config.ts';
import classConfig from '@/components/core/components/toast/class-config.ts';
import { getSemanticClassNames } from '@/components/core/utils/get-semantic-class-names.ts';
import type { GetContainer } from '@/components/core/utils/render-to-container.ts';

const classConfigData = classConfig();

// Toast的位置类型
type ToastPosition = ToastVariants['position'];
// Popup的位置类型
type PopupPosition = PopupProps['position'];

// Toast对外的Props类型
type ToastProps = {
  message?: ReactNode;
  onClose?: () => void;
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
> &
  ToastVariants;
type ToastConfigProps = Omit<ToastProps, 'message' | 'onClose'>;

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
const defaultConfig: Partial<ToastProps> = {
  duration: 3000,
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
    maskClickable,
    maskClassName,
    className,
    bodyClassName,
    getContainer,
    afterClose,
    disableBodyScroll = true,
    closeOnMaskClick = false,
    position,
  } = config ?? {};
  const classNames = getSemanticClassNames<SemanticClassNames>(className);

  // 单例模式
  clear(true);
  const newContent = (
    <div className={classConfigData.contentWrap()}>
      <div className={classConfigData.contentText()}>{content}</div>
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
    className: {
      root: classConfigData.toast({ className: classNames?.root }),
      mask: classConfigData.mask({
        maskClickable,
        className: classNames?.mask ?? maskClassName,
      }),
      body: classConfigData.body({
        position: toastPosition,
        className: classNames?.body ?? bodyClassName,
      }),
    },
    getContainer,
    disableBodyScroll,
    closeOnMaskClick,
    afterClose: () => {
      afterClose?.();
    },
  });
};

export { show, config, clear, getConfig };
