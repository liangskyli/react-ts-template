import { useState } from 'react';
import RadioGroup from '@/components/core/components/radio';

const RadioDemo = () => {
  // 字符串类型示例
  const [stringValue, setStringValue] = useState<string>('apple');

  // 数字类型示例
  const [numberValue, setNumberValue] = useState<number>(1);

  return (
    <div className="tw-space-y-6 tw-px-2">
      {/* 字符串值示例 */}
      <div>
        <h3 className="tw-mb-2 tw-text-lg tw-font-medium">水果选择</h3>
        <RadioGroup<string> value={stringValue} onChange={setStringValue}>
          <RadioGroup.Radio value="apple">苹果</RadioGroup.Radio>
          <RadioGroup.Radio value="banana">香蕉</RadioGroup.Radio>
          <RadioGroup.Radio value="orange">橙子</RadioGroup.Radio>
        </RadioGroup>
        <div className="tw-mt-2 tw-text-sm tw-text-gray-500">
          已选择: {stringValue}
        </div>
      </div>

      {/* 数字值示例 */}
      <div>
        <h3 className="tw-mb-2 tw-text-lg tw-font-medium">数字选择</h3>
        <RadioGroup<number> value={numberValue} onChange={setNumberValue}>
          <RadioGroup.Radio value={1}>选项 1</RadioGroup.Radio>
          <RadioGroup.Radio value={2}>选项 2</RadioGroup.Radio>
          <RadioGroup.Radio value={3}>选项 3</RadioGroup.Radio>
        </RadioGroup>
        <div className="tw-mt-2 tw-text-sm tw-text-gray-500">
          已选择: {numberValue}
        </div>
      </div>

      {/* 默认值示例 */}
      <div>
        <h3 className="tw-mb-2 tw-text-lg tw-font-medium">默认值示例</h3>
        <RadioGroup defaultValue="B">
          <RadioGroup.Radio value="A">选项 A</RadioGroup.Radio>
          <RadioGroup.Radio value="B">选项 B</RadioGroup.Radio>
          <RadioGroup.Radio value="C">选项 C</RadioGroup.Radio>
        </RadioGroup>
      </div>

      {/* 禁用状态 */}
      <div>
        <h3 className="tw-mb-2 tw-text-lg tw-font-medium">禁用状态</h3>
        <RadioGroup disabled defaultValue="X">
          <RadioGroup.Radio value="X">选项 X</RadioGroup.Radio>
          <RadioGroup.Radio value="Y">选项 Y</RadioGroup.Radio>
          <RadioGroup.Radio value="Z">选项 Z</RadioGroup.Radio>
        </RadioGroup>
      </div>

      {/* 自定义样式 */}
      <div>
        <h3 className="tw-mb-2 tw-text-lg tw-font-medium">自定义样式1</h3>
        <RadioGroup defaultValue="B">
          <RadioGroup.Radio
            value="A"
            boxClassName="group-data-[checked]:tw-border-green-600 group-data-[hover]:hover:tw-border-green-500"
            dotClassName="tw-bg-green-600"
            labelClassName="tw-text-green-600"
          >
            选项 A
          </RadioGroup.Radio>
          <RadioGroup.Radio
            disabled
            value="B"
            boxClassName="group-data-[checked]:tw-border-green-600 group-data-[hover]:hover:tw-border-green-500"
            dotClassName="tw-bg-green-600"
            labelClassName="tw-text-green-600"
          >
            选项 B
          </RadioGroup.Radio>
          <RadioGroup.Radio
            value="C"
            boxClassName="tw-h-6 tw-w-6 group-data-[checked]:tw-border-green-600 group-data-[hover]:hover:tw-border-green-500"
            dotClassName="tw-bg-green-600 tw-h-3 tw-w-3"
            labelClassName="tw-text-[20px]"
          >
            选项 C大尺寸
          </RadioGroup.Radio>
        </RadioGroup>
      </div>

      {/* 自定义样式 */}
      <div>
        <h3 className="tw-mb-2 tw-text-lg tw-font-medium">
          自定义样式2 类似antd-mobile Selector
        </h3>
        <RadioGroup defaultValue="B" allowDeselect>
          <RadioGroup.Radio value="A" isCustom>
            <div className="tw-cursor-pointer tw-bg-gray-300 tw-p-2 group-data-[checked]:tw-bg-blue-300 group-data-[checked]:tw-text-blue-600">
              选项 A
            </div>
          </RadioGroup.Radio>
          <RadioGroup.Radio value="B" isCustom>
            <div className="tw-cursor-pointer tw-bg-gray-300 tw-p-2 group-data-[checked]:tw-bg-blue-300 group-data-[checked]:tw-text-blue-600">
              选项 B
            </div>
          </RadioGroup.Radio>
          <RadioGroup.Radio value="C" isCustom>
            <div className="tw-cursor-pointer tw-bg-gray-300 tw-p-2 group-data-[checked]:tw-bg-blue-300 group-data-[checked]:tw-text-blue-600">
              选项 B
            </div>
          </RadioGroup.Radio>
        </RadioGroup>
      </div>
    </div>
  );
};

export default RadioDemo;
