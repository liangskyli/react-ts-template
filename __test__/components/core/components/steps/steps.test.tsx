import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import Steps from '@/components/core/components/steps';
import type { StepItem } from '@/components/core/components/steps';

describe('Steps', () => {
  const mockItems: StepItem[] = [
    {
      title: '步骤一',
      description: '这是第一步',
    },
    {
      title: '步骤二',
      description: '这是第二步',
    },
    {
      title: '步骤三',
      description: '这是第三步',
    },
  ];

  test('renders basic steps correctly', () => {
    render(<Steps items={mockItems} current={1} />);

    expect(screen.getByText('步骤一')).toBeInTheDocument();
    expect(screen.getByText('步骤二')).toBeInTheDocument();
    expect(screen.getByText('步骤三')).toBeInTheDocument();
    expect(screen.getByText('这是第一步')).toBeInTheDocument();
    expect(screen.getByText('这是第二步')).toBeInTheDocument();
    expect(screen.getByText('这是第三步')).toBeInTheDocument();
  });

  test('renders with correct current step', () => {
    const { container } = render(<Steps items={mockItems} current={1} />);

    // 检查步骤状态数据属性
    const steps = container.querySelectorAll('[data-status]');
    expect(steps[0]).toHaveAttribute('data-status', 'finish');
    expect(steps[1]).toHaveAttribute('data-status', 'process');
    expect(steps[2]).toHaveAttribute('data-status', 'wait');

    // 检查默认圆点图标
    const icons = container.querySelectorAll('.size-3.rounded-full');
    expect(icons.length).toBe(3);

    // 检查可点击状态
    expect(steps[0]).toHaveAttribute('data-is-clickable', 'false');
    expect(steps[1]).toHaveAttribute('data-is-clickable', 'false');
    expect(steps[2]).toHaveAttribute('data-is-clickable', 'false');
  });

  test('renders vertical direction correctly', () => {
    const { container } = render(
      <Steps items={mockItems} current={1} direction="vertical" />,
    );

    const stepsContainer = container.firstChild as HTMLElement;
    expect(stepsContainer).toHaveClass('flex-col');

    // 检查步骤项的方向数据属性
    const steps = container.querySelectorAll('[data-direction="vertical"]');
    expect(steps.length).toBe(mockItems.length);
  });

  test('renders horizontal direction correctly', () => {
    const { container } = render(
      <Steps items={mockItems} current={1} direction="horizontal" />,
    );

    const stepsContainer = container.firstChild as HTMLElement;
    expect(stepsContainer).toHaveClass('flex-row');

    // 检查步骤项的方向数据属性
    const steps = container.querySelectorAll('[data-direction="horizontal"]');
    expect(steps.length).toBe(mockItems.length);
  });

  test('handles clickable steps', () => {
    const onChange = vi.fn();
    const { container } = render(
      <Steps items={mockItems} current={1} clickable onChange={onChange} />,
    );

    // 查找第一个步骤的可点击区域
    const firstStepClickable = container.querySelector(
      '[data-is-clickable="true"]',
    );
    expect(firstStepClickable).toBeInTheDocument();

    // 直接点击可点击的步骤项内部容器
    const firstStepInner = firstStepClickable?.querySelector('div');
    expect(firstStepInner).toBeInTheDocument();

    fireEvent.click(firstStepInner!);
    expect(onChange).toHaveBeenCalledWith(0);
  });

  test('does not trigger click when not clickable', () => {
    const onChange = vi.fn();
    const { container } = render(
      <Steps
        items={mockItems}
        current={1}
        clickable={false}
        onChange={onChange}
      />,
    );

    // 检查步骤不可点击
    const steps = container.querySelectorAll('[data-is-clickable="false"]');
    expect(steps.length).toBe(mockItems.length);

    const firstStepTitle = screen.getByText('步骤一');
    fireEvent.click(firstStepTitle);

    expect(onChange).not.toHaveBeenCalled();
  });

  test('renders custom status correctly', () => {
    const customItems: StepItem[] = [
      {
        title: '错误步骤',
        status: 'error',
      },
      {
        title: '完成步骤',
        status: 'finish',
      },
    ];

    const { container } = render(<Steps items={customItems} />);

    // 检查步骤状态数据属性
    const steps = container.querySelectorAll('[data-status]');
    expect(steps[0]).toHaveAttribute('data-status', 'error');
    expect(steps[1]).toHaveAttribute('data-status', 'finish');

    // 检查默认圆点图标存在
    const icons = container.querySelectorAll('.size-3.rounded-full');
    expect(icons.length).toBe(2);
  });

  test('renders custom icons', () => {
    const customItems: StepItem[] = [
      {
        title: '自定义图标',
        icon: <span data-testid="custom-icon">🎉</span>,
      },
    ];

    render(<Steps items={customItems} />);

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    expect(screen.getByText('🎉')).toBeInTheDocument();
  });

  test('handles disabled steps', () => {
    const onChange = vi.fn();
    const disabledItems: StepItem[] = [
      {
        title: '正常步骤',
      },
      {
        title: '禁用步骤',
        disabled: true,
      },
    ];

    const { container } = render(
      <Steps items={disabledItems} clickable onChange={onChange} />,
    );

    // 查找包含禁用步骤的步骤项
    const disabledStep = container.querySelector('[data-disabled="true"]');
    expect(disabledStep).toBeInTheDocument();
    expect(disabledStep).toHaveAttribute('data-is-clickable', 'false');

    // 查找正常步骤应该可点击
    const allSteps = container.querySelectorAll('[data-disabled]');
    const normalStep = Array.from(allSteps).find(
      (step) =>
        step.getAttribute('data-disabled') === 'false' ||
        step.getAttribute('data-disabled') === null,
    );
    if (normalStep) {
      expect(normalStep).toHaveAttribute('data-is-clickable', 'true');
    }

    // 点击禁用步骤不应该触发onChange
    const disabledStepInner = disabledStep?.querySelector('div');
    if (disabledStepInner) {
      fireEvent.click(disabledStepInner);
    }
    expect(onChange).not.toHaveBeenCalled();
  });

  test('renders without title and description', () => {
    const minimalItems: StepItem[] = [{ title: '' }, { title: '步骤二' }];

    const { container } = render(<Steps items={minimalItems} />);

    // 应该只显示图标（圆点）
    const icons = container.querySelectorAll('.size-3.rounded-full');
    expect(icons.length).toBe(2);

    // 第二个步骤应该有标题
    expect(screen.getByText('步骤二')).toBeInTheDocument();
  });

  test('applies custom className', () => {
    const { container } = render(
      <Steps items={mockItems} className="custom-steps-class" />,
    );

    expect(container.firstChild).toHaveClass('custom-steps-class');
  });

  test('renders connectors correctly', () => {
    const { container } = render(<Steps items={mockItems} current={1} />);

    // 水平方向应该有连接线 - 检查连接线容器
    const indicatorContainers = container.querySelectorAll(
      '.relative.flex.h-6.w-full.items-center.justify-center',
    );
    expect(indicatorContainers.length).toBe(3);

    // 检查连接线元素存在
    const lines = container.querySelectorAll('.absolute.h-0\\.5');
    expect(lines.length).toBeGreaterThan(0);
  });

  test('renders with custom icons', () => {
    const customItems: StepItem[] = [
      {
        title: '自定义图标步骤',
        icon: <span data-testid="custom-icon">✓</span>,
      },
    ];

    render(<Steps items={customItems} />);

    // 应该显示自定义图标
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    expect(screen.getByText('✓')).toBeInTheDocument();
  });

  test('applies custom class names', () => {
    const { container } = render(
      <Steps
        items={mockItems}
        className="custom-container"
        itemClassName="custom-item"
        iconClassName="custom-icon"
        contentClassName="custom-content"
        titleClassName="custom-title"
        descriptionClassName="custom-description"
      />,
    );

    expect(container.firstChild).toHaveClass('custom-container');

    const items = container.querySelectorAll('.custom-item');
    expect(items.length).toBe(mockItems.length);
  });
});
