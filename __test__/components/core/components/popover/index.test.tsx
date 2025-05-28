import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Popover from '@/components/core/components/popover';

// Mock floating-ui hooks
const mockContext = { placement: 'top' };
const mockUseFloating = vi.fn().mockReturnValue({
  context: mockContext,
  refs: { setReference: vi.fn(), setFloating: vi.fn() },
  floatingStyles: {},
});

vi.mock('@floating-ui/react', () => ({
  autoUpdate: vi.fn(),
  offset: vi.fn(),
  flip: vi.fn(),
  shift: vi.fn(),
  arrow: vi.fn(),
  useFloating: () => mockUseFloating(),
}));

// Mock Popup component
vi.mock('@/components/core/components/popup', () => {
  return {
    __esModule: true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    default: ({ children, onClose, visible }: any) => (
      <div data-testid="mock-popup" onClick={() => onClose?.()}>
        {visible && children}
      </div>
    ),
  };
});

describe('Popover placement 测试', () => {
  const placements = [
    'top',
    'top-start',
    'top-end',
    'bottom',
    'bottom-start',
    'bottom-end',
    'left',
    'left-start',
    'left-end',
    'right',
    'right-start',
    'right-end',
  ] as const;

  const expectedClassMap = {
    top: ['flex-col', 'items-center'],
    'top-start': ['flex-col', 'items-start'],
    'top-end': ['flex-col', 'items-end'],
    bottom: ['flex-col-reverse', 'items-center'],
    'bottom-start': ['flex-col-reverse', 'items-start'],
    'bottom-end': ['flex-col-reverse', 'items-end'],
    left: ['flex-row', 'items-center'],
    'left-start': ['flex-row', 'items-start'],
    'left-end': ['flex-row', 'items-end'],
    right: ['flex-row-reverse', 'items-center'],
    'right-start': ['flex-row-reverse', 'items-start'],
    'right-end': ['flex-row-reverse', 'items-end'],
  };

  placements.forEach((placement) => {
    it(`应该正确应用 ${placement} 位置的样式`, () => {
      // 更新 mock 上下文
      mockContext.placement = placement;

      render(
        <Popover content="测试内容" placement={placement} defaultVisible>
          <button>触发按钮</button>
        </Popover>,
      );

      // 获取内容容器
      const container = screen.getByText('测试内容').parentElement;
      expect(container).toBeInTheDocument();

      // 验证基础类
      expect(container).toHaveClass('relative');

      // 验证方向相关的类
      const expectedClasses = ['flex', ...expectedClassMap[placement]];
      expectedClasses.forEach((className) => {
        expect(container).toHaveClass(className);
      });
    });
  });

  it('应该在动态改变 placement 时更新样式', () => {
    // 初始化为 top
    mockContext.placement = 'top';

    const { rerender } = render(
      <Popover content="测试内容" placement="top" defaultVisible>
        <button>触发按钮</button>
      </Popover>,
    );

    // 初始样式检查
    let container = screen.getByText('测试内容').parentElement;
    expect(container).toHaveClass('flex', 'flex-col', 'items-center');

    // 更改为底部位置
    mockContext.placement = 'bottom';

    rerender(
      <Popover content="测试内容" placement="bottom" defaultVisible>
        <button>触发按钮</button>
      </Popover>,
    );

    // 重新获取容器元素
    container = screen.getByText('测试内容').parentElement;

    // 验证更新后的样式
    expect(container).toHaveClass('flex', 'flex-col-reverse', 'items-center');
  });

  it('应该包含正确的基础类名', () => {
    mockContext.placement = 'top';

    render(
      <Popover content="测试内容" defaultVisible>
        <button>触发按钮</button>
      </Popover>,
    );

    const container = screen.getByText('测试内容').parentElement;
    expect(container).toHaveClass('relative');
  });
});

describe('Popover 点击外部测试', () => {
  beforeEach(() => {
    // 重置 mock 上下文
    mockContext.placement = 'top';
  });

  it('默认情况下点击外部应该关闭 Popover', () => {
    render(
      <div>
        <Popover content="测试内容" defaultVisible>
          <button>触发按钮</button>
        </Popover>
        <div data-testid="outside">外部区域</div>
      </div>,
    );

    // 确认 Popover 内容显示
    expect(screen.getByText('测试内容')).toBeInTheDocument();

    // 模拟点击外部
    fireEvent.mouseDown(screen.getByTestId('outside'));

    // 验证 Popover 关闭
    expect(screen.queryByText('测试内容')).not.toBeInTheDocument();
  });

  it('当 closeOnOutsideClick 为 false 时点击外部不应该关闭 Popover', () => {
    render(
      <div>
        <Popover content="测试内容" closeOnOutsideClick={false} defaultVisible>
          <button>触发按钮</button>
        </Popover>
        <div data-testid="outside">外部区域</div>
      </div>,
    );

    // 确认 Popover 内容显示
    expect(screen.getByText('测试内容')).toBeInTheDocument();

    // 模拟点击外部
    fireEvent.mouseDown(screen.getByTestId('outside'));

    // 验证 Popover 仍然显示
    expect(screen.getByText('测试内容')).toBeInTheDocument();
  });

  it('点击触发元素的子元素不应该关闭 Popover', () => {
    render(
      <Popover content="测试内容" defaultVisible>
        <button>
          <span data-testid="trigger-child">子元素</span>
        </button>
      </Popover>,
    );

    // 确认 Popover 内容显示
    expect(screen.getByText('测试内容')).toBeInTheDocument();

    // 模拟点击触发元素的子元素
    fireEvent.mouseDown(screen.getByTestId('trigger-child'));

    // 验证 Popover 仍然显示
    expect(screen.getByText('测试内容')).toBeInTheDocument();
  });

  it('点击 Popover 内容区域不应该关闭弹出层', () => {
    render(
      <Popover
        content={
          <div>
            <span>测试内容</span>
            <button data-testid="popup-button">弹出层按钮</button>
          </div>
        }
        defaultVisible
      >
        <button>触发按钮</button>
      </Popover>,
    );

    // 确认 Popover 内容显示
    expect(screen.getByText('测试内容')).toBeInTheDocument();

    // 模拟点击弹出层内的按钮
    fireEvent.mouseDown(screen.getByTestId('popup-button'));

    // 验证 Popover 仍然显示
    expect(screen.getByText('测试内容')).toBeInTheDocument();
  });

  it('disabled 状态下点击不应该打开 Popover', () => {
    render(
      <Popover content="测试内容" disabled>
        <button>触发按钮</button>
      </Popover>,
    );

    // 点击触发按钮
    fireEvent.click(screen.getByText('触发按钮'));

    // 验证 Popover 没有显示
    expect(screen.queryByText('测试内容')).not.toBeInTheDocument();
  });

  it('应该正确处理函数式 content', () => {
    render(
      <Popover
        content={(setOpen) => (
          <button onClick={() => setOpen(false)} data-testid="close-button">
            关闭按钮
          </button>
        )}
        defaultVisible
      >
        <button>触发按钮</button>
      </Popover>,
    );

    // 验证内容正确渲染
    expect(screen.getByText('关闭按钮')).toBeInTheDocument();

    // 点击关闭按钮
    fireEvent.click(screen.getByTestId('close-button'));

    // 验证 Popover 关闭
    expect(screen.queryByText('关闭按钮')).not.toBeInTheDocument();
  });
});

describe('Popover 箭头样式类测试', () => {
  beforeEach(() => {
    mockContext.placement = 'top';
  });

  it('箭头应该应用基础类名和自定义类名', () => {
    const customArrowClass = 'custom-arrow-class';

    render(
      <Popover
        content="测试内容"
        defaultVisible
        arrow={{
          className: customArrowClass,
        }}
      >
        <button>触发按钮</button>
      </Popover>,
    );

    const arrowElement = screen
      .getByText('测试内容')
      .parentElement!.querySelector('div[class*="border"]');

    // 验证基础类名
    expect(arrowElement).toHaveClass('relative', 'z-0');
    // 验证箭头样式类名
    expect(arrowElement).toHaveClass('w-0', 'h-0');
    // 验证自定义类名
    expect(arrowElement).toHaveClass(customArrowClass);
  });

  it('箭头应该在没有自定义类名时只应用默认类名', () => {
    render(
      <Popover
        content="测试内容"
        defaultVisible
        arrow={{}} // 没有提供 className
      >
        <button>触发按钮</button>
      </Popover>,
    );

    const arrowElement = screen
      .getByText('测试内容')
      .parentElement!.querySelector('div[class*="border"]');

    // 验证基础类名存在
    expect(arrowElement).toHaveClass('relative', 'z-0');
    // 验证箭头样式类名存在
    expect(arrowElement).toHaveClass('w-0', 'h-0');
  });

  it('当没有提供 arrow 属性时应该仍然应用基础类名', () => {
    render(
      <Popover content="测试内容" defaultVisible>
        <button>触发按钮</button>
      </Popover>,
    );

    const arrowElement = screen
      .getByText('测试内容')
      .parentElement!.querySelector('div[class*="border"]');

    // 验证基础类名存在
    expect(arrowElement).toHaveClass('relative', 'z-0');
    // 验证箭头样式类名存在
    expect(arrowElement).toHaveClass('w-0', 'h-0');
  });

  it('箭头类名应该正确合并多个类名', () => {
    const customArrowClass = 'custom-class-1 custom-class-2';

    render(
      <Popover
        content="测试内容"
        defaultVisible
        arrow={{
          className: customArrowClass,
        }}
      >
        <button>触发按钮</button>
      </Popover>,
    );

    const arrowElement = screen
      .getByText('测试内容')
      .parentElement!.querySelector('div[class*="border"]');

    // 验证所有基础类名
    expect(arrowElement).toHaveClass('relative', 'z-0', 'w-0', 'h-0');
    // 验证多个自定义类名都被正确应用
    expect(arrowElement).toHaveClass('custom-class-1', 'custom-class-2');
  });
});

describe('Popover 点击事件处理测试', () => {
  beforeEach(() => {
    mockContext.placement = 'top';
  });

  it('调用 Popup 的 onClose 应该关闭 Popover', () => {
    render(
      <Popover content="测试内容" defaultVisible>
        <button>触发按钮</button>
      </Popover>,
    );

    // 验证初始显示
    expect(screen.getByText('测试内容')).toBeInTheDocument();

    // 触发 Popup 的 onClose
    const popup = screen.getByTestId('mock-popup');
    fireEvent.click(popup);

    // 验证内容已关闭
    expect(screen.queryByText('测试内容')).not.toBeInTheDocument();
  });

  it('点击触发元素时应该切换 Popover 的显示状态', () => {
    render(
      <Popover content="测试内容">
        <button>触发按钮</button>
      </Popover>,
    );

    // 初始状态为隐藏
    expect(screen.queryByText('测试内容')).not.toBeInTheDocument();

    // 点击显示
    fireEvent.click(screen.getByText('触发按钮'));
    expect(screen.getByText('测试内容')).toBeInTheDocument();

    // 再次点击隐藏
    fireEvent.click(screen.getByText('触发按钮'));
    expect(screen.queryByText('测试内容')).not.toBeInTheDocument();
  });

  it('禁用状态下点击触发元素不应该改变显示状态', () => {
    render(
      <Popover content="测试内容" disabled>
        <button>触发按钮</button>
      </Popover>,
    );

    // 初始状态为隐藏
    expect(screen.queryByText('测试内容')).not.toBeInTheDocument();

    // 点击触发元素
    fireEvent.click(screen.getByText('触发按钮'));

    // 验证仍然保持隐藏
    expect(screen.queryByText('测试内容')).not.toBeInTheDocument();
  });

  it('点击触发元素时应该保持正确的开关状态', () => {
    render(
      <Popover content="测试内容" defaultVisible={false}>
        <button>触发按钮</button>
      </Popover>,
    );

    const triggerButton = screen.getByText('触发按钮');

    // 第一次点击：开启
    fireEvent.click(triggerButton);
    expect(screen.getByText('测试内容')).toBeInTheDocument();

    // 第二次点击：关闭
    fireEvent.click(triggerButton);
    expect(screen.queryByText('测试内容')).not.toBeInTheDocument();

    // 第三次点击：再次开启
    fireEvent.click(triggerButton);
    expect(screen.getByText('测试内容')).toBeInTheDocument();
  });

  it('defaultVisible 为 true 时应该默认显示并能正常切换', () => {
    render(
      <Popover content="测试内容" defaultVisible>
        <button>触发按钮</button>
      </Popover>,
    );

    // 初始状态为显示
    expect(screen.getByText('测试内容')).toBeInTheDocument();

    // 点击关闭
    fireEvent.click(screen.getByText('触发按钮'));
    expect(screen.queryByText('测试内容')).not.toBeInTheDocument();

    // 再次点击显示
    fireEvent.click(screen.getByText('触发按钮'));
    expect(screen.getByText('测试内容')).toBeInTheDocument();
  });
});
