import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import AjaxLoading from '@/components/ajax-loading';

describe('@/components/ajax-loading', () => {
  it('test', () => {
    const wrapper = render(<AjaxLoading visible={false} />);
    expect(wrapper.container.textContent).toBe('');
    wrapper.rerender(<AjaxLoading visible={true} />);
    expect(wrapper.container.textContent).toBe('加载中...');
  });
});
