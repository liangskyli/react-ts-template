import { describe, expect, it } from 'vitest';
import { cn, getComponentClassConfig } from '@/components/core/class-config';
import { defaultConfig } from '@/components/core/class-config/default-config.ts';

describe('Class Configuration Utilities', () => {
  describe('getComponentClassConfig', () => {
    it('should return correct button configuration', () => {
      const buttonConfig = getComponentClassConfig('button');
      expect(buttonConfig).toBe(defaultConfig.button);
    });

    it('should return correct input configuration', () => {
      const inputConfig = getComponentClassConfig('input');
      expect(inputConfig).toBe(defaultConfig.input);
    });

    it('should return undefined for non-existent component', () => {
      const config = getComponentClassConfig('nonexistent' as never);
      expect(config).toBeUndefined();
    });
  });

  describe('cn function', () => {
    it('should merge class names correctly', () => {
      // Test with no parameters
      expect(cn()).toBe('');

      // Test with a single class
      expect(cn('btn')).toBeTruthy();

      // Test with multiple classes
      const result = cn('btn', 'btn-primary', { 'btn-large': true });
      expect(result).toBeTruthy();

      // Test with conditional classes
      const isActive = true;
      const result2 = cn('btn', { 'btn-active': isActive });
      expect(result2).toBeTruthy();

      // Test with an array of classes
      const result3 = cn(['btn', 'btn-primary']);
      expect(result3).toBeTruthy();

      // Test with falsy values
      const result4 = cn('btn', undefined, null, false, '');
      expect(result4).toBeTruthy();

      // Test with safe area classes
      expect(cn(`pb-6 pb-safe-area`)).toBe(`pb-safe-area`);
      expect(cn(`pb-safe-area pb-6`)).toBe(`pb-6`);
      expect(cn(`pt-safe-area pt-6`)).toBe(`pt-6`);
      expect(cn(`pl-safe-area pl-6`)).toBe(`pl-6`);
      expect(cn(`pr-safe-area pr-6`)).toBe(`pr-6`);
    });

    it('should handle complex class combinations', () => {
      const result = cn(
        'fixed',
        'inset-x-0',
        'top-0',
        {
          'bg-white': true,
          'dark:bg-gray-800': true,
        },
        ['border-b', 'border-gray-200', 'dark:border-gray-700'],
      );

      expect(result).toBeTruthy();
      expect(result).toBe(
        'fixed inset-x-0 top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700',
      );
    });
  });
});
