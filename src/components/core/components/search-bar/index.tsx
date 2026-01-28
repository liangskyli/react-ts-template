import type { KeyboardEvent, ReactNode } from 'react';
import { useRef, useState } from 'react';
import Input from '@/components/core/components/input';
import type { InputProps } from '@/components/core/components/input';
import classConfig from '@/components/core/components/search-bar/class-config.ts';
import {
  DefaultClearIcon,
  DefaultSearchIcon,
} from '@/components/core/components/search-bar/icons.tsx';
import { getSemanticClassNames } from '@/components/core/utils/get-semantic-class-names.ts';

const classConfigData = classConfig();

type SemanticClassNames = {
  /** 自定义容器类名 */
  root?: string;
  /** Input组件的类名 */
  input?: string;
  /** 搜索框的类名 */
  search?: string;
  /** 搜索图标类名 */
  searchIcon?: string;
  /** 清除按钮类名 */
  clearButton?: string;
};

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
  /** 自定义容器类名 或 语义化的类名 */
  className?: string | SemanticClassNames;
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
  const classNames = getSemanticClassNames<SemanticClassNames>(className);

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
    <div className={classConfigData.container({ className: classNames?.root })}>
      <div
        className={classConfigData.search({
          className: classNames?.search ?? searchClassName,
        })}
      >
        {showSearchIcon && (
          <div
            className={classConfigData.searchIcon({
              className: classNames?.searchIcon ?? searchIconClassName,
            })}
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
          className={classConfigData.input({
            className: classNames?.input ?? inputClassName,
          })}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          {...inputProps}
        />

        {isShowClearButton && (
          <div
            className={classConfigData.clearButton({
              className: classNames?.clearButton ?? clearButtonClassName,
            })}
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
