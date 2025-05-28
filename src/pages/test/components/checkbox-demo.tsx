import { useState } from 'react';
import Checkbox, {
  DefaultCheckedIcon,
} from '@/components/core/components/checkbox';

const CheckboxDemo = () => {
  const [checked, setChecked] = useState(false);
  const [groupValue, setGroupValue] = useState<(string | number)[]>(['1', '3']);

  return (
    <div className="space-y-4 px-2">
      {/* 受控模式 */}
      <Checkbox checked={checked} onChange={setChecked}>
        受控模式
      </Checkbox>
      {/* 非受控模式 */}
      <div className="flex flex-wrap">
        <Checkbox>非受控模式</Checkbox>
        <Checkbox defaultChecked indeterminate>
          非受控模式
        </Checkbox>
      </div>
      {/* 禁用状态 */}
      <div className="flex flex-wrap">
        <Checkbox disabled>禁用选项</Checkbox>
        <Checkbox disabled defaultChecked>
          禁用选项
        </Checkbox>
      </div>
      {/* 自定义样式 */}
      <div className="flex flex-wrap">
        <Checkbox
          defaultChecked
          boxClassName="h-6 w-6"
          labelClassName="text-[20px]"
        >
          大尺寸
        </Checkbox>
        <Checkbox
          defaultChecked
          boxClassName="group-data-[checked]:bg-green-600 group-data-[checked]:border-green-600 group-data-[hover]:hover:border-green-500"
          checkClassName="text-red-600"
          labelClassName="text-green-600"
        >
          绿色
        </Checkbox>
        <Checkbox
          defaultChecked
          boxClassName="group-data-[checked]:bg-red-600 group-data-[checked]:border-red-600 group-data-[hover]:hover:border-red-500"
        >
          红色
        </Checkbox>
        <Checkbox
          defaultChecked
          boxClassName="rounded-full group-data-[checked]:bg-purple-600 group-data-[checked]:border-purple-600 group-data-[hover]:hover:border-purple-500"
        >
          紫色圆形
        </Checkbox>
        <Checkbox
          defaultChecked
          boxClassName="rounded-full group-data-[checked]:bg-white group-data-[checked]:border-purple-600 group-data-[hover]:hover:border-purple-500"
          checkClassName="w-[14px] h-[14px]"
          checkedIcon={
            <div className="flex h-[14px] w-[14px] items-center justify-center rounded-full bg-purple-600">
              <DefaultCheckedIcon className="h-[10px] w-[10px]" />
            </div>
          }
        >
          紫色圆环
        </Checkbox>
        <Checkbox
          defaultChecked
          boxClassName="rounded-full group-data-[checked]:bg-white group-data-[checked]:border-purple-600 group-data-[hover]:hover:border-purple-500"
          checkedIcon={
            <div className="h-[12px] w-[12px] rounded-full bg-purple-600" />
          }
        >
          紫色圆点
        </Checkbox>
        <Checkbox
          defaultChecked
          indeterminate
          boxClassName="rounded-full group-data-[checked]:bg-white group-data-[checked]:border-purple-600 group-data-[hover]:hover:border-purple-500"
          indeterminateIcon={
            <div className="h-[12px] w-[12px] rounded-full bg-purple-600" />
          }
        >
          紫色圆点(半选状态)
        </Checkbox>
      </div>
      {/* Checkbox.Group 示例 */}
      <div className="space-y-2">
        <h3>非受控模式：</h3>
        <Checkbox.Group defaultValue={[1, 2]}>
          <Checkbox value={1}>选项1</Checkbox>
          <Checkbox value={2}>选项2</Checkbox>
          <Checkbox value={3}>选项3</Checkbox>
        </Checkbox.Group>

        <h3>受控模式：</h3>
        <Checkbox.Group value={groupValue} onChange={setGroupValue}>
          <Checkbox value="1">选项1</Checkbox>
          <Checkbox value="2">选项2</Checkbox>
          <Checkbox value="3">选项3</Checkbox>
        </Checkbox.Group>

        <h3>禁用状态：</h3>
        <Checkbox.Group disabled defaultValue={['X']}>
          <Checkbox value="X">选项X</Checkbox>
          <Checkbox value="Y">选项Y</Checkbox>
          <Checkbox value="Z">选项Z</Checkbox>
        </Checkbox.Group>

        <h3>自定义样式：类似antd-mobile Selector</h3>
        <Checkbox.Group value={groupValue} onChange={setGroupValue}>
          <Checkbox value="1" isCustom>
            <div className="cursor-pointer bg-gray-300 p-2 group-data-[checked]:bg-blue-300 group-data-[checked]:text-blue-600">
              选项1
            </div>
          </Checkbox>
          <Checkbox value="2" isCustom>
            <div className="cursor-pointer bg-gray-300 p-2 group-data-[checked]:bg-blue-300 group-data-[checked]:text-blue-600">
              选项2
            </div>
          </Checkbox>
          <Checkbox value="3" isCustom>
            <div className="cursor-pointer bg-gray-300 p-2 group-data-[checked]:bg-blue-300 group-data-[checked]:text-blue-600">
              选项3
            </div>
          </Checkbox>
        </Checkbox.Group>
      </div>
    </div>
  );
};
export default CheckboxDemo;
