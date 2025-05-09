import { useState } from 'react';
import Input from '@/components/input';

const InputDemo = () => {
  const [value, setValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');

  return (
    <div className="space-y-4 px-2 py-4">
      <div>
        <h3 className="mb-2 text-lg font-medium">基础输入框</h3>
        <Input placeholder="请输入内容" />
      </div>

      <div>
        <h3 className="mb-2 text-lg font-medium">自定义样式</h3>
        <Input
          placeholder="请输入内容"
          className="border-red-300 text-red-600 placeholder:text-red-400 focus:border-red-300 focus:ring-0"
        />
      </div>

      <div>
        <h3 className="mb-2 text-lg font-medium">数字输入框</h3>
        <Input
          placeholder="请输入2位小数，范围10-100"
          type="number"
          inputMode="decimal"
          min={10}
          max={100}
        />
      </div>

      <div>
        <h3 className="mb-2 text-lg font-medium">受控输入框</h3>
        <Input value={value} onChange={setValue} placeholder="请输入内容" />
        <div className="mt-2 text-sm text-gray-500">
          当前输入: {value || '(空)'}
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-lg font-medium">密码输入框</h3>
        <Input
          type="password"
          value={passwordValue}
          onChange={setPasswordValue}
          placeholder="请输入密码"
        />
      </div>

      <div>
        <h3 className="mb-2 text-lg font-medium">最多输入20个字符</h3>
        <Input placeholder="最多输入20个字符" maxLength={20} />
      </div>

      <div>
        <h3 className="mb-2 text-lg font-medium">禁用状态</h3>
        <Input disabled defaultValue="禁用状态" placeholder="请输入内容" />
      </div>

      <div>
        <h3 className="mb-2 text-lg font-medium">只读状态</h3>
        <Input readOnly defaultValue="只读状态" placeholder="请输入内容" />
      </div>
    </div>
  );
};

export default InputDemo;
