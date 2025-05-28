import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('supports-passive', () => {
  beforeEach(() => {
    // Clear module cache before each test
    vi.resetModules();
    // Reset all mocks
    vi.restoreAllMocks();
    // Clear DOM mocks
    vi.stubGlobal('window', undefined);
    vi.stubGlobal('document', undefined);
  });

  it('should set supportsPassive to false when canUseDom is false', async () => {
    // First mock canUseDom
    vi.mock('@/components/core/utils/can-use-dom', () => ({
      canUseDom: false,
    }));

    // Then import and test
    const { supportsPassive } = await import(
      '@/components/core/utils/supports-passive.ts'
    );
    expect(supportsPassive).toBe(false);
  });

  it('should detect passive support when browser supports it', async () => {
    // Mock window and document to simulate browser environment
    const mockAddEventListener = vi.fn((_event, _handler, options) => {
      // Trigger the getter of the passive property
      if (options && typeof options === 'object') {
        // @ts-expect-error ignore
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const passive = options.passive;
      }
    });

    vi.stubGlobal('window', {
      addEventListener: mockAddEventListener,
      document: { createElement: vi.fn() },
    });

    // Mock canUseDom to return true
    vi.mock('@/components/core/utils/can-use-dom', () => ({
      canUseDom: true,
    }));

    // Import module and test
    const { supportsPassive } = await import(
      '@/components/core/utils/supports-passive.ts'
    );

    expect(mockAddEventListener).toHaveBeenCalledWith(
      'test-passive',
      null,
      expect.any(Object),
    );
    expect(supportsPassive).toBe(true);
  });

  it('should handle errors gracefully', async () => {
    // Mock window to throw error
    vi.stubGlobal('window', {
      addEventListener: vi.fn(() => {
        throw new Error('Test error');
      }),
    });

    // Mock canUseDom to return true
    vi.mock('@/components/core/utils/can-use-dom', () => ({
      canUseDom: true,
    }));

    // Import module and test
    const { supportsPassive } = await import(
      '@/components/core/utils/supports-passive.ts'
    );
    expect(supportsPassive).toBe(false);
  });
});
