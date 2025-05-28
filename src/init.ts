import {
  twConfig,
  updateClassConfig,
  updateTwMergeFunction,
} from '@/components/core/class-config';
import { twMerge } from '@/utils/styles.ts';

window.tailwindPrefix = '';
updateTwMergeFunction(twMerge);
if (window.tailwindPrefix) {
  updateClassConfig(twConfig);
  console.log('init: tailwindPrefix set');
}
