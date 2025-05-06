import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import List from '@/components/list';

// 模拟 react-virtualized
vi.mock('react-virtualized', () => {
  const AutoSizer = ({
    children,
  }: {
    children: (size: { width: number; height: number }) => React.ReactNode;
  }) => children({ width: 400, height: 300 });

  const CellMeasurer = ({
    children,
  }: {
    children: (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { registerChild }: any,
    ) => React.ReactNode;
  }) => children({ registerChild: (ref: never) => ref });

  const CellMeasurerCache = vi.fn().mockImplementation(() => ({
    rowHeight: () => 50,
    clear: vi.fn(),
  }));

  const List = ({
    rowRenderer,
    rowCount,
  }: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rowRenderer: any;
    rowCount: number;
  }) => {
    const rows = [];
    for (let i = 0; i < rowCount; i++) {
      rows.push(
        rowRenderer({
          key: `row-${i}`,
          index: i,
          style: { height: 50 },
          parent: {},
        }),
      );
    }
    return <div data-testid="virtualized-list">{rows}</div>;
  };

  return {
    AutoSizer,
    CellMeasurer,
    CellMeasurerCache,
    List,
  };
});

describe('List Component', () => {
  it('renders basic list correctly', () => {
    render(
      <List>
        <List.Item title="Item 1" description="Description 1" />
        <List.Item title="Item 2" description="Description 2" />
      </List>,
    );

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Description 2')).toBeInTheDocument();
  });

  it('renders list with custom className', () => {
    const { container } = render(
      <List className="custom-class">
        <List.Item title="Item 1" />
      </List>,
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders list items with prefix and suffix', () => {
    render(
      <List>
        <List.Item
          title="Item with prefix and suffix"
          prefix={<div data-testid="prefix">Prefix</div>}
          suffix={<div data-testid="suffix">Suffix</div>}
        />
      </List>,
    );

    expect(screen.getByTestId('prefix')).toBeInTheDocument();
    expect(screen.getByTestId('suffix')).toBeInTheDocument();
  });

  it('handles clickable list items', () => {
    const handleClick = vi.fn();

    render(
      <List>
        <List.Item
          title="Clickable Item"
          clickable
          onClick={handleClick}
          data-testid="clickable-item"
        />
      </List>,
    );

    // 使用 data-testid 直接找到列表项元素
    const item = screen.getByTestId('clickable-item');
    expect(item).toHaveAttribute('data-clickable');

    fireEvent.click(item);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('handles disabled list items', () => {
    const handleClick = vi.fn();

    render(
      <List>
        <List.Item
          title="Disabled Item"
          clickable
          disabled
          onClick={handleClick}
          data-testid="disabled-item"
        />
      </List>,
    );

    // 使用 data-testid 直接找到列表项元素
    const item = screen.getByTestId('disabled-item');
    expect(item).toHaveAttribute('data-disabled');

    fireEvent.click(item);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('renders list items with custom content', () => {
    render(
      <List>
        <List.Item>
          <div data-testid="custom-content">Custom Content</div>
        </List.Item>
      </List>,
    );

    expect(screen.getByTestId('custom-content')).toBeInTheDocument();
  });

  it('renders virtualized list correctly', () => {
    const items = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      title: `Item ${i}`,
      description: `Description ${i}`,
    }));

    render(
      <List virtualScroll>
        {items.map((item) => (
          <List.Item
            key={item.id}
            title={item.title}
            description={item.description}
          />
        ))}
      </List>,
    );

    // 验证虚拟列表被渲染
    expect(screen.getByTestId('virtualized-list')).toBeInTheDocument();
  });

  it('applies correct styles to list items', () => {
    render(
      <List>
        <List.Item
          title="Styled Item"
          className="custom-item-class"
          data-testid="styled-item"
        />
      </List>,
    );

    const item = screen.getByTestId('styled-item');
    expect(item).toHaveClass('custom-item-class');
    expect(item).toHaveClass('flex');
    expect(item).toHaveClass('items-center');
    expect(item).toHaveClass('border-b');
  });

  it('renders the last item without bottom border', () => {
    render(
      <List>
        <List.Item title="First Item" data-testid="first-item" />
        <List.Item title="Last Item" data-testid="last-item" />
      </List>,
    );

    const lastItem = screen.getByTestId('last-item');
    expect(lastItem).toHaveClass('last:border-b-0');
  });

  it('correctly handles item click events', () => {
    const handleClick1 = vi.fn();
    const handleClick2 = vi.fn();

    render(
      <List>
        <List.Item
          title="First Clickable"
          clickable
          onClick={handleClick1}
          data-testid="first-clickable"
        />
        <List.Item
          title="Second Clickable"
          clickable
          onClick={handleClick2}
          data-testid="second-clickable"
        />
      </List>,
    );

    // 点击第一个项目
    fireEvent.click(screen.getByTestId('first-clickable'));
    expect(handleClick1).toHaveBeenCalledTimes(1);
    expect(handleClick2).not.toHaveBeenCalled();

    // 点击第二个项目
    fireEvent.click(screen.getByTestId('second-clickable'));
    expect(handleClick1).toHaveBeenCalledTimes(1);
    expect(handleClick2).toHaveBeenCalledTimes(1);
  });
});
