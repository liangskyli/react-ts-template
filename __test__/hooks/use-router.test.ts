import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useRouter } from '@/hooks/use-router.ts';

const navigateMock = vi.fn();

// 创建一个稳定的 navigate 函数
const stableNavigate = (to: string | number, options?: object) => {
  navigateMock(to, options);
};

// Mock react-router 的 useNavigate
vi.mock('react-router', () => ({
  useNavigate: () => stableNavigate,
}));

// 模拟 window.location.reload
const reloadMock = vi.fn();
Object.defineProperty(window, 'location', {
  value: {
    reload: reloadMock,
  },
  writable: true,
});

describe('useRouter', () => {
  beforeEach(() => {
    // 清除所有模拟函数的调用记录
    vi.clearAllMocks();
  });

  it('should push to new route', () => {
    const { result } = renderHook(() => useRouter());
    result.current.push('/test');
    expect(navigateMock).toHaveBeenCalledWith('/test', undefined);
  });

  it('should replace current route', () => {
    const { result } = renderHook(() => useRouter());
    result.current.replace('/test');
    expect(navigateMock).toHaveBeenCalledWith('/test', { replace: true });
  });

  it('should go back', () => {
    const { result } = renderHook(() => useRouter());
    result.current.back();
    expect(navigateMock).toHaveBeenCalledWith(-1, undefined);
  });

  it('should go forward', () => {
    const { result } = renderHook(() => useRouter());
    result.current.forward();
    expect(navigateMock).toHaveBeenCalledWith(1, undefined);
  });

  it('should go to specific delta', () => {
    const { result } = renderHook(() => useRouter());
    result.current.go(2);
    expect(navigateMock).toHaveBeenCalledWith(2, undefined);
  });

  it('should reload page', () => {
    const { result } = renderHook(() => useRouter());
    result.current.reload();
    expect(reloadMock).toHaveBeenCalled();
  });

  it('should maintain stable reference', () => {
    const { result, rerender } = renderHook(() => useRouter());
    const firstReference = result.current;

    rerender();

    expect(result.current).toBe(firstReference);
  });
});
