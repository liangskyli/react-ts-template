import type { ElementType, Ref } from 'react';
import { useEffect, useState } from 'react';
import { Input as HeadlessInput } from '@headlessui/react';
import type { InputProps as HeadlessInputProps } from '@headlessui/react';
import { cn } from '@/components/class-config';
import classConfig from '@/components/input/class-config.ts';

export type InputProps<TTag extends ElementType = 'input'> = {
  /** 输入框的值 */
  value?: string;
  /** 输入框默认值 */
  defaultValue?: string;
  /** 输入框类型 */
  type?: 'text' | 'password' | 'number' | 'tel' | 'email' | 'url';
  /** 自定义类名 */
  className?: string;
  /** 值变化时的回调函数 */
  onChange?: (value: string) => void;
  /** 小数位数,只支持整数值 */
  decimalPlaces?: number;
  /** 最小值，小数位数不大于decimalPlaces位 */
  min?: number;
  /** 最大值，小数位数不大于decimalPlaces位 */
  max?: number;
  /** ref引用 */
  ref?: Ref<HTMLElement>;
} & Omit<
  HeadlessInputProps<TTag>,
  'onChange' | 'className' | 'type' | 'value' | 'min' | 'max'
>;

const Input = (props: InputProps) => {
  const {
    value,
    defaultValue,
    type = 'text',
    readOnly = false,
    maxLength,
    className,
    onChange,
    inputMode,
    decimalPlaces = 2,
    min = 0,
    max,
    onBlur,
    ...rest
  } = props;

  const [innerValue, setInnerValue] = useState(defaultValue || value || '');

  useEffect(() => {
    if (value !== undefined) {
      setInnerValue(value);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    if (value === undefined) {
      setInnerValue(newValue);
    }
    if (inputMode === 'decimal') {
      // 移除非数字和小数点
      newValue = newValue.replace(/[^\d.]/g, '');
      if (decimalPlaces > 0) {
        // 只允许一个小数点
        newValue = newValue
          .replace(/^\./g, '')
          .replace(/\.{2,}/g, '.')
          .replace('.', '$#$')
          .replace(/\./g, '')
          .replace('$#$', '.');
        // 限制小数点后最多decimalPlaces位
        const decimalIndex = newValue.indexOf('.');
        if (
          decimalIndex !== -1 &&
          newValue.length > decimalIndex + decimalPlaces + 1
        ) {
          newValue = newValue.slice(0, decimalIndex + decimalPlaces + 1);
        }
      } else {
        // 没有小数点
        newValue = newValue.replace(/^\./g, '').replace(/\./g, '');
      }
      // 去掉前面多个0
      newValue = newValue.replace(/^0+\./g, '0.');
      if (newValue.match(/^0+[1-9]+/)) {
        newValue = newValue.replace(/^0+/g, '');
      }
      setInnerValue(newValue);
    }
    onChange?.(newValue);
  };
  const handleBlur: InputProps['onBlur'] = (e) => {
    if (inputMode === 'decimal') {
      let newValue = e.target.value;
      if (newValue !== undefined && newValue !== '') {
        if (min > +newValue) {
          newValue = min + '';
        }
        if (max !== undefined && max > min && max < +newValue) {
          newValue = max + '';
        }
      } else {
        newValue = '';
      }
      // 去掉最后一位小数点
      newValue = newValue.replace(/\.?$/, '');
      // 全部0保留一个0
      newValue = newValue.replace(/^0+$/g, '0');

      setInnerValue(newValue);
      onChange?.(newValue);
      e.target.value = newValue;
    }
    onBlur?.(e);
  };

  return (
    <HeadlessInput
      type={type}
      value={innerValue}
      readOnly={readOnly}
      maxLength={maxLength}
      onChange={handleChange}
      onBlur={handleBlur}
      inputMode={inputMode}
      min={min}
      max={max}
      className={cn(classConfig.indexConfig({ readOnly }), className)}
      {...rest}
    />
  );
};

export default Input;
