import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getScrollParent } from '@/components/core/utils/get-scroll-parent.ts';

describe('getScrollParent', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
    // 清除所有模块的模拟
    vi.clearAllMocks();
  });

  it('should handle non-browser environment', async () => {
    // 在测试开始时就设置模拟
    vi.doMock('@/components/core/utils/can-use-dom', () => ({
      canUseDom: false,
    }));

    // 确保模块被重新加载
    vi.resetModules();

    // 动态导入以获取新的实例
    const { getScrollParent: getScrollParentNew } = await import(
      '@/components/core/utils/get-scroll-parent.ts'
    );

    const element = document.createElement('div');
    const result = getScrollParentNew(element);

    expect(result).toBe(undefined);

    // 清理模拟
    vi.doUnmock('@/components/core/utils/can-use-dom');
  });

  it('should handle browser environment', async () => {
    // 在测试开始时就设置模拟
    vi.doMock('@/components/core/utils/can-use-dom', () => ({
      canUseDom: true,
    }));

    // 确保模块被重新加载
    vi.resetModules();

    // 动态导入以获取新的实例
    const { getScrollParent: getScrollParentNew } = await import(
      '@/components/core/utils/get-scroll-parent.ts'
    );

    const element = document.createElement('div');
    const result = getScrollParentNew(element);

    expect(result).toBe(window);

    // 清理模拟
    vi.doUnmock('@/components/core/utils/can-use-dom');
  });

  it('should return window when element has no scrollable parent', () => {
    const element = document.createElement('div');
    document.body.appendChild(element);

    const result = getScrollParent(element);
    expect(result).toBe(window);
  });

  it('should return the nearest scrollable parent', () => {
    const parent = document.createElement('div');
    Object.assign(parent.style, {
      overflow: 'auto',
      height: '100px',
      width: '100px',
      position: 'relative',
    });

    const child = document.createElement('div');
    Object.assign(child.style, {
      height: '200px',
      width: '100%',
    });

    parent.appendChild(child);
    document.body.appendChild(parent);

    // 模拟 getComputedStyle
    vi.spyOn(window, 'getComputedStyle').mockImplementation((element) => {
      if (element === parent) {
        return {
          overflowY: 'auto',
        } as CSSStyleDeclaration;
      }
      return {} as CSSStyleDeclaration;
    });

    Object.defineProperties(parent, {
      scrollHeight: { value: 200, configurable: true },
      clientHeight: { value: 100, configurable: true },
    });

    const result = getScrollParent(child);
    expect(result).toBe(parent);
  });

  it('should handle overflow-y: scroll', () => {
    const parent = document.createElement('div');
    Object.assign(parent.style, {
      overflowY: 'scroll',
      height: '100px',
      width: '100px',
    });

    const child = document.createElement('div');
    Object.assign(child.style, {
      height: '200px',
      width: '100%',
    });

    parent.appendChild(child);
    document.body.appendChild(parent);

    vi.spyOn(window, 'getComputedStyle').mockImplementation((element) => {
      if (element === parent) {
        return {
          overflowY: 'scroll',
        } as CSSStyleDeclaration;
      }
      return {} as CSSStyleDeclaration;
    });

    Object.defineProperties(parent, {
      scrollHeight: { value: 200, configurable: true },
      clientHeight: { value: 100, configurable: true },
    });

    const result = getScrollParent(child);
    expect(result).toBe(parent);
  });

  it('should handle overflow-y: auto', () => {
    const parent = document.createElement('div');
    Object.assign(parent.style, {
      overflowY: 'auto',
      height: '100px',
      width: '100px',
    });

    const child = document.createElement('div');
    Object.assign(child.style, {
      height: '200px',
      width: '100%',
    });

    parent.appendChild(child);
    document.body.appendChild(parent);

    Object.defineProperties(parent, {
      scrollHeight: { value: 200, configurable: true },
      clientHeight: { value: 100, configurable: true },
    });

    const result = getScrollParent(child);
    expect(result).toBe(parent);
  });

  it('should return custom root when provided', () => {
    const customRoot = document.createElement('div');
    const element = document.createElement('div');
    customRoot.appendChild(element);
    document.body.appendChild(customRoot);

    const result = getScrollParent(element, customRoot);
    expect(result).toBe(customRoot);
  });

  it('should return body when element is direct child of body', () => {
    const element = document.createElement('div');
    document.body.appendChild(element);

    const result = getScrollParent(element);
    expect(result).toBe(window);
  });

  it('should handle nested scrollable elements', () => {
    const outerParent = document.createElement('div');
    Object.assign(outerParent.style, {
      overflow: 'auto',
      height: '200px',
      width: '100px',
    });

    const innerParent = document.createElement('div');
    Object.assign(innerParent.style, {
      overflow: 'auto',
      height: '150px',
      width: '100%',
    });

    const child = document.createElement('div');
    Object.assign(child.style, {
      height: '300px',
      width: '100%',
    });

    innerParent.appendChild(child);
    outerParent.appendChild(innerParent);
    document.body.appendChild(outerParent);

    // 模拟 getComputedStyle
    vi.spyOn(window, 'getComputedStyle').mockImplementation((element) => {
      if (element === innerParent) {
        return {
          overflowY: 'auto',
        } as CSSStyleDeclaration;
      }
      if (element === outerParent) {
        return {
          overflowY: 'auto',
        } as CSSStyleDeclaration;
      }
      return {} as CSSStyleDeclaration;
    });

    Object.defineProperties(innerParent, {
      scrollHeight: { value: 300, configurable: true },
      clientHeight: { value: 150, configurable: true },
    });

    Object.defineProperties(outerParent, {
      scrollHeight: { value: 150, configurable: true },
      clientHeight: { value: 200, configurable: true },
    });

    const result = getScrollParent(child);
    expect(result).toBe(innerParent);
  });

  it('should handle null root parameter', () => {
    const element = document.createElement('div');
    document.body.appendChild(element);

    const result = getScrollParent(element, null);
    expect(result).toBe(null);
  });

  it('should handle undefined root parameter', () => {
    const element = document.createElement('div');
    document.body.appendChild(element);

    const result = getScrollParent(element, undefined);
    expect(result).toBe(window);
  });

  it('should not consider parent as scrollable if content height is less than container', () => {
    const parent = document.createElement('div');
    Object.assign(parent.style, {
      overflow: 'auto',
      height: '200px',
      width: '100px',
    });

    const child = document.createElement('div');
    Object.assign(child.style, {
      height: '100px',
      width: '100%',
    });

    parent.appendChild(child);
    document.body.appendChild(parent);

    Object.defineProperties(parent, {
      scrollHeight: { value: 100, configurable: true },
      clientHeight: { value: 200, configurable: true },
    });

    const result = getScrollParent(child);
    expect(result).toBe(window);
  });
});
