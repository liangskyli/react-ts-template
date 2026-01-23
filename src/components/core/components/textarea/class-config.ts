import type { VariantProps } from 'tailwind-variants';
import { getComponentClassConfig } from '@/components/core/class-config';

const classConfig = getComponentClassConfig('textarea');

export default classConfig;
export type TextAreaVariants = VariantProps<typeof classConfig>;
