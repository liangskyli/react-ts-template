import { cx } from 'class-variance-authority';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  cn,
  defaultTwMerge,
  getComponentClassConfig,
  updateTwMergeFunction,
} from '@/components/core/class-config';
import { defaultConfig } from '@/components/core/class-config/default-config.ts';
import { twConfig } from '@/components/core/class-config/tw-config.ts';

describe('Class Configuration Utilities', () => {
  describe('getComponentClassConfig', () => {
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

        it('should return correct button configuration', () => {
          const buttonConfig = getComponentClassConfig('button');
          expect(buttonConfig).toBe(
            prefix ? twConfig.button : defaultConfig.button,
          );
        });

        it('should return correct input configuration', () => {
          const inputConfig = getComponentClassConfig('input');
          expect(inputConfig).toBe(
            prefix ? twConfig.input : defaultConfig.input,
          );
        });

        it('should return undefined for non-existent component', () => {
          // @ts-expect-error Testing invalid component name
          const config = getComponentClassConfig('nonexistent');
          expect(config).toBeUndefined();
        });
      });
    });
  });

  describe('updateTwMergeFunction', () => {
    it('should update twMerge function correctly', () => {
      // Create a mock function
      const mockTwMerge = vi.fn(
        (className: string) => `processed-${className}`,
      );

      // Update the twMerge function
      updateTwMergeFunction(mockTwMerge);

      // Test the cn function to verify if it uses the new twMerge function
      const result = cn('test-class');

      // Verify mockTwMerge was called with correct arguments
      expect(mockTwMerge).toHaveBeenCalledWith(cx(['test-class']));
      expect(result).toBe('processed-' + cx(['test-class']));
      updateTwMergeFunction(defaultTwMerge);
    });
  });

  describe('cn function', () => {
    it('should merge class names correctly', () => {
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

  describe('cn function cache', () => {
    it('should merge class names correctly', () => {
      const result = cn('btn', 'btn-primary', { 'btn-large': true });
      expect(result).toBe('btn btn-primary btn-large');
      // 再次调用，应该从缓存中读取
      const result2 = cn('btn', 'btn-primary', { 'btn-large': true });
      expect(result2).toBe('btn btn-primary btn-large');
    });
  });
});
