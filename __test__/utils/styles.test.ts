import { describe, expect, it } from 'vitest';
import { twMerge } from '@/utils/styles';

describe('withPrefix twMerge utility function', () => {
  it('should merge tailwind classes correctly', () => {
    expect(twMerge(`px-2 py-1 px-4`)).toBe(`py-1 px-4`);
    expect(twMerge(`p-4 p-6`)).toBe(`p-6`);
    expect(twMerge(`pb-safe-area pb-6`)).toBe(`pb-6`);
    expect(twMerge(`pt-safe-area pt-6`)).toBe(`pt-6`);
    expect(twMerge(`pl-safe-area pl-6`)).toBe(`pl-6`);
    expect(twMerge(`pr-safe-area pr-6`)).toBe(`pr-6`);
    expect(twMerge(`text-red-500 text-blue-500`)).toBe(`text-blue-500`);
    expect(twMerge(`bg-main bg-red-500 bg-red`)).toBe(`bg-red`);
  });

  it('should handle non-tailwind classes', () => {
    expect(twMerge(`custom-class p-4`)).toBe(`custom-class p-4`);
    expect(twMerge(`block__element mt-4 block__element--modifier`)).toBe(
      `block__element mt-4 block__element--modifier`,
    );
  });
});
