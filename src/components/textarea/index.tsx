import type { Ref } from 'react';
import { useEffect, useRef, useState } from 'react';
import { Textarea as HeadlessTextarea } from '@headlessui/react';
import type { TextareaProps as HeadlessTextareaProps } from '@headlessui/react';
import classConfig from '@/components/textarea/class-config.ts';
import { cn } from '@/utils/styles';

export type TextAreaProps = {
  /** 输入框的值 */
  value?: string;
  /** 输入框默认值 */
  defaultValue?: string;
  /** 是否显示字数统计 */
  showCount?: boolean;
  /** 自动高度 */
  autoSize?: boolean | { minRows?: number; maxRows?: number };
  /** 自定义类名 */
  className?: string;
  /** 输入框类名 */
  textareaClassName?: string;
  /** 字数统计类名 */
  countClassName?: string;
  /** 值变化时的回调函数 */
  onChange?: (value: string) => void;
  /** ref引用 */
  ref?: Ref<HTMLTextAreaElement>;
} & Omit<HeadlessTextareaProps, 'onChange' | 'className'>;

function TextArea(props: TextAreaProps) {
  const {
    value,
    defaultValue,
    maxLength,
    showCount = false,
    autoSize = false,
    className,
    textareaClassName,
    countClassName,
    onChange,
    ref,
    readOnly = false,
    ...rest
  } = props;

  const [innerValue, setInnerValue] = useState(defaultValue || value || '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 合并外部传入的ref和内部的ref
  const mergedRef = (node: HTMLTextAreaElement) => {
    textareaRef.current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };

  useEffect(() => {
    if (value !== undefined) {
      setInnerValue(value);
    }
  }, [value]);

  useEffect(() => {
    if (autoSize) {
      adjustHeight();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [innerValue, autoSize]);

  const adjustHeight = () => {
    const textarea = textareaRef.current!;

    // 重置高度以便正确计算scrollHeight
    textarea.style.height = 'auto';

    const minRows = typeof autoSize === 'object' ? autoSize.minRows || 1 : 1;
    const maxRows = typeof autoSize === 'object' ? autoSize.maxRows : undefined;

    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
    const paddingTop = parseInt(getComputedStyle(textarea).paddingTop);
    const paddingBottom = parseInt(getComputedStyle(textarea).paddingBottom);
    const borderTop = parseInt(getComputedStyle(textarea).borderTopWidth);
    const borderBottom = parseInt(getComputedStyle(textarea).borderBottomWidth);

    // 计算最小高度（包含边框）
    const minHeight =
      minRows * lineHeight +
      paddingTop +
      paddingBottom +
      borderTop +
      borderBottom;
    textarea.style.minHeight = `${minHeight}px`;

    if (maxRows) {
      // 计算最大高度（包含边框）
      const maxHeight =
        maxRows * lineHeight +
        paddingTop +
        paddingBottom +
        borderTop +
        borderBottom;
      textarea.style.maxHeight = `${maxHeight}px`;

      // 当内容超过最大高度时，确保显示滚动条
      textarea.style.overflowY =
        textarea.scrollHeight > maxHeight ? 'auto' : 'hidden';
    } else {
      // 没有最大行数限制时，不显示滚动条
      textarea.style.overflowY = 'hidden';
    }

    // 设置实际高度为内容高度
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (maxLength !== undefined && newValue.length > maxLength) {
      return;
    }

    if (value === undefined) {
      setInnerValue(newValue);
    }

    onChange?.(newValue);
  };

  return (
    <div className={cn(classConfig.textareaWrapConfig, className)}>
      <HeadlessTextarea
        ref={mergedRef}
        value={innerValue}
        onChange={handleChange}
        readOnly={readOnly}
        className={cn(
          classConfig.textareaConfig({ readOnly }),
          textareaClassName,
        )}
        {...rest}
      />
      {showCount && (
        <div className={cn(classConfig.countConfig, countClassName)}>
          {innerValue.length}
          {maxLength ? `/${maxLength}` : ''}
        </div>
      )}
    </div>
  );
}

export default TextArea;
