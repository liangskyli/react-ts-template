import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cn, getTailwindPrefix } from '@/utils/styles';

describe('withPrefix cn utility function', () => {
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
          cn(
            `${getTailwindPrefix()}px-2 ${getTailwindPrefix()}py-1`,
            `${getTailwindPrefix()}px-4`,
          ),
        ).toBe(`${getTailwindPrefix()}py-1 ${getTailwindPrefix()}px-4`);
        expect(
          cn(`${getTailwindPrefix()}p-4`, `${getTailwindPrefix()}p-6`),
        ).toBe(`${getTailwindPrefix()}p-6`);
        expect(
          cn(
            `${getTailwindPrefix()}pb-safe-area`,
            `${getTailwindPrefix()}pb-6`,
          ),
        ).toBe(`${getTailwindPrefix()}pb-6`);
        expect(
          cn(
            `${getTailwindPrefix()}pt-safe-area`,
            `${getTailwindPrefix()}pt-6`,
          ),
        ).toBe(`${getTailwindPrefix()}pt-6`);
        expect(
          cn(
            `${getTailwindPrefix()}pl-safe-area`,
            `${getTailwindPrefix()}pl-6`,
          ),
        ).toBe(`${getTailwindPrefix()}pl-6`);
        expect(
          cn(
            `${getTailwindPrefix()}pr-safe-area`,
            `${getTailwindPrefix()}pr-6`,
          ),
        ).toBe(`${getTailwindPrefix()}pr-6`);
        expect(
          cn(
            `${getTailwindPrefix()}text-red-500`,
            `${getTailwindPrefix()}text-blue-500`,
          ),
        ).toBe(`${getTailwindPrefix()}text-blue-500`);
        expect(
          cn(`${getTailwindPrefix()}z-0`, `${getTailwindPrefix()}z-mask`),
        ).toBe(`${getTailwindPrefix()}z-mask`);
        expect(
          cn(
            `${getTailwindPrefix()}bg-main`,
            `${getTailwindPrefix()}bg-red-500`,
            `${getTailwindPrefix()}bg-red`,
          ),
        ).toBe(`${getTailwindPrefix()}bg-red`);
      });

      it('should handle non-tailwind classes', () => {
        expect(cn('custom-class', `${getTailwindPrefix()}p-4`)).toBe(
          `custom-class ${getTailwindPrefix()}p-4`,
        );
        expect(
          cn(
            'block__element',
            `${getTailwindPrefix()}mt-4`,
            'block__element--modifier',
          ),
        ).toBe(
          `block__element ${getTailwindPrefix()}mt-4 block__element--modifier`,
        );
      });

      it('should handle conditional classes', () => {
        const isActive = true;
        const isDisabled = false;

        expect(
          cn('base', isActive ? 'active' : '', isDisabled ? 'disabled' : ''),
        ).toBe('base active');

        expect(cn('base', undefined, null, '', 'valid')).toBe('base valid');
      });

      it('should handle array of classes', () => {
        expect(
          cn(
            [`${getTailwindPrefix()}p-2`, `${getTailwindPrefix()}px-4`],
            `${getTailwindPrefix()}py-2`,
          ),
        ).toBe(
          `${getTailwindPrefix()}p-2 ${getTailwindPrefix()}px-4 ${getTailwindPrefix()}py-2`,
        );
        const showHidden = false;
        expect(
          cn(
            [
              `${getTailwindPrefix()}text-sm`,
              showHidden ? `${getTailwindPrefix()}hidden` : '',
            ],
            [`${getTailwindPrefix()}font-bold`],
          ),
        ).toBe(`${getTailwindPrefix()}text-sm ${getTailwindPrefix()}font-bold`);
      });

      it('should handle object syntax', () => {
        if (prefix === 'tw-') {
          expect(
            cn({
              'tw-text-red-500': true,
              'tw-text-bold': false,
            }),
          ).toBe('tw-text-red-500');

          expect(
            cn('base', {
              'tw-text-sm': true,
              'dark:tw-text-white': true,
            }),
          ).toBe('base tw-text-sm dark:tw-text-white');
        } else {
          expect(
            cn({
              'text-red-500': true,
              'text-bold': false,
            }),
          ).toBe('text-red-500');

          expect(
            cn('base', {
              'text-sm': true,
              'dark:text-white': true,
            }),
          ).toBe('base text-sm dark:text-white');
        }
      });

      it('should handle mixed input types', () => {
        const showRed = true;
        if (prefix === 'tw-') {
          expect(
            cn(
              'base-class',
              ['tw-p-2', 'tw-px-4'],
              {
                'tw-text-red-500': showRed,
                hidden: false,
              },
              undefined,
              null,
              'final-class',
            ),
          ).toBe('base-class tw-p-2 tw-px-4 tw-text-red-500 final-class');
        } else {
          expect(
            cn(
              'base-class',
              ['p-2', 'px-4'],
              {
                'text-red-500': showRed,
                hidden: false,
              },
              undefined,
              null,
              'final-class',
            ),
          ).toBe('base-class p-2 px-4 text-red-500 final-class');
        }
      });

      it('should handle CSS Modules object', () => {
        const styles = {
          container: 'container_hash123',
          active: 'active_hash456',
        };

        expect(
          cn(styles.container, `${getTailwindPrefix()}p-4`, styles.active),
        ).toBe(`container_hash123 ${getTailwindPrefix()}p-4 active_hash456`);
      });
    });
  });
});
