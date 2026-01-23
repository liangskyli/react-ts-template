import type { VariantProps } from 'tailwind-variants';
import { getComponentClassConfig } from '@/components/core/class-config';

const classConfig = getComponentClassConfig('badge');

export default classConfig;
export type BadgeVariants = VariantProps<typeof classConfig>;
