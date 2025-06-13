import BaseList from '@/pages/test/cache/components/base-list.tsx';
import InfiniteScrollList from '@/pages/test/cache/components/infinite-scroll-list.tsx';
import InfiniteVirtualScrollList from '@/pages/test/cache/components/infinite-virtual-list.tsx';
import VirtualList from '@/pages/test/cache/components/virtual-list.tsx';

const ListDemo = () => {
  return (
    <div className="space-y-4 px-2 py-4">
      <h2 className="text-xl font-bold">List 列表组件</h2>
      <BaseList />
      <InfiniteScrollList />
      <VirtualList />
      <InfiniteVirtualScrollList />
    </div>
  );
};

export default ListDemo;
