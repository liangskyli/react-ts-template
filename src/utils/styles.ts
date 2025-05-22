import classNames from 'classnames';
import { extendTailwindMerge } from 'tailwind-merge';

export const getTailwindPrefix = () => {
  return window.tailwindPrefix ?? '';
};

const twMerge = () => {
  const PREFIX = getTailwindPrefix();
  return extendTailwindMerge({
    prefix: PREFIX,
    extend: {
      classGroups: {
        z: [{ z: ['popup', 'mask', 'toast'] }],
        pb: [{ pb: ['safe-area'] }],
        pt: [{ pt: ['safe-area'] }],
        pl: [{ pl: ['safe-area'] }],
        pr: [{ pr: ['safe-area'] }],
      },
    },
  });
};

type ClassValue =
  | string
  | number
  | ClassDictionary
  | ClassArray
  | undefined
  | null
  | boolean;
interface ClassDictionary {
  [id: string]: unknown;
}
type ClassArray = ClassValue[];

export function cn(...inputs: ClassValue[]): string {
  return twMerge()(classNames(inputs));
}
