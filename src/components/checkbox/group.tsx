import type { ReactNode } from 'react';
import React from 'react';
import { useState } from 'react';
import { cn } from '@/utils/styles';
import { CheckboxContext } from './context';

export type CheckboxGroupProps = {
  /** 当前选中的值 */
  value?: (string | number)[];
  /** 默认选中的值 */
  defaultValue?: (string | number)[];
  /** 是否禁用 */
  disabled?: boolean;
  /** 变化时的回调函数 */
  onChange?: (value: (string | number)[]) => void;
  /** 自定义类名 */
  className?: string;
  children?: ReactNode;
};

const CheckboxGroup = (props: CheckboxGroupProps) => {
  const {
    value: valueProp,
    defaultValue = [],
    disabled = false,
    onChange,
    className,
    children,
  } = props;

  const [valueState, setValueState] = useState(defaultValue);
  const value = valueProp ?? valueState;

  const handleChange = (newValue: (string | number)[]) => {
    setValueState(newValue);
    onChange?.(newValue);
  };

  return (
    <CheckboxContext.Provider
      value={{
        value,
        disabled,
        onChange: handleChange,
      }}
    >
      <div className={cn('-m-1 flex flex-wrap', className)}>
        {React.Children.map(children, (child) => (
          <div className="m-1">{child}</div>
        ))}
      </div>
    </CheckboxContext.Provider>
  );
};

export default CheckboxGroup;
