import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { getTailwindPrefix, twMerge } from '@/utils/styles';

describe('withPrefix twMerge utility function', () => {
  const prefixScenarios = [
    { scenario: 'default', prefix: undefined },
    { scenario: 'custom prefix', prefix: 'tw-' },
  ];

  prefixScenarios.forEach(({ scenario, prefix }) => {
    describe(scenario, () => {
      beforeEach(() => {
        window.tailwindPrefix = prefix;
      });

      afterEach(() => {
        window.tailwindPrefix = undefined;
      });

      it('should merge tailwind classes correctly', () => {
        expect(
          twMerge(
            `${getTailwindPrefix()}px-2 ${getTailwindPrefix()}py-1 ${getTailwindPrefix()}px-4`,
          ),
        ).toBe(`${getTailwindPrefix()}py-1 ${getTailwindPrefix()}px-4`);
        expect(
          twMerge(`${getTailwindPrefix()}p-4 ${getTailwindPrefix()}p-6`),
        ).toBe(`${getTailwindPrefix()}p-6`);
        expect(
          twMerge(
            `${getTailwindPrefix()}pb-safe-area ${getTailwindPrefix()}pb-6`,
          ),
        ).toBe(`${getTailwindPrefix()}pb-6`);
        expect(
          twMerge(
            `${getTailwindPrefix()}pt-safe-area ${getTailwindPrefix()}pt-6`,
          ),
        ).toBe(`${getTailwindPrefix()}pt-6`);
        expect(
          twMerge(
            `${getTailwindPrefix()}pl-safe-area ${getTailwindPrefix()}pl-6`,
          ),
        ).toBe(`${getTailwindPrefix()}pl-6`);
        expect(
          twMerge(
            `${getTailwindPrefix()}pr-safe-area ${getTailwindPrefix()}pr-6`,
          ),
        ).toBe(`${getTailwindPrefix()}pr-6`);
        expect(
          twMerge(
            `${getTailwindPrefix()}text-red-500 ${getTailwindPrefix()}text-blue-500`,
          ),
        ).toBe(`${getTailwindPrefix()}text-blue-500`);
        expect(
          twMerge(
            `${getTailwindPrefix()}bg-main ${getTailwindPrefix()}bg-red-500 ${getTailwindPrefix()}bg-red`,
          ),
        ).toBe(`${getTailwindPrefix()}bg-red`);
      });

      it('should handle non-tailwind classes', () => {
        expect(twMerge(`custom-class ${getTailwindPrefix()}p-4`)).toBe(
          `custom-class ${getTailwindPrefix()}p-4`,
        );
        expect(
          twMerge(
            `block__element ${getTailwindPrefix()}mt-4 block__element--modifier`,
          ),
        ).toBe(
          `block__element ${getTailwindPrefix()}mt-4 block__element--modifier`,
        );
      });
    });
  });
});
