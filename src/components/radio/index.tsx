import type { ElementType, ReactNode } from 'react';
import { RadioGroup as HeadlessRadioGroup } from '@headlessui/react';
import type { RadioGroupProps as HeadlessRadioGroupProps } from '@headlessui/react';
import Radio from '@/components/radio/radio.tsx';
import { cn } from '@/utils/styles';

export type RadioGroupProps<
  TType extends string | number = string | number,
  TTag extends ElementType = 'div',
> = {
  /** 自定义类名 */
  className?: string;
  children?: ReactNode;
} & Omit<HeadlessRadioGroupProps<TTag, TType>, 'className'>;

const RadioGroup = <
  TType extends string | number = string | number,
  TTag extends ElementType = 'div',
>(
  props: RadioGroupProps<TType, TTag>,
) => {
  const { className, children, ...rest } = props;

  return (
    <HeadlessRadioGroup
      className={cn('-m-1 flex flex-wrap', className)}
      {...rest}
    >
      {children}
    </HeadlessRadioGroup>
  );
};
RadioGroup.Radio = Radio;

export default RadioGroup;
