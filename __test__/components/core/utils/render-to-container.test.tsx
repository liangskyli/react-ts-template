import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderToContainer } from '@/components/core/utils/render-to-container.ts';

describe('renderToContainer', () => {
  it('should render directly when getContainer is undefined', () => {
    const TestComponent = () => <div data-testid="test">Test Content</div>;
    render(renderToContainer(undefined, <TestComponent />));

    expect(screen.getByTestId('test')).toBeInTheDocument();
    expect(screen.getByTestId('test').textContent).toBe('Test Content');
  });

  it('should render to specified HTMLElement container', () => {
    const container = document.createElement('div');
    container.id = 'custom-container';
    document.body.appendChild(container);

    const TestComponent = () => <div data-testid="test">Test Content</div>;
    render(renderToContainer(container, <TestComponent />));

    const portalContainer = document.getElementById('custom-container');
    expect(portalContainer).toBeInTheDocument();
    expect(screen.getByTestId('test')).toBeInTheDocument();
    expect(screen.getByTestId('test').textContent).toBe('Test Content');

    // Cleanup
    document.body.removeChild(container);
  });

  it('should render to container returned by function', () => {
    const container = document.createElement('div');
    container.id = 'function-container';
    document.body.appendChild(container);

    const getContainer = () => container;
    const TestComponent = () => <div data-testid="test">Test Content</div>;
    render(renderToContainer(getContainer, <TestComponent />));

    const portalContainer = document.getElementById('function-container');
    expect(portalContainer).toBeInTheDocument();
    expect(screen.getByTestId('test')).toBeInTheDocument();
    expect(screen.getByTestId('test').textContent).toBe('Test Content');

    // Cleanup
    document.body.removeChild(container);
  });

  it('should render to document.body when function returns undefined', () => {
    const getContainer = () => undefined;
    const TestComponent = () => <div data-testid="test">Test Content</div>;
    render(renderToContainer(getContainer, <TestComponent />));

    expect(screen.getByTestId('test')).toBeInTheDocument();
    expect(screen.getByTestId('test').textContent).toBe('Test Content');
  });

  it('should render to document.body when HTMLElement is undefined', () => {
    const TestComponent = () => <div data-testid="test">Test Content</div>;
    render(renderToContainer(undefined, <TestComponent />));

    expect(screen.getByTestId('test')).toBeInTheDocument();
    expect(screen.getByTestId('test').textContent).toBe('Test Content');
  });
});
