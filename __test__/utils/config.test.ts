import { describe, expect, it } from 'vitest';
import config from '@/utils/config';

describe('@/utils/config.ts', () => {
  it('配置文件', () => {
    expect(config).toMatchSnapshot();
  });
});
