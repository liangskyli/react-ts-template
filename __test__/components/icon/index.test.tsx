import type { SVGAttributes } from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Icon from '@/components/icon';

// Mock icons-loader模块
vi.mock('@/components/icon/icons-loader', () => ({
  default: {
    '/src/icons/test-icon.svg': (props: SVGAttributes<SVGSVGElement>) => (
      <svg data-testid="test-svg" {...props}>
        <path d="M0 0h24v24H0z" />
      </svg>
    ),
    '/src/icons/another-icon.svg': (props: SVGAttributes<SVGSVGElement>) => (
      <svg data-testid="test-svg" {...props}>
        <path d="M0 0h24v24H0z" />
      </svg>
    ),
  },
}));

describe('Icon Component', () => {
  it('renders nothing when icon name is not found', () => {
    const { container } = render(<Icon name="non-existent-icon" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders SVG icon when icon exists', () => {
    const { container } = render(<Icon name="test-icon" />);
    const svgElement = container.querySelector('svg');
    expect(svgElement).not.toBeNull();
    expect(svgElement?.getAttribute('data-testid')).toBe('test-svg');
  });

  it('renders another SVG icon', () => {
    const { container } = render(<Icon name="another-icon" />);
    const svgElement = container.querySelector('svg');
    expect(svgElement).not.toBeNull();
    expect(svgElement?.getAttribute('data-testid')).toBe('test-svg');
  });

  it('passes SVG props correctly', () => {
    const { container } = render(
      <Icon
        name="test-icon"
        width={24}
        height={24}
        fill="red"
        className="custom-class"
      />,
    );

    const svgElement = container.querySelector('svg');
    expect(svgElement).not.toBeNull();
    expect(svgElement).toHaveAttribute('width', '24');
    expect(svgElement).toHaveAttribute('height', '24');
    expect(svgElement).toHaveAttribute('fill', 'red');
    expect(svgElement).toHaveClass('custom-class');
  });

  it('handles empty name prop gracefully', () => {
    const { container } = render(<Icon name="" />);
    expect(container.firstChild).toBeNull();
  });
});
