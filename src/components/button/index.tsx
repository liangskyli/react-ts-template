import type { ElementType, ReactNode } from 'react';
import type { ButtonProps as HeadlessButtonProps } from '@headlessui/react';
import { Button as HeadlessButton } from '@headlessui/react';
import { DefaultLoadingIcon } from '@/components/button/icons.tsx';
import { cn } from '@/utils/styles';

export type ButtonProps<T extends ElementType = 'button'> = {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  loading?: boolean;
  block?: boolean;
  children?: ReactNode;
  className?: string;
  /** 自定义加载图标 */
  loadingIcon?: ReactNode;
} & Omit<HeadlessButtonProps<T>, 'className'>;

const variantStyles = {
  primary:
    'bg-blue-600 text-white hover:bg-blue-600 disabled:bg-blue-400 relative before:absolute before:inset-0 before:opacity-0 active:before:opacity-[0.08] before:bg-black before:transition-opacity',
  secondary:
    'bg-blue-100 text-blue-700 hover:bg-blue-100 disabled:bg-blue-50 disabled:text-blue-400 relative before:absolute before:inset-0 before:opacity-0 active:before:opacity-[0.08] before:bg-black before:transition-opacity',
  danger:
    'bg-red-600 text-white hover:bg-red-600 disabled:bg-red-400 relative before:absolute before:inset-0 before:opacity-0 active:before:opacity-[0.08] before:bg-black before:transition-opacity',
  ghost:
    'bg-white text-gray-700 border border-gray-300 hover:bg-white disabled:bg-gray-50 disabled:text-gray-400 relative before:absolute before:inset-0 before:opacity-0 active:before:opacity-[0.08] before:bg-black before:transition-opacity',
};

const Button = <T extends ElementType = 'button'>(props: ButtonProps<T>) => {
  const {
    variant = 'primary',
    disabled = false,
    loading = false,
    children,
    onClick,
    className,
    block = false,
    loadingIcon = <DefaultLoadingIcon />,
    ...rest
  } = props;

  const handleClick: ButtonProps['onClick'] = (e) => {
    // 这行代码是多余的，因为：
    // 1. HeadlessButton 已经通过 disabled prop 处理了禁用状态
    // 2. 当 disabled 为 true 时，onClick 根本不会被触发
    // if (loading || disabled) return;
    onClick?.(e);
  };

  return (
    <HeadlessButton
      disabled={disabled || loading}
      onClick={handleClick}
      className={cn(
        'inline-flex items-center justify-center',
        'disabled:cursor-not-allowed disabled:before:hidden',
        'transition-colors duration-200',
        variantStyles[variant],
        // 大小
        'px-4 py-2 text-sm',
        // 圆角
        'rounded-md before:rounded-md',
        block && 'w-full',
        className,
      )}
      {...rest}
    >
      {loading && loadingIcon}
      {children}
    </HeadlessButton>
  );
};

export default Button;
