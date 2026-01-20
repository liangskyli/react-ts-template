import { cn } from '@/components/core/class-config';
import classConfig from '@/components/core/components/skeleton/class-config.ts';
import Skeleton from '@/components/core/components/skeleton/index.tsx';
import type { SkeletonProps } from './base.tsx';

const classConfigData = classConfig();

type CircularProps = SkeletonProps;
const Circular = (props: CircularProps) => {
  const { animation, className } = props;

  return (
    <Skeleton
      animation={animation}
      className={cn(classConfigData.circular({ className }))}
    />
  );
};

export default Circular;
