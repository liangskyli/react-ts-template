import type { ElementType, ReactNode, Ref } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import type { RefCallBack } from 'react-hook-form';
import { RadioGroup as HeadlessRadioGroup } from '@headlessui/react';
import type { RadioGroupProps as HeadlessRadioGroupProps } from '@headlessui/react';
import Radio from '@/components/radio/radio.tsx';
import { cn } from '@/utils/styles';

export type RadioGroupProps<
  TType = string,
  TTag extends ElementType = 'div',
> = {
  /** 自定义类名 */
  className?: string;
  children?: ReactNode;
  /** react-hook-form ref */
  formRef?: RefCallBack;
  /** ref引用 */
  ref?: Ref<HTMLElement>;
} & Omit<HeadlessRadioGroupProps<TTag, TType>, 'className'>;

const RadioGroupBase = <TType = string, TTag extends ElementType = 'div'>(
  props: RadioGroupProps<TType, TTag>,
) => {
  const { className, children, formRef, value, ...rest } = props;
  const radioGroupRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!formRef) return;

    const refObject = {
      ...formRef,
      focus: () => {
        // 聚焦到第一个 Radio 元素
        const firstRadio =
          radioGroupRef.current?.querySelector('[role="radio"]');
        if (firstRadio) {
          (firstRadio as HTMLElement).focus();
        }
      },
    };

    formRef(refObject);
  }, [formRef]);

  return (
    <HeadlessRadioGroup
      ref={radioGroupRef}
      className={cn('flex flex-wrap', className)}
      value={value}
      {...rest}
    >
      {children}
    </HeadlessRadioGroup>
  );
};
type RadioGroupType = typeof RadioGroupBase & {
  Radio: typeof Radio;
};
const RadioGroup = RadioGroupBase as RadioGroupType;
RadioGroup.Radio = Radio;

export default RadioGroup;
