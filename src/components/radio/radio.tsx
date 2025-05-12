import type { ElementType, ReactNode, Ref } from 'react';
import { Radio as HeadlessRadio } from '@headlessui/react';
import type { RadioProps as HeadlessRadioProps } from '@headlessui/react';
import { cn } from '@/utils/styles';

export type RadioProps<TType = string, TTag extends ElementType = 'span'> = {
  /** 是否全部自定义 */
  isCustom?: boolean;
  /** 单选框右侧的内容或全部自定义内容 */
  children?: ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 单选框框类名 */
  boxClassName?: string;
  /** 单选框选中点类名 */
  dotClassName?: string;
  /** 单选框文本类名 */
  labelClassName?: string;
  /** ref引用 */
  ref?: Ref<HTMLElement>;
} & Omit<HeadlessRadioProps<TTag, TType>, 'className'>;

const Radio = <TType = string, TTag extends ElementType = 'span'>(
  props: RadioProps<TType, TTag>,
) => {
  const {
    isCustom,
    value,
    children,
    className,
    boxClassName,
    dotClassName,
    labelClassName,
    onClick,
    ...rest
  } = props;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleClick = (e: any) => {
    // 调用原始的 onClick 处理函数
    onClick?.(e);

    const radio = e.currentTarget;
    // 如果当前已选中，触发自定义事件
    if (radio.getAttribute('data-headlessui-state')?.includes('checked')) {
      // 创建并分发自定义事件，携带要取消选择的值
      const radioGroup = radio.closest('[role="radiogroup"]');
      if (radioGroup) {
        const customEvent = new CustomEvent('radio-deselect', {
          detail: { value },
        });
        radioGroup.dispatchEvent(customEvent);
      }
    }
  };

  return (
    <HeadlessRadio
      value={value}
      className={cn(
        'group relative flex items-center focus:outline-none',
        '[&:not(:last-child)]:mr-1.5',
        'active:opacity-80',
        'data-[disabled]:opacity-40',
        className,
      )}
      onClick={handleClick}
      {...rest}
    >
      {(radioRenderProp) => {
        const { checked } = radioRenderProp;
        return (
          <>
            {isCustom ? (
              <>{children}</>
            ) : (
              <>
                <div
                  className={cn(
                    'relative inline-flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-full border transition-colors',
                    'border-gray-300 bg-white',
                    'group-data-[checked]:border-blue-600',
                    'group-data-[disabled]:cursor-not-allowed',
                    'group-data-[hover]:hover:border-blue-500',
                    boxClassName,
                  )}
                >
                  {checked && (
                    <span
                      className={cn(
                        'absolute h-2.5 w-2.5 rounded-full bg-blue-600',
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
                      'group-data-[disabled]:cursor-not-allowed',
                      labelClassName,
                    )}
                  >
                    {children}
                  </span>
                )}
              </>
            )}
          </>
        );
      }}
    </HeadlessRadio>
  );
};

export default Radio;
