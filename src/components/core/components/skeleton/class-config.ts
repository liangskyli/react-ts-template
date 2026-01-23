import type { VariantProps } from 'tailwind-variants';
import { getComponentClassConfig } from '@/components/core/class-config';

const classConfig = getComponentClassConfig('skeleton');

export default classConfig;
export type SkeletonVariants = VariantProps<typeof classConfig>;
