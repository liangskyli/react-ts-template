import type { ElementType, ReactNode, Ref } from 'react';
import { useContext, useState } from 'react';
import { Checkbox as HeadlessCheckbox } from '@headlessui/react';
import type { CheckboxProps as HeadlessCheckboxProps } from '@headlessui/react';
import classConfig from '@/components/checkbox/class-config.ts';
import { cn } from '@/utils/styles';
import { CheckboxContext } from './context';
import CheckboxGroup from './group';
import type { CheckboxGroupProps } from './group';
import { DefaultCheckedIcon, DefaultIndeterminateIcon } from './icons';

export type { CheckboxGroupProps };

export type CheckboxProps<T extends ElementType = 'span'> = {
  /** 复选框的值 */
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
  /** 是否为半选状态 */
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

  const [checkedState, setCheckedState] = useState(defaultChecked ?? false);

  let checked: boolean;
  let handleChange: (checked: boolean) => void;

  if (isInGroup && value !== undefined) {
    const groupValue = group.value;
    checked = groupValue.includes(value);
    handleChange = (checked: boolean) => {
      const newValue = checked
        ? [...groupValue, value]
        : groupValue.filter((v) => v !== value);
      group.onChange?.(newValue);
    };
  } else {
    checked = checkedProp ?? checkedState;
    handleChange = (newChecked: boolean) => {
      setCheckedState(newChecked);
      onChange?.(newChecked);
    };
  }

  const isDisabled = disabled || (isInGroup && group.disabled);

  return (
    <HeadlessCheckbox
      checked={checked}
      onChange={handleChange}
      disabled={isDisabled}
      className={cn(classConfig.checkboxConfig, className)}
      indeterminate={indeterminate}
      {...rest}
    >
      <>
        {isCustom ? (
          <>{children}</>
        ) : (
          <>
            <div className={cn(classConfig.boxConfig, boxClassName)}>
              {(checked || indeterminate) && (
                <span className={cn(classConfig.checkedConfig, checkClassName)}>
                  {checked && indeterminate
                    ? indeterminateIcon
                    : checked && checkedIcon}
                </span>
              )}
            </div>
            {children && (
              <span className={cn(classConfig.labelConfig, labelClassName)}>
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
