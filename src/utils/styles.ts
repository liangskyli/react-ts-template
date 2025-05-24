import { extendTailwindMerge } from 'tailwind-merge';

export const getTailwindPrefix = () => {
  return window.tailwindPrefix ?? '';
};

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
