import type { ElementType, ReactNode, Ref } from 'react';
import { Switch as HeadlessSwitch } from '@headlessui/react';
import type { SwitchProps as HeadlessSwitchProps } from '@headlessui/react';
import classConfig from '@/components/core/components/switch/class-config.ts';
import { DefaultLoadingIcon } from '@/components/core/components/switch/icons.tsx';
import { getSemanticClassNames } from '@/components/core/utils/get-semantic-class-names.ts';

const classConfigData = classConfig();

type SemanticClassNames = {
  /** 自定义类名 */
  root?: string;
  /** 开关轨道类名 */
  track?: string;
  /** 开关滑块类名 */
  thumb?: string;
  /** 选中时的文本类名 */
  checkedText?: string;
  /** 非选中时的文本类名 */
  uncheckedText?: string;
};

export type SwitchProps<TTag extends ElementType = 'button'> = {
  /** 开关是否选中 */
  checked?: boolean;
  /** 默认是否选中 */
  defaultChecked?: boolean;
  /** 变化时的回调函数 */
  onChange?: (checked: boolean) => void;
  /** 是否禁用 */
  disabled?: boolean;
  /** 自定义类名 或 语义化的类名 */
  className?: string | SemanticClassNames;
  /** 开关轨道类名 */
  trackClassName?: string;
  /** 开关滑块类名 */
  thumbClassName?: string;
  /** 开关右侧的内容 */
  children?: ReactNode;
  /** 加载状态 */
  loading?: boolean;
  /** 选中时的文本 */
  checkedText?: ReactNode;
  /** 非选中时的文本 */
  uncheckedText?: ReactNode;
  /** 选中时的文本类名 */
  checkedTextClassName?: string;
  /** 非选中时的文本类名 */
  uncheckedTextClassName?: string;
  /** ref引用 */
  ref?: Ref<HTMLButtonElement>;
} & Omit<HeadlessSwitchProps<TTag>, 'checked' | 'onChange' | 'className'>;

const Switch = <TTag extends ElementType = 'button'>(
  props: SwitchProps<TTag>,
) => {
  const {
    checked,
    defaultChecked,
    onChange,
    disabled = false,
    className,
    trackClassName,
    thumbClassName,
    children,
    loading = false,
    checkedText,
    uncheckedText,
    checkedTextClassName,
    uncheckedTextClassName,
    ...rest
  } = props;
  const classNames = getSemanticClassNames<SemanticClassNames>(className);

  const isDisabled = disabled || loading;

  return (
    <div className={classConfigData.switch({ className: classNames?.root })}>
      <HeadlessSwitch
        checked={checked}
        defaultChecked={defaultChecked}
        onChange={onChange}
        disabled={isDisabled}
        className={classConfigData.switchTrack({
          className: classNames?.track ?? trackClassName,
        })}
        {...rest}
      >
        <div className={classConfigData.switchChildrenWrap()}>
          <span
            className={classConfigData.switchCheckedText({
              className: classNames?.checkedText ?? checkedTextClassName,
            })}
          >
            {checkedText}
          </span>
          <span
            className={classConfigData.switchThumb({
              className: classNames?.thumb ?? thumbClassName,
            })}
          >
            {loading && <DefaultLoadingIcon />}
          </span>
          <span
            className={classConfigData.switchUncheckedText({
              className: classNames?.uncheckedText ?? uncheckedTextClassName,
            })}
          >
            {uncheckedText}
          </span>
        </div>
      </HeadlessSwitch>
      {children}
    </div>
  );
};

export default Switch;
