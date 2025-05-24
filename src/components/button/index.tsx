import type { ElementType, ReactNode } from 'react';
import type { ButtonProps as HeadlessButtonProps } from '@headlessui/react';
import { Button as HeadlessButton } from '@headlessui/react';
import classConfig from '@/components/button/class-config.ts';
import { DefaultLoadingIcon } from '@/components/button/icons.tsx';
import { cn } from '@/components/class-config';

export type ButtonProps<T extends ElementType = 'button'> = {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  loading?: boolean;
  block?: boolean;
  children?: ReactNode;
  className?: string;
  /** 自定义加载图标 */
  loadingIcon?: ReactNode;
} & Omit<HeadlessButtonProps<T>, 'className'>;

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
      className={cn(classConfig.indexConfig({ variant, block }), className)}
      {...rest}
    >
      {/*添加一个占位的 span，保持相同宽度*/}
      <span />
      {loading && loadingIcon}
      {children}
    </HeadlessButton>
  );
};

export default Button;
