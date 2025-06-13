import { useState } from 'react';
import List from '@/components/core/components/list';

let count = 0;
const sleep = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));
const mockRequest = async () => {
  if (count >= 5) {
    return [];
  }
  await sleep(2000);
  count++;
  return ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
};

const ListDemo = () => {
  const [activeTab, setActiveTab] = useState('basic');

  // 生成虚拟滚动演示数据
  const virtualItems = Array.from({ length: 1000 }, (_, index) => ({
    id: index,
    title: `项目 ${index + 1}`,
    description: `这是第 ${index + 1} 个列表项的详细描述 ${index === 4 ? '更多数据更多数据更多数据更多数据更多数据更多数据更多数据更多数据更多数据更多数据更多数据更多数据更多数据' : ''}`,
  }));
  const virtualItem = {
    title: 'Novalee Spicer',
    description: 'Deserunt dolor ea eaque eos',
  };
  const [virtualPageData, setVirtualPageData] = useState(
    Array(20).fill(virtualItem),
  );
  const [hasVirtualPageMore, setHasVirtualPageMore] = useState(true);

  const virtualPageLoadMore = async () => {
    const append = await mockRequest();
    if (Math.random() > 0.5) {
      throw new Error('mock request failed');
    }
    setVirtualPageData((val) => [
      ...val,
      ...Array(append.length).fill(virtualItem),
    ]);
    setHasVirtualPageMore(append.length > 0);
  };

  const [listPageData, setListPageData] = useState(Array(20).fill(virtualItem));
  const [hasListPageMore, setHasListPageMore] = useState(true);
  const listPageLoadMore = async () => {
    const append = await mockRequest();
    if (Math.random() > 0.5) {
      throw new Error('mock request failed');
    }
    setListPageData((val) => [
      ...val,
      ...Array(append.length).fill(virtualItem),
    ]);
    setHasListPageMore(append.length > 0);
  };

  return (
    <div className="space-y-4 px-2 py-4">
      <h2 className="text-xl font-bold">List 列表组件</h2>

      <div className="flex space-x-2 border-b border-gray-200">
        {[
          'basic',
          'card',
          'clickable',
          'virtual',
          'virtual-page',
          'list-page',
        ].map((tab) => (
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
            {tab === 'virtual-page' && '虚拟滚动分页'}
            {tab === 'list-page' && '列表滚动分页'}
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
              className="border-b border-gray-100"
            />
            <List.Item clickable className="border-b border-gray-100">
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
              className="border-b border-gray-100"
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
          <List className="h-[216px]" virtualScroll list={virtualItems}>
            {(listData) => {
              return listData.map((item) => (
                <List.Item
                  key={item.id}
                  title={item.title}
                  description={item.description}
                  clickable
                  suffix={<span className="text-gray-400">›</span>}
                />
              ));
            }}
          </List>
        </div>
      )}

      {activeTab === 'virtual-page' && (
        <div>
          <h3 className="mb-2 text-lg font-medium">虚拟滚动分页列表</h3>
          <p className="mb-2 text-sm text-gray-500">
            分页列表，但只渲染可见区域的项目
          </p>
          <List
            className="h-[216px] text-left"
            virtualScroll
            infiniteScroll={{
              loadMore: virtualPageLoadMore,
              hasMore: hasVirtualPageMore,
            }}
            list={virtualPageData}
          >
            {(listData) => {
              return listData.map((item, index) => (
                <List.Item
                  key={index}
                  title={item.title + index}
                  description={item.description}
                  clickable
                  suffix={<span className="text-gray-400">›</span>}
                />
              ));
            }}
          </List>
        </div>
      )}

      {activeTab === 'list-page' && (
        <div>
          <h3 className="mb-2 text-lg font-medium">列表滚动分页列表</h3>
          <p className="mb-2 text-sm text-gray-500">分页列表</p>
          <List
            className="h-[216px] text-left"
            infiniteScroll={{
              loadMore: listPageLoadMore,
              hasMore: hasListPageMore,
            }}
            list={listPageData}
          >
            {(listData) => {
              return listData.map((item, index) => (
                <List.Item
                  key={index}
                  title={item.title + index}
                  description={item.description}
                />
              ));
            }}
          </List>
        </div>
      )}
    </div>
  );
};

export default ListDemo;
