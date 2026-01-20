import type { KeyboardEvent, ReactNode } from 'react';
import { useRef, useState } from 'react';
import { cn } from '@/components/core/class-config';
import Input from '@/components/core/components/input';
import type { InputProps } from '@/components/core/components/input';
import classConfig from '@/components/core/components/search-bar/class-config.ts';
import {
  DefaultClearIcon,
  DefaultSearchIcon,
} from '@/components/core/components/search-bar/icons.tsx';

const classConfigData = classConfig();

export type SearchBarProps = {
  /** 是否显示搜索图标 */
  showSearchIcon?: boolean;
  /** 自定义搜索图标 */
  searchIcon?: ReactNode;
  /** 是否显示清除按钮 */
  showClearButton?: boolean;
  /** 自定义清除图标 */
  clearIcon?: ReactNode;
  /** 搜索时的回调函数 */
  onSearch?: (value: string) => void;
  /** 清除时的回调函数 */
  onClear?: () => void;
  /** 自定义容器类名 */
  className?: string;
  /** Input组件的类名 */
  inputClassName?: string;
  /** 搜索框的类名 */
  searchClassName?: string;
  /** 搜索图标类名 */
  searchIconClassName?: string;
  /** 清除按钮类名 */
  clearButtonClassName?: string;
} & Omit<InputProps, 'className'>;

const SearchBar = (props: SearchBarProps) => {
  const {
    showSearchIcon = true,
    showClearButton = true,
    searchIcon = <DefaultSearchIcon />,
    clearIcon = <DefaultClearIcon />,
    className,
    inputClassName,
    onSearch,
    onClear,
    value,
    onChange,
    disabled = false,
    readOnly = false,
    ref,
    searchClassName,
    searchIconClassName,
    clearButtonClassName,
    ...inputProps
  } = props;

  const [currentValue, setCurrentValue] = useState(
    value || inputProps.defaultValue || '',
  );
  const inputRef = useRef<HTMLInputElement>(null);

  // 合并外部传入的ref和内部的ref
  const mergedRef = (node: HTMLInputElement) => {
    inputRef.current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };

  // 同步外部value变化
  const handleInputChange = (newValue: string) => {
    setCurrentValue(newValue);
    onChange?.(newValue);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch?.(currentValue);
    }
  };

  const handleClear = () => {
    const newValue = '';
    setCurrentValue(newValue);
    onChange?.(newValue);
    onClear?.();
  };

  // 获取当前显示的值 - 如果是受控组件使用value，否则使用内部状态
  const displayValue = value !== undefined ? value : currentValue;
  const isShowClearButton = !!(
    showClearButton &&
    displayValue &&
    !disabled &&
    !readOnly
  );

  return (
    <div className={cn(classConfigData.container({ className }))}>
      <div
        className={cn(classConfigData.search({ className: searchClassName }))}
      >
        {showSearchIcon && (
          <div
            className={cn(
              classConfigData.searchIcon({ className: searchIconClassName }),
            )}
            role="search-icon"
          >
            {searchIcon}
          </div>
        )}

        <Input
          ref={mergedRef}
          value={displayValue}
          disabled={disabled}
          readOnly={readOnly}
          data-search-icon={showSearchIcon ? true : undefined}
          data-clear-icon={isShowClearButton ? true : undefined}
          className={cn(classConfigData.input({ className: inputClassName }))}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          {...inputProps}
        />

        {isShowClearButton && (
          <div
            className={cn(
              classConfigData.clearButton({ className: clearButtonClassName }),
            )}
            onClick={handleClear}
            role="clear-button"
            onMouseDown={(e) => {
              e.preventDefault();
            }}
          >
            {clearIcon}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
export { DefaultSearchIcon, DefaultClearIcon };
