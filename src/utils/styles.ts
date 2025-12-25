import { extendTailwindMerge } from 'tailwind-merge';
import { getTailwindPrefix } from '@/components/core/class-config';

export const twMerge = (className: string) => {
  const PREFIX = getTailwindPrefix();
  return extendTailwindMerge({
    prefix: PREFIX,
    extend: {
      classGroups: {
        pb: [{ pb: ['safe-area'] }],
        pt: [{ pt: ['safe-area'] }],
        pl: [{ pl: ['safe-area'] }],
        pr: [{ pr: ['safe-area'] }],
      },
    },
  })(className);
};
