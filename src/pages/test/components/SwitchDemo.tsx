import { useState } from 'react';
import Switch from '@/components/switch';

const SwitchDemo = () => {
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleToggleLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="space-y-6 px-2">
      {/* 基础用法 */}
      <div>
        <h3 className="mb-2 text-lg font-medium">基础用法</h3>
        <Switch />
      </div>

      {/* 默认选中 */}
      <div>
        <h3 className="mb-2 text-lg font-medium">默认选中</h3>
        <Switch defaultChecked />
      </div>

      {/* 受控模式 */}
      <div>
        <h3 className="mb-2 text-lg font-medium">受控模式</h3>
        <div className="flex items-center space-x-4">
          <Switch checked={checked} onChange={setChecked} />
          <span className="text-sm text-gray-500">
            当前状态: {checked ? '开' : '关'}
          </span>
          <button
            className="rounded bg-blue-500 px-2 py-1 text-sm text-white"
            onClick={() => setChecked(!checked)}
          >
            切换状态
          </button>
        </div>
      </div>

      {/* 禁用状态 */}
      <div>
        <h3 className="mb-2 text-lg font-medium">禁用状态</h3>
        <div className="flex space-x-4">
          <Switch disabled />
          <Switch disabled defaultChecked />
        </div>
      </div>

      {/* 加载状态 */}
      <div>
        <h3 className="mb-2 text-lg font-medium">加载状态</h3>
        <div className="flex items-center space-x-4">
          <Switch loading={loading} checked={checked} onChange={setChecked} />
          <button
            className="rounded bg-blue-500 px-2 py-1 text-sm text-white"
            onClick={handleToggleLoading}
          >
            触发加载状态
          </button>
        </div>
      </div>

      {/* 自定义样式 */}
      <div>
        <h3 className="mb-2 text-lg font-medium">自定义样式</h3>
        <div className="space-y-2">
          <Switch
            defaultChecked
            trackClassName="h-[34px] min-w-[74px]"
            thumbClassName="h-[30px] w-[30px] group-data-[checked]:translate-x-[calc(100%-30px)]"
          >
            <div className="ml-2 text-xl">大尺寸</div>
          </Switch>
          <Switch
            defaultChecked
            checkedText={'开'}
            uncheckedText={'关'}
            trackClassName="data-[checked]:bg-green-600 data-[checked]:border-green-600"
          >
            绿色主题
          </Switch>
          <Switch
            defaultChecked
            trackClassName="data-[checked]:bg-purple-600 data-[checked]:border-purple-600"
          >
            紫色主题
          </Switch>
          <Switch
            defaultChecked
            trackClassName="data-[checked]:bg-red-600 data-[checked]:border-red-600"
          >
            红色主题
          </Switch>
          <Switch
            defaultChecked
            trackClassName="data-[checked]:bg-gradient-to-r data-[checked]:from-blue-500 data-[checked]:to-purple-500"
          >
            渐变主题
          </Switch>
        </div>
      </div>
    </div>
  );
};

export default SwitchDemo;
