import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Icon from '@/components/icon';

vi.mock('@/icons/help.svg?react', () => ({
  default: vi.fn(() => 'mocked value'),
}));

describe('@/components/ajax-loading', () => {
  it('test', () => {
    const wrapper = render(<Icon name="not-exist-name" />);
    expect(wrapper.container.innerHTML).toEqual('');
    wrapper.rerender(<Icon name="help" />);
    expect(wrapper.container.innerHTML).toEqual('mocked value');
  });
});
