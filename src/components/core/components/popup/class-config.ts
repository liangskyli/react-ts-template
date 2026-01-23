import type { VariantProps } from 'tailwind-variants';
import { getComponentClassConfig } from '@/components/core/class-config';

const classConfig = getComponentClassConfig('popup');

export default classConfig;
export type PopupVariants = VariantProps<typeof classConfig>;
