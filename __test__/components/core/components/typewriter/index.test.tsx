import { act, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Typewriter, {
  useTypewriterText,
} from '@/components/core/components/typewriter';

// 创建一个工厂函数来生成新的 mock 实例
const createMockTypeItCore = () => ({
  type: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  pause: vi.fn().mockReturnThis(),
  move: vi.fn().mockReturnThis(),
  flush: vi.fn(function (this: never, callback?: () => void) {
    if (callback) callback();
    return this;
  }),
  reset: vi.fn().mockReturnThis(),
  destroy: vi.fn().mockReturnThis(),
});

// Mock typeit-react
vi.mock('typeit-react', () => {
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    default: ({ children, className, getAfterInit, ...props }: any) => {
      // 每次渲染都创建新的 mock 实例
      const mockInstance = createMockTypeItCore();
      // 模拟 TypeIt 组件的行为
      if (getAfterInit) {
        getAfterInit(mockInstance);
      }
      return (
        <span className={className} data-testid="typeit-element" {...props}>
          {children}
        </span>
      );
    },
  };
});

describe('Typewriter Component', () => {
  it('renders basic typewriter correctly', () => {
    render(<Typewriter>This will be typed!</Typewriter>);
    const element = screen.getByTestId('typeit-element');
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent('This will be typed!');
  });

  it('renders with custom className', () => {
    render(<Typewriter className="custom-typewriter">Content</Typewriter>);
    const element = screen.getByTestId('typeit-element');
    expect(element).toHaveClass('custom-typewriter');
  });

  it('renders with children as ReactNode', () => {
    render(
      <Typewriter>
        <div>First line</div>
        <div>Second line</div>
      </Typewriter>,
    );
    const element = screen.getByTestId('typeit-element');
    expect(element).toBeInTheDocument();
    expect(screen.getByText('First line')).toBeInTheDocument();
    expect(screen.getByText('Second line')).toBeInTheDocument();
  });

  it('passes options to TypeIt', () => {
    render(
      <Typewriter options={{ cursor: false, speed: 50 }}>
        Content with options
      </Typewriter>,
    );
    const element = screen.getByTestId('typeit-element');
    expect(element).toBeInTheDocument();
  });
});

describe('useTypewriterText Hook', () => {
  it('returns text and getInstance', () => {
    let instanceRef: unknown = null;
    const TestComponent = () => {
      const { text, getInstance } = useTypewriterText({
        children: 'Test content',
      });
      instanceRef = getInstance();
      return <div>{text}</div>;
    };

    render(<TestComponent />);
    expect(screen.getByTestId('typeit-element')).toBeInTheDocument();
    expect(instanceRef).toBeDefined();
  });

  it('returns getInstance with correct methods', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let getInstanceFn: any = null;
    const TestComponent = () => {
      const { text, getInstance } = useTypewriterText({ children: 'Test' });
      getInstanceFn = getInstance;
      return <div data-testid="test-component">{text}</div>;
    };

    render(<TestComponent />);

    // 等待一个微任务，让 getAfterInit 有机会被调用
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const instanceRef = getInstanceFn();
    expect(instanceRef).toBeDefined();
    expect(instanceRef?.type).toBeDefined();
    expect(instanceRef?.delete).toBeDefined();
    expect(instanceRef?.pause).toBeDefined();
    expect(instanceRef?.move).toBeDefined();
    expect(instanceRef?.flush).toBeDefined();
    expect(instanceRef?.reset).toBeDefined();
    expect(instanceRef?.destroy).toBeDefined();
  });

  it('allows dynamic content addition via getInstance', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let getInstanceFn: any = null;
    const TestComponent = () => {
      const { text, getInstance } = useTypewriterText({ children: 'Initial' });
      getInstanceFn = getInstance;
      return <div>{text}</div>;
    };

    render(<TestComponent />);

    // 等待一个微任务，让 getAfterInit 有机会被调用
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const instanceRef = getInstanceFn();
    act(() => {
      instanceRef?.type('New content');
    });

    expect(instanceRef?.type).toHaveBeenCalledWith('New content');
  });

  it('calls custom getAfterInit callback', () => {
    const customGetAfterInit = vi.fn((instance) => instance);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let instanceRef: any = null;
    const TestComponent = () => {
      const { text, getInstance } = useTypewriterText({
        children: 'Test',
        getAfterInit: customGetAfterInit,
      });
      instanceRef = getInstance();
      return <div>{text}</div>;
    };

    render(<TestComponent />);
    expect(customGetAfterInit).toHaveBeenCalled();
    expect(instanceRef).toBeDefined();
  });

  it('renders text element correctly', () => {
    const TestComponent = () => {
      const { text } = useTypewriterText({ children: 'Hook content' });
      return <div>{text}</div>;
    };

    render(<TestComponent />);
    expect(screen.getByTestId('typeit-element')).toBeInTheDocument();
    expect(screen.getByText('Hook content')).toBeInTheDocument();
  });
});
