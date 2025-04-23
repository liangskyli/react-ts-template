import classNames from 'classnames';
import { extendTailwindMerge } from 'tailwind-merge';

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      z: [{ z: ['popup', 'mask'] }],
    },
  },
});

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
  return twMerge(classNames(inputs));
}
