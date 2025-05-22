import { beforeEach, describe, expect, test } from 'vitest';
import {
  getComponentClassConfig,
  twConfig,
  updateClassConfig,
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
});
