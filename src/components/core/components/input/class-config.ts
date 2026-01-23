import type { VariantProps } from 'tailwind-variants';
import { getComponentClassConfig } from '@/components/core/class-config';

const classConfig = getComponentClassConfig('input');

export default classConfig;
export type InputVariants = VariantProps<typeof classConfig>;
