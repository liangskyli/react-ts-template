import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useTouch } from '@/utils/use-touch';

describe('useTouch', () => {
  const createTouchEvent = (x: number, y: number): TouchEvent => {
    return {
      touches: [{ clientX: x, clientY: y }],
    } as unknown as TouchEvent;
  };

  beforeEach(() => {
    // Reset all hooks before each test
    vi.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useTouch());

    expect(result.current.deltaX.current).toBe(0);
    expect(result.current.deltaY.current).toBe(0);
    expect(result.current.offsetX.current).toBe(0);
    expect(result.current.offsetY.current).toBe(0);
    expect(result.current.direction.current).toBe('');
  });

  it('should handle start event correctly', () => {
    const { result } = renderHook(() => useTouch());
    const touchEvent = createTouchEvent(100, 200);

    result.current.start(touchEvent);

    expect(result.current.startX.current).toBe(100);
    expect(result.current.startY.current).toBe(200);
    expect(result.current.deltaX.current).toBe(0);
    expect(result.current.deltaY.current).toBe(0);
  });

  it('should handle move event and detect horizontal direction', () => {
    const { result } = renderHook(() => useTouch());

    // Start touch
    result.current.start(createTouchEvent(100, 100));

    // Move horizontally
    result.current.move(createTouchEvent(120, 102));

    expect(result.current.deltaX.current).toBe(20);
    expect(Math.abs(result.current.deltaY.current)).toBeLessThan(10);
    expect(result.current.direction.current).toBe('horizontal');
    expect(result.current.isHorizontal()).toBe(true);
    expect(result.current.isVertical()).toBe(false);
  });

  it('should handle move event and detect vertical direction', () => {
    const { result } = renderHook(() => useTouch());

    // Start touch
    result.current.start(createTouchEvent(100, 100));

    // Move vertically
    result.current.move(createTouchEvent(102, 120));

    expect(result.current.deltaY.current).toBe(20);
    expect(Math.abs(result.current.deltaX.current)).toBeLessThan(10);
    expect(result.current.direction.current).toBe('vertical');
    expect(result.current.isVertical()).toBe(true);
    expect(result.current.isHorizontal()).toBe(false);
  });

  it('should handle negative clientX values in Safari', () => {
    const { result } = renderHook(() => useTouch());

    // Start touch
    result.current.start(createTouchEvent(100, 100));

    // Move with negative X (Safari bug case)
    result.current.move(createTouchEvent(-50, 120));

    expect(result.current.deltaX.current).toBe(0);
    expect(result.current.deltaY.current).toBe(20);
  });

  it('should reset all values correctly', () => {
    const { result } = renderHook(() => useTouch());

    // Set some initial values
    result.current.start(createTouchEvent(100, 100));
    result.current.move(createTouchEvent(120, 120));

    // Reset
    result.current.reset();

    expect(result.current.deltaX.current).toBe(0);
    expect(result.current.deltaY.current).toBe(0);
    expect(result.current.offsetX.current).toBe(0);
    expect(result.current.offsetY.current).toBe(0);
    expect(result.current.direction.current).toBe('');
  });

  it('should not change direction after initial detection', () => {
    const { result } = renderHook(() => useTouch());

    // Start touch
    result.current.start(createTouchEvent(100, 100));

    // Move horizontally first
    result.current.move(createTouchEvent(120, 102));
    expect(result.current.direction.current).toBe('horizontal');

    // Then move vertically
    result.current.move(createTouchEvent(120, 150));
    // Direction should remain horizontal
    expect(result.current.direction.current).toBe('horizontal');
  });

  it('should not detect direction when movement is too small', () => {
    const { result } = renderHook(() => useTouch());

    // Start touch
    result.current.start(createTouchEvent(100, 100));

    // Move slightly (less than MIN_DISTANCE)
    result.current.move(createTouchEvent(105, 105));

    expect(result.current.direction.current).toBe('');
    expect(result.current.isHorizontal()).toBe(false);
    expect(result.current.isVertical()).toBe(false);
  });
});
