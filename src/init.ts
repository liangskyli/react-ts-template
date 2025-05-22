import { twConfig, updateClassConfig } from '@/components/class-config';

window.tailwindPrefix = '';
if (window.tailwindPrefix) {
  updateClassConfig(twConfig);
  console.log('init: tailwindPrefix set');
}
