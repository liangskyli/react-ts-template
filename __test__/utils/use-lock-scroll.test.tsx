import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as getScrollParentModule from '@/utils/get-scroll-parent';
import { useLockScroll } from '@/utils/use-lock-scroll';
import { useTouch } from '@/utils/use-touch';

// Mock modules
vi.mock('@/utils/supports-passive', () => ({
  supportsPassive: true,
}));

vi.mock('@/utils/use-touch', () => ({
  useTouch: vi.fn(() => ({
    start: vi.fn(),
    move: vi.fn(),
    isVertical: () => true,
    deltaY: { current: 10 },
  })),
}));

// 创建一个辅助函数来生成可滚动元素
function createScrollableElement(props: Partial<HTMLElement> = {}) {
  const el = document.createElement('div');
  Object.defineProperties(el, {
    scrollHeight: { value: props.scrollHeight ?? 200, configurable: true },
    offsetHeight: { value: props.offsetHeight ?? 100, configurable: true },
    scrollTop: {
      value: props.scrollTop ?? 0,
      writable: true,
      configurable: true,
    },
    getBoundingClientRect: {
      value: () => ({
        height: 100,
        width: 100,
        top: 0,
        left: 0,
        right: 100,
        bottom: 100,
        x: 0,
        y: 0,
      }),
      configurable: true,
    },
  });
  return el;
}

describe('useLockScroll', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.body.classList.remove('overflow-hidden');
    vi.restoreAllMocks();
  });

  it('should add and remove event listeners when shouldLock changes', () => {
    const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
    const rootRef = { current: document.createElement('div') };

    const { rerender, unmount } = renderHook(
      ({ shouldLock }) => useLockScroll(rootRef, shouldLock),
      { initialProps: { shouldLock: false } },
    );

    // 初始状态不应该添加触摸事件监听器
    expect(addEventListenerSpy).not.toHaveBeenCalledWith(
      'touchstart',
      expect.any(Function),
    );
    expect(addEventListenerSpy).not.toHaveBeenCalledWith(
      'touchmove',
      expect.any(Function),
    );

    // 启用锁定
    rerender({ shouldLock: true });

    // 应该添加触摸事件监听器
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'touchstart',
      expect.any(Function),
    );
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'touchmove',
      expect.any(Function),
      expect.any(Object),
    );
    expect(document.body.classList.contains('overflow-hidden')).toBe(true);

    // 禁用锁定
    rerender({ shouldLock: false });
    // 应该移除两个事件监听器
    expect(removeEventListenerSpy).toHaveBeenCalledTimes(2);
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'touchstart',
      expect.any(Function),
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'touchmove',
      expect.any(Function),
    );

    // 卸载时不应该再次调用 removeEventListener，因为已经在 shouldLock 变为 false 时移除了
    const currentCallCount = removeEventListenerSpy.mock.calls.length;
    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledTimes(currentCallCount);
  });

  it('should handle strict mode correctly', () => {
    const rootRef = { current: document.createElement('div') };
    const mockEvent = new TouchEvent('touchmove', {
      cancelable: true,
      bubbles: true,
      // @ts-expect-error any
      target: document.createElement('div'),
    });
    const preventDefaultSpy = vi.spyOn(mockEvent, 'preventDefault');

    const scrollableEl = createScrollableElement();
    vi.spyOn(getScrollParentModule, 'getScrollParent').mockReturnValue(
      scrollableEl,
    );

    const { rerender } = renderHook<
      void,
      {
        shouldLock: boolean | 'strict';
      }
    >(({ shouldLock }) => useLockScroll(rootRef, shouldLock), {
      initialProps: { shouldLock: 'strict' },
    });

    document.dispatchEvent(mockEvent);
    expect(preventDefaultSpy).toHaveBeenCalled();

    rerender({ shouldLock: false });
  });

  it('should handle multiple locks correctly', () => {
    const rootRef = { current: document.createElement('div') };

    const { rerender: rerender1 } = renderHook(
      ({ shouldLock }) => useLockScroll(rootRef, shouldLock),
      { initialProps: { shouldLock: true } },
    );

    const { rerender: rerender2 } = renderHook(
      ({ shouldLock }) => useLockScroll(rootRef, shouldLock),
      { initialProps: { shouldLock: true } },
    );

    expect(document.body.classList.contains('overflow-hidden')).toBe(true);

    rerender1({ shouldLock: false });
    expect(document.body.classList.contains('overflow-hidden')).toBe(true);

    rerender2({ shouldLock: false });
    expect(document.body.classList.contains('overflow-hidden')).toBe(false);
  });

  it('should handle scroll direction correctly', () => {
    const rootRef = { current: document.createElement('div') };
    const scrollableElement = createScrollableElement();

    vi.spyOn(getScrollParentModule, 'getScrollParent').mockReturnValue(
      scrollableElement,
    );

    const { rerender } = renderHook(
      ({ shouldLock }) => useLockScroll(rootRef, shouldLock),
      { initialProps: { shouldLock: true } },
    );

    const mockTouchStart = new TouchEvent('touchstart', {
      // @ts-expect-error any
      touches: [{ clientX: 0, clientY: 0 }],
    });

    const mockTouchMove = new TouchEvent('touchmove', {
      // @ts-expect-error any
      touches: [{ clientX: 0, clientY: 10 }],
      cancelable: true,
      target: document.createElement('div'),
    });

    document.dispatchEvent(mockTouchStart);
    document.dispatchEvent(mockTouchMove);

    rerender({ shouldLock: false });
  });

  it('should cleanup listeners on unmount when locked', () => {
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
    const rootRef = { current: document.createElement('div') };

    const { unmount } = renderHook(() => useLockScroll(rootRef, true));

    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledTimes(2);
    expect(document.body.classList.contains('overflow-hidden')).toBe(false);
  });

  it('should handle scrollable element check in strict mode', () => {
    const rootRef = { current: document.createElement('div') };
    const target = document.createElement('div');
    const mockEvent = new TouchEvent('touchmove', {
      cancelable: true,
      bubbles: true,
      // @ts-expect-error any
      target: target,
    });
    const preventDefaultSpy = vi.spyOn(mockEvent, 'preventDefault');

    vi.spyOn(getScrollParentModule, 'getScrollParent').mockReturnValue(
      document.body,
    );

    const { rerender } = renderHook<
      void,
      {
        shouldLock: boolean | 'strict';
      }
    >(({ shouldLock }) => useLockScroll(rootRef, shouldLock), {
      initialProps: { shouldLock: 'strict' },
    });

    document.dispatchEvent(mockEvent);
    expect(preventDefaultSpy).toHaveBeenCalled();

    rerender({ shouldLock: false });
  });

  it('should find scrollable parent element', () => {
    const rootRef = { current: document.createElement('div') };
    const child = document.createElement('div');
    const parent = document.createElement('div');
    const grandparent = document.createElement('div');

    // 设置元素层级
    parent.appendChild(child);
    grandparent.appendChild(parent);
    document.body.appendChild(grandparent);

    // 设置元素属性使其可滚动
    Object.defineProperties(parent, {
      clientHeight: { value: 100 },
      scrollHeight: { value: 200 },
    });

    const mockEvent = new TouchEvent('touchmove', {
      cancelable: true,
      bubbles: true,
      // @ts-expect-error any
      target: child,
    });

    const { rerender } = renderHook<
      void,
      {
        shouldLock: boolean | 'strict';
      }
    >(({ shouldLock }) => useLockScroll(rootRef, shouldLock), {
      initialProps: { shouldLock: 'strict' },
    });

    document.dispatchEvent(mockEvent);
    rerender({ shouldLock: false });
  });

  it('should handle scroll boundary conditions', () => {
    const rootRef = { current: document.createElement('div') };

    // 创建可滚动元素
    const scrollableElement = document.createElement('div');

    // 使用 Object.defineProperties 来定义只读属性
    Object.defineProperties(scrollableElement, {
      scrollHeight: { value: 200, configurable: true },
      offsetHeight: { value: 100, configurable: true },
      scrollTop: { value: 0, configurable: true, writable: true },
      getBoundingClientRect: {
        value: vi.fn().mockReturnValue({
          height: 100,
          width: 100,
          top: 0,
          left: 0,
          right: 100,
          bottom: 100,
          x: 0,
          y: 0,
          toJSON: () => ({}),
        }),
        configurable: true,
      },
    });

    // Mock getScrollParent using the imported module
    vi.spyOn(getScrollParentModule, 'getScrollParent').mockReturnValue(
      scrollableElement,
    );

    const { rerender } = renderHook(
      ({ shouldLock }) => useLockScroll(rootRef, shouldLock),
      { initialProps: { shouldLock: true } },
    );

    const targetElement = document.createElement('div');

    // 测试向下滚动
    const mockTouchMoveDown = new TouchEvent('touchmove', {
      cancelable: true,
      bubbles: true,
      // @ts-expect-error any
      touches: [{ clientX: 0, clientY: 0 }],
    });
    Object.defineProperty(mockTouchMoveDown, 'target', {
      value: targetElement,
      enumerable: true,
    });

    document.dispatchEvent(mockTouchMoveDown);

    // 测试向上滚动 - 使用 defineProperty 重新定义 scrollTop
    Object.defineProperty(scrollableElement, 'scrollTop', {
      value: 100,
      configurable: true,
    });

    const mockTouchMoveUp = new TouchEvent('touchmove', {
      cancelable: true,
      bubbles: true,
      // @ts-expect-error any
      touches: [{ clientX: 0, clientY: 10 }],
    });
    Object.defineProperty(mockTouchMoveUp, 'target', {
      value: targetElement,
      enumerable: true,
    });

    document.dispatchEvent(mockTouchMoveUp);

    rerender({ shouldLock: false });
  });

  it('should handle non-vertical scroll', () => {
    const rootRef = { current: document.createElement('div') };

    // @ts-expect-error any
    vi.mocked(useTouch).mockImplementation(() => ({
      start: vi.fn(),
      move: vi.fn(),
      isVertical: () => false,
      deltaY: { current: 10 },
    }));

    const { rerender } = renderHook(
      ({ shouldLock }) => useLockScroll(rootRef, shouldLock),
      { initialProps: { shouldLock: true } },
    );

    const mockEvent = new TouchEvent('touchmove', {
      cancelable: true,
      // @ts-expect-error any
      target: document.createElement('div'),
    });

    document.dispatchEvent(mockEvent);
    rerender({ shouldLock: false });
  });

  it('should handle case when no scroll parent found', () => {
    const rootRef = { current: document.createElement('div') };

    vi.spyOn(getScrollParentModule, 'getScrollParent').mockReturnValue(null);

    const { rerender } = renderHook(
      ({ shouldLock }) => useLockScroll(rootRef, shouldLock),
      { initialProps: { shouldLock: true } },
    );

    const mockEvent = new TouchEvent('touchmove', {
      cancelable: true,
      // @ts-expect-error any
      target: document.createElement('div'),
    });

    document.dispatchEvent(mockEvent);
    rerender({ shouldLock: false });
  });

  it('should handle non-scrollable element', () => {
    const rootRef = { current: document.createElement('div') };
    const nonScrollableElement = createScrollableElement({
      scrollHeight: 100,
      offsetHeight: 100,
      scrollTop: 0,
    });

    vi.spyOn(getScrollParentModule, 'getScrollParent').mockReturnValue(
      nonScrollableElement,
    );

    const { rerender } = renderHook(
      ({ shouldLock }) => useLockScroll(rootRef, shouldLock),
      { initialProps: { shouldLock: true } },
    );

    const mockEvent = new TouchEvent('touchmove', {
      cancelable: true,
      bubbles: true,
      // @ts-expect-error any
      touches: [{ clientX: 0, clientY: 0 }],
      target: document.createElement('div'),
    });

    document.dispatchEvent(mockEvent);
    rerender({ shouldLock: false });
  });
});
