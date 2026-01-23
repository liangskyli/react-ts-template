import type { ReactNode } from 'react';
import { cn } from '@/components/core/class-config';
import type { BadgeVariants } from '@/components/core/components/badge/class-config.ts';
import classConfig from '@/components/core/components/badge/class-config.ts';

const classConfigData = classConfig();

export type BadgeProps = {
  /** 徽标内容,不存在时不显示 */
  content?: ReactNode;
  /** 微标相对的主体元素 */
  children?: ReactNode;
  /** 自定义 CSS 类名 */
  className?: string;
} & BadgeVariants;

const Badge = ({ isDot, children, className, content }: BadgeProps) => {
  const badgeClasses = classConfigData.badge({
    isDot,
  });

  return (
    <>
      {children ? (
        <div className={classConfigData.wrap()}>
          {children}
          {(isDot || content) && (
            <span className={cn(badgeClasses, className)}>
              {!isDot && content}
            </span>
          )}
        </div>
      ) : (
        <span
          className={cn(badgeClasses, classConfigData.onlyBadge({ className }))}
        >
          {content}
        </span>
      )}
    </>
  );
};

export default Badge;
