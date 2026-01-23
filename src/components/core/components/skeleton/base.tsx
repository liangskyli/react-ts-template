import type { SkeletonVariants } from '@/components/core/components/skeleton/class-config.ts';
import classConfig from '@/components/core/components/skeleton/class-config.ts';
import './base.css';

const classConfigData = classConfig();

export type SkeletonProps = {
  /** 自定义 CSS 类名 */
  className?: string;
} & SkeletonVariants;

const Skeleton = (props: SkeletonProps) => {
  const { className, animation } = props;

  const skeletonClassName = classConfigData.skeleton({ animation, className });

  return <div className={skeletonClassName} role="skeleton" />;
};

export default Skeleton;
