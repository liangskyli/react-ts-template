import type { ElementType, ReactNode, Ref } from 'react';
import { useEffect } from 'react';
import { useContext, useState } from 'react';
import { Checkbox as HeadlessCheckbox } from '@headlessui/react';
import type { CheckboxProps as HeadlessCheckboxProps } from '@headlessui/react';
import { cn } from '@/components/core/class-config';
import classConfig from '@/components/core/components/checkbox/class-config.ts';
import { CheckboxContext } from './context.tsx';
import CheckboxGroup from './group.tsx';
import type { CheckboxGroupProps } from './group.tsx';
import { DefaultCheckedIcon, DefaultIndeterminateIcon } from './icons.tsx';

const classConfigData = classConfig();

export type { CheckboxGroupProps };

export type CheckboxProps<T extends ElementType = 'span'> = {
  /** 复选框的值，用于 Group 模式 */
  value?: string | number;
  /** 是否全部自定义 */
  isCustom?: boolean;
  /** 复选框右侧的内容或全部自定义内容 */
  children?: ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 复选框框类名 */
  boxClassName?: string;
  /** 复选框勾选图标类名 */
  checkClassName?: string;
  /** 复选框文本类名 */
  labelClassName?: string;
  /** 是否为半选状态, 优先级高于checked状态 */
  indeterminate?: boolean;
  /** 自定义勾选图标 */
  checkedIcon?: ReactNode;
  /** 自定义半选图标 */
  indeterminateIcon?: ReactNode;
  /** ref引用 */
  ref?: Ref<HTMLElement>;
} & Omit<HeadlessCheckboxProps<T>, 'className' | 'value'>;

const CheckboxBase = <T extends ElementType = 'span'>(
  props: CheckboxProps<T>,
) => {
  const {
    value,
    isCustom,
    checked: checkedProp,
    defaultChecked,
    disabled = false,
    onChange,
    children,
    className,
    boxClassName,
    checkClassName,
    labelClassName,
    indeterminate = false,
    checkedIcon = <DefaultCheckedIcon />,
    indeterminateIcon = <DefaultIndeterminateIcon />,
    ...rest
  } = props;

  const group = useContext(CheckboxContext);
  const isInGroup = group.onChange !== undefined;

  const [innerChecked, setInnerChecked] = useState(defaultChecked ?? false);
  const handleChange = (checked: boolean) => {
    if (isInGroup) {
      const groupValue = group.value;
      const newValue = checked
        ? value
          ? [...groupValue, value]
          : [...groupValue]
        : groupValue.filter((v) => v !== value);
      group.onChange?.(newValue);
    } else {
      setInnerChecked(checked);
      onChange?.(checked);
    }
  };

  useEffect(() => {
    if (isInGroup) {
      const groupValue = group.value;
      setInnerChecked(value ? groupValue.includes(value) : false);
    } else {
      setInnerChecked(checkedProp ?? innerChecked);
    }
  }, [checkedProp, group.value, innerChecked, isInGroup, value]);

  const isDisabled = disabled || (isInGroup && group.disabled);

  return (
    <HeadlessCheckbox
      checked={innerChecked}
      onChange={handleChange}
      disabled={isDisabled}
      className={cn(classConfigData.checkbox({ className }))}
      indeterminate={indeterminate}
      {...rest}
    >
      <>
        {isCustom ? (
          <>{children}</>
        ) : (
          <>
            <div
              className={cn(classConfigData.box({ className: boxClassName }))}
            >
              {indeterminate ? (
                <span
                  className={cn(
                    classConfigData.checked({ className: checkClassName }),
                  )}
                >
                  {indeterminateIcon}
                </span>
              ) : (
                innerChecked && (
                  <span
                    className={cn(
                      classConfigData.checked({ className: checkClassName }),
                    )}
                  >
                    {checkedIcon}
                  </span>
                )
              )}
            </div>
            {children && (
              <span
                className={cn(
                  classConfigData.label({ className: labelClassName }),
                )}
              >
                {children}
              </span>
            )}
          </>
        )}
      </>
    </HeadlessCheckbox>
  );
};

type CheckboxType = typeof CheckboxBase & {
  Group: typeof CheckboxGroup;
};
const Checkbox = CheckboxBase as CheckboxType;
Checkbox.Group = CheckboxGroup;

export default Checkbox;

export { DefaultCheckedIcon, DefaultIndeterminateIcon };
