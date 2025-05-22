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
    <div className="tw-space-y-4 tw-px-2 tw-py-4">
      <h2 className="tw-text-xl tw-font-bold">List 列表组件</h2>

      <div className="tw-flex tw-space-x-2 tw-border-b tw-border-gray-200">
        {['basic', 'card', 'clickable', 'virtual'].map((tab) => (
          <button
            key={tab}
            className={`tw-px-4 tw-py-2 ${
              activeTab === tab
                ? 'tw-border-b-2 tw-border-blue-500 tw-font-medium tw-text-blue-600'
                : 'tw-text-gray-500'
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
          <h3 className="tw-mb-2 tw-text-lg tw-font-medium">基础列表</h3>
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
          <h3 className="tw-mb-2 tw-text-lg tw-font-medium">卡片列表</h3>
          <List className="tw-rounded-lg tw-border tw-border-gray-200">
            <List.Item
              className="tw-rounded-t-lg"
              title="标题文本 1"
              description="这是描述文本，提供更多详细信息"
            />
            <List.Item
              title="标题文本 2"
              description="这是描述文本，提供更多详细信息"
            />
            <List.Item
              className="tw-rounded-b-lg"
              title="标题文本 3"
              description="这是描述文本，提供更多详细信息"
            />
          </List>
        </div>
      )}

      {activeTab === 'clickable' && (
        <div>
          <h3 className="tw-mb-2 tw-text-lg tw-font-medium">可点击列表</h3>
          <List>
            <List.Item
              title="可点击项"
              description="点击查看详情"
              clickable
              onClick={() => console.log('点击了列表项')}
              suffix={<span className="tw-text-gray-400">›</span>}
            />
            <List.Item clickable>
              <div className="tw-flex">
                <div className="tw-flex-1 tw-text-base tw-text-red-600">
                  自定义列表项内容
                </div>
                <div className="tw-ml-3">
                  <span className="tw-text-gray-400">›</span>
                </div>
              </div>
            </List.Item>
            <List.Item
              title="带前缀图标"
              description="包含前缀和后缀"
              clickable
              prefix={
                <div className="tw-h-8 tw-w-8 tw-rounded-full tw-bg-blue-100 tw-p-1.5 tw-text-blue-500">
                  📱
                </div>
              }
              suffix={<span className="tw-text-gray-400">›</span>}
            />
            <List.Item
              title="禁用状态"
              description="此项不可点击"
              clickable
              disabled
              suffix={<span className="tw-text-gray-400">›</span>}
            />
          </List>
        </div>
      )}

      {activeTab === 'virtual' && (
        <div>
          <h3 className="tw-mb-2 tw-text-lg tw-font-medium">虚拟滚动列表</h3>
          <p className="tw-mb-2 tw-text-sm tw-text-gray-500">
            包含1000个列表项，但只渲染可见区域的项目
          </p>
          <List className="tw-h-[216px]" virtualScroll>
            {virtualItems.map((item) => (
              <List.Item
                key={item.id}
                title={item.title}
                description={item.description}
                clickable
                suffix={<span className="tw-text-gray-400">›</span>}
              />
            ))}
          </List>
        </div>
      )}
    </div>
  );
};

export default ListDemo;
