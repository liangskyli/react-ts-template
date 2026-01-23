import type { VariantProps } from 'tailwind-variants';
import { getComponentClassConfig } from '@/components/core/class-config';

const classConfig = getComponentClassConfig('button');

export default classConfig;
export type ButtonVariants = VariantProps<typeof classConfig>;
