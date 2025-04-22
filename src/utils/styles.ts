import clsx from 'classnames';
import { twMerge } from 'tailwind-merge';

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
  return twMerge(clsx(inputs));
}
