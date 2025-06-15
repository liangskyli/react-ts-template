import { cn } from '@/components/core/class-config';
import classConfig from '@/components/core/components/skeleton/class-config.ts';
import Skeleton from '@/components/core/components/skeleton/index.tsx';
import type { SkeletonProps } from './base.tsx';

type ParagraphProps = {
  /** 段落行数 */
  lineCount?: number;
  /** 每行的类名 */
  lineClassName?: string;
} & SkeletonProps;
const Paragraph = (props: ParagraphProps) => {
  const { lineCount = 3, animation, className, lineClassName } = props;

  const keys = Array.from({ length: lineCount }, (_, index) => index);

  return (
    <div
      className={cn(classConfig.paragraphConfig.list, className)}
      role="skeleton.paragraph"
    >
      {keys.map((key) => (
        <Skeleton
          key={key}
          animation={animation}
          className={cn(classConfig.paragraphConfig.item, lineClassName)}
        />
      ))}
    </div>
  );
};

export default Paragraph;
