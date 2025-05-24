import { beforeEach, describe, expect, it, test, vi } from 'vitest';
import {
  cn,
  cx,
  defaultTwMerge,
  getComponentClassConfig,
  twConfig,
  updateClassConfig,
  updateTwMergeFunction,
} from '@/components/class-config';
import { defaultConfig } from '@/components/class-config/default-config';

describe('Class Configuration Utilities', () => {
  describe('getComponentClassConfig', () => {
    beforeEach(() => {
      // 重置配置到默认状态
      updateClassConfig(defaultConfig);
    });

    test('should return correct button configuration', () => {
      const buttonConfig = getComponentClassConfig('button');
      expect(buttonConfig).toBe(defaultConfig.button);
    });

    test('should return correct input configuration', () => {
      const inputConfig = getComponentClassConfig('input');
      expect(inputConfig).toBe(defaultConfig.input);
    });

    test('should return undefined for non-existent component', () => {
      // @ts-expect-error Testing invalid component name
      const config = getComponentClassConfig('nonexistent');
      expect(config).toBeUndefined();
    });
  });

  describe('updateClassConfig', () => {
    test('should update entire configuration', () => {
      const newConfig = {
        ...defaultConfig,
        button: {
          ...defaultConfig.button,
          customClass: 'new-button-class',
        },
      };

      updateClassConfig(newConfig);
      expect(getComponentClassConfig('button')).toEqual(newConfig.button);
    });

    test('should maintain updated configuration across multiple calls', () => {
      const config1 = {
        ...defaultConfig,
        button: {
          ...defaultConfig.button,
          customClass: 'config1-class',
        },
      };

      const config2 = {
        ...defaultConfig,
        button: {
          ...defaultConfig.button,
          customClass: 'config2-class',
        },
      };

      updateClassConfig(config1);
      expect(getComponentClassConfig('button')).toEqual(config1.button);

      updateClassConfig(config2);
      expect(getComponentClassConfig('button')).toEqual(config2.button);
    });
  });

  describe('twConfig object', () => {
    test('should contain button configuration', () => {
      expect(twConfig.button).toBeDefined();
      expect(twConfig.button.index.base).toEqual(expect.any(Array));
      expect(twConfig.button.index.variant).toBeDefined();
    });

    test('should contain input configuration', () => {
      expect(twConfig.input).toBeDefined();
      expect(twConfig.input.index.base).toEqual(expect.any(Array));
    });

    test('should contain popup configuration', () => {
      expect(twConfig.popup).toBeDefined();
      expect(twConfig.popup.popup.base).toBeDefined();
      expect(twConfig.popup.mask).toBeDefined();
    });

    test('should contain toast configuration', () => {
      expect(twConfig.toast).toBeDefined();
      expect(twConfig.toast.toast).toBeDefined();
      expect(twConfig.toast.mask).toBeDefined();
    });

    test('should contain radio configuration', () => {
      expect(twConfig.radio).toBeDefined();
      expect(twConfig.radio.group).toBeDefined();
      expect(twConfig.radio.radio).toEqual(expect.any(Array));
    });

    test('button variant styles should be strings', () => {
      const variants = twConfig.button.index.variant;
      Object.values(variants).forEach((variant) => {
        expect(typeof variant).toBe('string');
      });
    });

    test('transition configurations should have proper structure', () => {
      const transition = twConfig.popup.transition.bottom;
      expect(transition).toEqual({
        enter: expect.any(String),
        enterFrom: expect.any(String),
        enterTo: expect.any(String),
        leave: expect.any(String),
        leaveFrom: expect.any(String),
        leaveTo: expect.any(String),
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
});
