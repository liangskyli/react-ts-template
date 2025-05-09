import { useState } from 'react';
import List from '@/components/list';

const ListDemo = () => {
  const [activeTab, setActiveTab] = useState('basic');

  // 生成虚拟滚动演示数据
  const virtualItems = Array.from({ length: 1000 }, (_, index) => ({
    id: index,
    title: `项目 ${index + 1}`,
    description: `这是第 ${index + 1} 个列表项的详细描述 ${index === 4 ? '更多数据更多数据更多数据更多数据更多数据更多数据更多数据更多数据更多数据更多数据更多数据更多数据更多数据' : ''}`,
  }));

  return (
    <div className="space-y-4 px-2 py-4">
      <h2 className="text-xl font-bold">List 列表组件</h2>

      <div className="flex space-x-2 border-b border-gray-200">
        {['basic', 'card', 'clickable', 'virtual'].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 ${
              activeTab === tab
                ? 'border-b-2 border-blue-500 font-medium text-blue-600'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'basic' && '基础列表'}
            {tab === 'card' && '卡片列表'}
            {tab === 'clickable' && '可点击列表'}
            {tab === 'virtual' && '虚拟滚动'}
          </button>
        ))}
      </div>

      {activeTab === 'basic' && (
        <div>
          <h3 className="mb-2 text-lg font-medium">基础列表</h3>
          <List>
            <List.Item
              title="标题文本 1"
              description="这是描述文本，提供更多详细信息"
            />
            <List.Item
              title="标题文本 2"
              description="这是描述文本，提供更多详细信息"
            />
            <List.Item
              title="标题文本 3"
              description="这是描述文本，提供更多详细信息"
            />
          </List>
        </div>
      )}

      {activeTab === 'card' && (
        <div>
          <h3 className="mb-2 text-lg font-medium">卡片列表</h3>
          <List className="rounded-lg border border-gray-200">
            <List.Item
              className="rounded-t-lg"
              title="标题文本 1"
              description="这是描述文本，提供更多详细信息"
            />
            <List.Item
              title="标题文本 2"
              description="这是描述文本，提供更多详细信息"
            />
            <List.Item
              className="rounded-b-lg"
              title="标题文本 3"
              description="这是描述文本，提供更多详细信息"
            />
          </List>
        </div>
      )}

      {activeTab === 'clickable' && (
        <div>
          <h3 className="mb-2 text-lg font-medium">可点击列表</h3>
          <List>
            <List.Item
              title="可点击项"
              description="点击查看详情"
              clickable
              onClick={() => console.log('点击了列表项')}
              suffix={<span className="text-gray-400">›</span>}
            />
            <List.Item clickable>
              <div className="flex">
                <div className="flex-1 text-base text-red-600">
                  自定义列表项内容
                </div>
                <div className="ml-3">
                  <span className="text-gray-400">›</span>
                </div>
              </div>
            </List.Item>
            <List.Item
              title="带前缀图标"
              description="包含前缀和后缀"
              clickable
              prefix={
                <div className="h-8 w-8 rounded-full bg-blue-100 p-1.5 text-blue-500">
                  📱
                </div>
              }
              suffix={<span className="text-gray-400">›</span>}
            />
            <List.Item
              title="禁用状态"
              description="此项不可点击"
              clickable
              disabled
              suffix={<span className="text-gray-400">›</span>}
            />
          </List>
        </div>
      )}

      {activeTab === 'virtual' && (
        <div>
          <h3 className="mb-2 text-lg font-medium">虚拟滚动列表</h3>
          <p className="mb-2 text-sm text-gray-500">
            包含1000个列表项，但只渲染可见区域的项目
          </p>
          <List className="h-[216px]" virtualScroll>
            {virtualItems.map((item) => (
              <List.Item
                key={item.id}
                title={item.title}
                description={item.description}
                clickable
                suffix={<span className="text-gray-400">›</span>}
              />
            ))}
          </List>
        </div>
      )}
    </div>
  );
};

export default ListDemo;
