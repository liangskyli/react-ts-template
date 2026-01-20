import { cn } from '@/components/core/class-config';
import classConfig from '@/components/core/components/skeleton/class-config.ts';
import './base.css';

const classConfigData = classConfig();

export type SkeletonProps = {
  /** 自定义 CSS 类名 */
  className?: string;
  /** 是否显示动画 */
  animation?: boolean;
};

const Skeleton = (props: SkeletonProps) => {
  const { className, animation = true } = props;

  const skeletonClassName = cn(
    classConfigData.skeleton({ animation, className }),
  );

  return <div className={skeletonClassName} role="skeleton" />;
};

export default Skeleton;
