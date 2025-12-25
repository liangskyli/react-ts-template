import { updateTwMergeFunction } from '@/components/core/class-config';
import { twMerge } from '@/utils/styles.ts';

window.tailwindPrefix = '';
updateTwMergeFunction(twMerge);
