import { useState } from 'react';
import SearchBar from '@/components/core/components/search-bar';

const SearchBarDemo = () => {
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');

  return (
    <div className="space-y-6 px-4 py-6">
      <div>
        <h3 className="mb-3 text-lg font-medium">基础搜索框</h3>
        <SearchBar placeholder="请输入搜索内容" />
      </div>

      <div>
        <h3 className="mb-3 text-lg font-medium">受控组件</h3>
        <SearchBar
          value={value1}
          onChange={setValue1}
          onSearch={(val) => console.log('搜索:', val)}
          placeholder="请输入搜索内容"
        />
        <div className="mt-2 text-sm text-gray-500">
          当前输入: {value1 || '(空)'}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-lg font-medium">自定义配置</h3>
        <div className="space-y-3">
          <SearchBar showSearchIcon={false} placeholder="不显示搜索图标" />
          <SearchBar showClearButton={false} placeholder="不显示清除按钮" />
          <SearchBar maxLength={20} placeholder="最多输入20个字符" />
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-lg font-medium">禁用和只读状态</h3>
        <div className="space-y-3">
          <SearchBar
            disabled
            defaultValue="禁用状态"
            placeholder="请输入搜索内容"
          />
          <SearchBar
            readOnly
            defaultValue="只读状态"
            placeholder="请输入搜索内容"
          />
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-lg font-medium">事件处理</h3>
        <SearchBar
          value={value2}
          onChange={(val) => {
            setValue2(val);
            console.log('输入变化:', val);
          }}
          onSearch={(val) => console.log('搜索:', val)}
          onClear={() => console.log('清除内容')}
          onFocus={() => console.log('获得焦点')}
          onBlur={() => console.log('失去焦点')}
          placeholder="请输入搜索内容（查看控制台日志）"
        />
        <div className="mt-2 text-sm text-gray-500">
          打开浏览器控制台查看事件日志
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-lg font-medium">继承Input组件功能</h3>
        <div className="space-y-3">
          <SearchBar type="email" placeholder="邮箱搜索" />
          <SearchBar
            inputMode="decimal"
            placeholder="数字搜索"
            decimalPlaces={2}
            min={0}
            max={100}
          />
          <SearchBar type="tel" placeholder="电话号码搜索" />
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-lg font-medium">自定义样式</h3>
        <SearchBar
          inputClassName="border-purple-500 focus:border-purple-600 focus:ring-purple-600"
          placeholder="自定义紫色边框"
        />
      </div>
    </div>
  );
};

export default SearchBarDemo;
