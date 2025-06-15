import Skeleton from '@/components/core/components/skeleton/base.tsx';
import Circular from '@/components/core/components/skeleton/circular.tsx';
import Paragraph from '@/components/core/components/skeleton/paragraph.tsx';

/* eslint-disable @typescript-eslint/no-explicit-any */
(Skeleton as any).Paragraph = Paragraph;
(Skeleton as any).circular = Circular;

export default Skeleton as typeof Skeleton & {
  Paragraph: typeof Paragraph;
  circular: typeof Circular;
};
