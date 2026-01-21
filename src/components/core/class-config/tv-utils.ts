import { type TWMergeConfig, cnMerge, createTV } from 'tailwind-variants';
import type { CnOptions } from 'tailwind-variants';

const twMergeConfig: TWMergeConfig = {
  extend: {
    classGroups: {
      pb: [{ pb: ['safe-area'] }],
      pt: [{ pt: ['safe-area'] }],
      pl: [{ pl: ['safe-area'] }],
      pr: [{ pr: ['safe-area'] }],
    },
  },
};

const tv = createTV({
  twMergeConfig,
});

const cn = (...classes: CnOptions) => {
  return cnMerge(classes)({ twMergeConfig }) ?? '';
};

export { tv, cn };
