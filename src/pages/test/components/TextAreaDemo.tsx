import { useState } from 'react';
import TextArea from '@/components/textarea';

const TextAreaDemo = () => {
  const [value, setValue] = useState('');

  return (
    <div className="space-y-4 px-2 py-4">
      <div>
        <h3 className="mb-2 text-lg font-medium">基础文本域</h3>
        <TextArea placeholder="请输入内容" />
      </div>

      <div>
        <h3 className="mb-2 text-lg font-medium">受控文本域</h3>
        <TextArea value={value} onChange={setValue} placeholder="请输入内容" />
        <div className="mt-2 text-sm text-gray-500">
          当前输入: {value || '(空)'}
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-lg font-medium">字数统计</h3>
        <TextArea placeholder="最多输入200个字符" showCount maxLength={200} />
      </div>

      <div>
        <h3 className="mb-2 text-lg font-medium">自动高度</h3>
        <TextArea
          placeholder="输入文字会自动调整高度"
          autoSize
          className="mb-4"
        />
        <TextArea
          placeholder="最小3行，最大5行"
          autoSize={{ minRows: 3, maxRows: 5 }}
          defaultValue="这是一个自动调整高度的文本域，最小3行，最大5行。\n你可以尝试输入更多内容来查看效果。"
        />
      </div>

      <div>
        <h3 className="mb-2 text-lg font-medium">禁用和只读</h3>
        <TextArea
          placeholder="禁用状态"
          disabled
          defaultValue="这是禁用状态的文本域"
          className="mb-4"
        />
        <TextArea
          placeholder="只读状态"
          readOnly
          defaultValue="这是只读状态的文本域"
        />
      </div>

      <div>
        <h3 className="mb-2 text-lg font-medium">自定义样式</h3>
        <TextArea
          placeholder="自定义样式"
          textareaClassName="placeholder:text-green-400 text-green-600 border-green-500 focus:border-green-600 focus:ring-green-600"
          countClassName="text-green-600"
          showCount
          maxLength={50}
        />
      </div>
    </div>
  );
};

export default TextAreaDemo;
