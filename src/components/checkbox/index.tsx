import type { ElementType, ReactNode } from 'react';
import { useContext, useState } from 'react';
import { Checkbox as HeadlessCheckbox } from '@headlessui/react';
import type { CheckboxProps as HeadlessCheckboxProps } from '@headlessui/react';
import { cn } from '@/utils/styles';
import { CheckboxContext } from './context';
import CheckboxGroup from './group';
import type { CheckboxGroupProps } from './group';
import { DefaultCheckedIcon, DefaultIndeterminateIcon } from './icons';

export type { CheckboxGroupProps };

export type CheckboxProps<T extends ElementType = 'span'> = {
  /** 复选框的值 */
  value?: string | number;
  /** 复选框右侧的内容 */
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
} & Omit<HeadlessCheckboxProps<T>, 'className' | 'value'>;

const Checkbox = <T extends ElementType = 'span'>(props: CheckboxProps<T>) => {
  const {
    value,
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
      className={cn(
        'group relative flex items-center focus:outline-none',
        '[&:not(:last-child)]:mr-1.5',
        className,
      )}
      indeterminate={indeterminate}
      {...rest}
    >
      <div
        className={cn(
          'relative inline-flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded border transition-colors',
          'border-gray-300 bg-white',
          'group-data-[checked]:border-blue-600 group-data-[checked]:bg-blue-600',
          'group-data-[disabled]:cursor-not-allowed group-data-[disabled]:opacity-40',
          'group-data-[enabled]:hover:border-blue-500',
          'active:opacity-80',
          boxClassName,
        )}
      >
        {(checked || indeterminate) && (
          <span
            className={cn(
              'absolute h-3 w-3 text-white',
              'group-data-[disabled]:text-opacity-40',
              checkClassName,
            )}
          >
            {checked && indeterminate
              ? indeterminateIcon
              : checked && checkedIcon}
          </span>
        )}
      </div>
      {children && (
        <span
          className={cn(
            'ml-2 cursor-pointer select-none',
            'text-gray-700',
            'group-data-[disabled]:cursor-not-allowed group-data-[disabled]:text-gray-400',
            labelClassName,
          )}
        >
          {children}
        </span>
      )}
    </HeadlessCheckbox>
  );
};

Checkbox.Group = CheckboxGroup;

export default Checkbox;

export { DefaultCheckedIcon, DefaultIndeterminateIcon };
