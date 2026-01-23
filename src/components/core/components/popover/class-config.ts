import type { VariantProps } from 'tailwind-variants';
import { getComponentClassConfig } from '@/components/core/class-config';

const classConfig = getComponentClassConfig('popover');

export default classConfig;
export type PopoverVariants = VariantProps<typeof classConfig>;
