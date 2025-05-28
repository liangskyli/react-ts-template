import type { ReactNode, Ref } from 'react';
import { useEffect, useRef } from 'react';
import { useState } from 'react';
import type { RefCallBack } from 'react-hook-form';
import { cn } from '@/components/core/class-config';
import classConfig from '@/components/core/components/checkbox/class-config.ts';
import { CheckboxContext } from './context.tsx';

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
  /** react-hook-form ref */
  formRef?: RefCallBack;
};

const CheckboxGroup = (props: CheckboxGroupProps) => {
  const {
    value: valueProp,
    defaultValue = [],
    disabled = false,
    onChange,
    className,
    children,
    formRef,
  } = props;

  const [valueState, setValueState] = useState(defaultValue);
  const value = valueProp ?? valueState;
  const checkboxGroupRef: Ref<HTMLDivElement> | undefined = useRef(null);

  useEffect(() => {
    if (!formRef) return;

    const refObject = {
      ...formRef,
      focus: () => {
        // 聚焦到第一个 Checkbox 元素
        const firstCheckbox =
          checkboxGroupRef.current?.querySelector('[role="checkbox"]');
        if (firstCheckbox) {
          (firstCheckbox as HTMLElement).focus();
        }
      },
    };

    formRef(refObject);
  }, [formRef]);

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
      <div
        ref={checkboxGroupRef}
        className={cn(classConfig.groupConfig, className)}
      >
        {children}
      </div>
    </CheckboxContext.Provider>
  );
};

export default CheckboxGroup;
