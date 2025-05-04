import type { ElementType, ReactNode } from 'react';
import { Switch as HeadlessSwitch } from '@headlessui/react';
import type { SwitchProps as HeadlessSwitchProps } from '@headlessui/react';
import { DefaultLoadingIcon } from '@/components/switch/icons.tsx';
import { cn } from '@/utils/styles';

export type SwitchProps<TTag extends ElementType = 'button'> = {
  /** 开关是否选中 */
  checked?: boolean;
  /** 默认是否选中 */
  defaultChecked?: boolean;
  /** 变化时的回调函数 */
  onChange?: (checked: boolean) => void;
  /** 是否禁用 */
  disabled?: boolean;
  /** 自定义类名 */
  className?: string;
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

  const isDisabled = disabled || loading;

  return (
    <div className={cn('flex items-center', className)}>
      <HeadlessSwitch
        checked={checked}
        defaultChecked={defaultChecked}
        onChange={onChange}
        disabled={isDisabled}
        className={cn(
          'group relative inline-flex shrink-0 cursor-pointer rounded-full border transition-colors duration-200 ease-in-out',
          'focus:outline-none',
          'border-gray-200 bg-white px-[1px]',
          'data-[checked]:border-blue-600 data-[checked]:bg-blue-600',
          'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40',
          // track
          'h-[30px] min-w-[54px]',
          trackClassName,
        )}
        {...rest}
      >
        <div className="flex h-full w-full items-center justify-between">
          <span
            className={cn(
              'mx-2 hidden text-xs text-white transition-opacity duration-200 group-data-[checked]:inline',
              checkedTextClassName,
            )}
          >
            {checkedText}
          </span>
          <span
            className={cn(
              'pointer-events-none rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out',
              'flex items-center justify-center',
              'border border-gray-200',
              // thumb 滑块尺寸
              'h-[24px] w-[24px]',
              // translate
              'translate-x-0',
              'group-data-[checked]:translate-x-[calc(100%-24px)]',
              thumbClassName,
            )}
          >
            {loading && <DefaultLoadingIcon />}
          </span>
          <span
            className={cn(
              'mx-2 inline text-xs text-gray-700 transition-opacity duration-200 group-data-[checked]:hidden',
              uncheckedTextClassName,
            )}
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
