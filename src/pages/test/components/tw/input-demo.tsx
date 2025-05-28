import { useState } from 'react';
import Input from '@/components/core/components/input';

const InputDemo = () => {
  const [value, setValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');

  return (
    <div className="tw-space-y-4 tw-px-2 tw-py-4">
      <div>
        <h3 className="tw-mb-2 tw-text-lg tw-font-medium">基础输入框</h3>
        <Input placeholder="请输入内容" />
      </div>

      <div>
        <h3 className="tw-mb-2 tw-text-lg tw-font-medium">自定义样式</h3>
        <Input
          placeholder="请输入内容"
          className="tw-border-red-300 tw-text-red-600 placeholder:tw-text-red-400 focus:tw-border-red-300 focus:tw-ring-0"
        />
      </div>

      <div>
        <h3 className="tw-mb-2 tw-text-lg tw-font-medium">数字输入框</h3>
        <Input
          placeholder="请输入2位小数，范围10-100"
          type="number"
          inputMode="decimal"
          min={10}
          max={100}
        />
      </div>

      <div>
        <h3 className="tw-mb-2 tw-text-lg tw-font-medium">受控输入框</h3>
        <Input value={value} onChange={setValue} placeholder="请输入内容" />
        <div className="tw-mt-2 tw-text-sm tw-text-gray-500">
          当前输入: {value || '(空)'}
        </div>
      </div>

      <div>
        <h3 className="tw-mb-2 tw-text-lg tw-font-medium">密码输入框</h3>
        <Input
          type="password"
          value={passwordValue}
          onChange={setPasswordValue}
          placeholder="请输入密码"
        />
      </div>

      <div>
        <h3 className="tw-mb-2 tw-text-lg tw-font-medium">最多输入20个字符</h3>
        <Input placeholder="最多输入20个字符" maxLength={20} />
      </div>

      <div>
        <h3 className="tw-mb-2 tw-text-lg tw-font-medium">禁用状态</h3>
        <Input disabled defaultValue="禁用状态" placeholder="请输入内容" />
      </div>

      <div>
        <h3 className="tw-mb-2 tw-text-lg tw-font-medium">只读状态</h3>
        <Input readOnly defaultValue="只读状态" placeholder="请输入内容" />
      </div>
    </div>
  );
};

export default InputDemo;
