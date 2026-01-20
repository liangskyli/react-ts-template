import { extendTailwindMerge } from 'tailwind-merge';

export const twMerge = (className: string) => {
  return extendTailwindMerge({
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
