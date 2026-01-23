import type { VariantProps } from 'tailwind-variants';
import { getComponentClassConfig } from '@/components/core/class-config';

const classConfig = getComponentClassConfig('toast');

export default classConfig;
export type ToastVariants = VariantProps<typeof classConfig>;
