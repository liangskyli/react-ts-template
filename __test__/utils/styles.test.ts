import { describe, expect, it } from 'vitest';
import { cn } from '@/utils/styles';

describe('cn utility function', () => {
  it('should merge tailwind classes correctly', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
    expect(cn('p-4', 'p-6')).toBe('p-6');
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
    expect(cn('z-1', 'z-mask')).toBe('z-mask');
    expect(cn('bg-main', 'bg-red-500', 'bg-red')).toBe('bg-red');
  });

  it('should handle non-tailwind classes', () => {
    expect(cn('custom-class', 'p-4')).toBe('custom-class p-4');
    expect(cn('block__element', 'mt-4', 'block__element--modifier')).toBe(
      'block__element mt-4 block__element--modifier',
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
    expect(cn(['p-2', 'px-4'], 'py-2')).toBe('p-2 px-4 py-2');
    const showHidden = false;
    expect(cn(['text-sm', showHidden ? 'hidden' : ''], ['font-bold'])).toBe(
      'text-sm font-bold',
    );
  });

  it('should handle object syntax', () => {
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
  });

  it('should handle mixed input types', () => {
    const showRed = true;
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
  });

  it('should handle CSS Modules object', () => {
    const styles = {
      container: 'container_hash123',
      active: 'active_hash456',
    };

    expect(cn(styles.container, 'p-4', styles.active)).toBe(
      'container_hash123 p-4 active_hash456',
    );
  });
});
