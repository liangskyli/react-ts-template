import type { ElementType, ReactNode } from 'react';
import { Radio as HeadlessRadio } from '@headlessui/react';
import type { RadioProps as HeadlessRadioProps } from '@headlessui/react';
import { cn } from '@/utils/styles';

export type RadioProps<
  TType extends string | number = string | number,
  TTag extends ElementType = 'span',
> = {
  /** 单选框右侧的内容 */
  children?: ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 单选框框类名 */
  boxClassName?: string;
  /** 单选框选中点类名 */
  dotClassName?: string;
  /** 单选框文本类名 */
  labelClassName?: string;
} & Omit<HeadlessRadioProps<TTag, TType>, 'className'>;

const Radio = <
  TType extends string | number = string | number,
  TTag extends ElementType = 'span',
>(
  props: RadioProps<TType, TTag>,
) => {
  const {
    value,
    children,
    className,
    boxClassName,
    dotClassName,
    labelClassName,
    ...rest
  } = props;

  return (
    <HeadlessRadio
      value={value}
      className={cn(
        'group relative flex items-center',
        '[&:not(:last-child)]:mr-1.5',
        className,
      )}
      {...rest}
    >
      {(radioRenderProp) => {
        const { checked } = radioRenderProp;
        return (
          <>
            <div
              className={cn(
                'relative inline-flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-full border transition-colors',
                'border-gray-300 bg-white',
                'group-data-[checked]:border-blue-600',
                'group-data-[disabled]:cursor-not-allowed group-data-[disabled]:opacity-40',
                'group-data-[enabled]:hover:border-blue-500',
                'active:opacity-80',
                boxClassName,
              )}
            >
              {checked && (
                <span
                  className={cn(
                    'absolute h-2.5 w-2.5 rounded-full bg-blue-600',
                    'group-data-[disabled]:opacity-40',
                    dotClassName,
                  )}
                />
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
          </>
        );
      }}
    </HeadlessRadio>
  );
};

export default Radio;
