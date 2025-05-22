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
    <div className="tw-space-y-6 tw-px-2">
      {/* 基础用法 */}
      <div>
        <h3 className="tw-mb-2 tw-text-lg tw-font-medium">基础用法</h3>
        <Switch />
      </div>

      {/* 默认选中 */}
      <div>
        <h3 className="tw-mb-2 tw-text-lg tw-font-medium">默认选中</h3>
        <Switch defaultChecked />
      </div>

      {/* 受控模式 */}
      <div>
        <h3 className="tw-mb-2 tw-text-lg tw-font-medium">受控模式</h3>
        <div className="tw-flex tw-items-center tw-space-x-4">
          <Switch checked={checked} onChange={setChecked} />
          <span className="tw-text-sm tw-text-gray-500">
            当前状态: {checked ? '开' : '关'}
          </span>
          <button
            className="tw-rounded tw-bg-blue-500 tw-px-2 tw-py-1 tw-text-sm tw-text-white"
            onClick={() => setChecked(!checked)}
          >
            切换状态
          </button>
        </div>
      </div>

      {/* 禁用状态 */}
      <div>
        <h3 className="tw-mb-2 tw-text-lg tw-font-medium">禁用状态</h3>
        <div className="tw-flex tw-space-x-4">
          <Switch disabled />
          <Switch disabled defaultChecked />
        </div>
      </div>

      {/* 加载状态 */}
      <div>
        <h3 className="tw-mb-2 tw-text-lg tw-font-medium">加载状态</h3>
        <div className="tw-flex tw-items-center tw-space-x-4">
          <Switch loading={loading} checked={checked} onChange={setChecked} />
          <button
            className="tw-rounded tw-bg-blue-500 tw-px-2 tw-py-1 tw-text-sm tw-text-white"
            onClick={handleToggleLoading}
          >
            触发加载状态
          </button>
        </div>
      </div>

      {/* 自定义样式 */}
      <div>
        <h3 className="tw-mb-2 tw-text-lg tw-font-medium">自定义样式</h3>
        <div className="tw-space-y-2">
          <Switch
            defaultChecked
            trackClassName="tw-h-[34px] tw-min-w-[74px]"
            thumbClassName="tw-h-[30px] tw-w-[30px] group-data-[checked]:tw-translate-x-[calc(100%-30px)]"
          >
            <div className="tw-ml-2 tw-text-xl">大尺寸</div>
          </Switch>
          <Switch
            defaultChecked
            checkedText={'开'}
            uncheckedText={'关'}
            trackClassName="data-[checked]:tw-bg-green-600 data-[checked]:tw-border-green-600"
          >
            绿色主题
          </Switch>
          <Switch
            defaultChecked
            trackClassName="data-[checked]:tw-bg-purple-600 data-[checked]:tw-border-purple-600"
          >
            紫色主题
          </Switch>
          <Switch
            defaultChecked
            trackClassName="data-[checked]:tw-bg-red-600 data-[checked]:tw-border-red-600"
          >
            红色主题
          </Switch>
          <Switch
            defaultChecked
            trackClassName="data-[checked]:tw-bg-gradient-to-r data-[checked]:tw-from-blue-500 data-[checked]:tw-to-purple-500"
          >
            渐变主题
          </Switch>
        </div>
      </div>
    </div>
  );
};

export default SwitchDemo;
