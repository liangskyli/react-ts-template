import { useEffect, useRef, useState } from 'react';
import { useNavigationType } from 'react-router';
import { useCreateLRUCache } from '@/components/core/components/cache/use-lru-cache.ts';
import type { ListProps } from '@/components/core/components/list';
import List from '@/components/core/components/list';

const sleep = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));

const initRequest = async () => {
  await sleep(1000);
  const baseList = Array.from({ length: 200 }, (_, index) => ({
    id: index,
    title: `项目 ${index + 1}`,
  }));
  return baseList;
};

type IVirtualListData = { id: number; title: string }[];

const VirtualList = () => {
  const getNavigationType = useNavigationType();
  const listRef: ListProps['ref'] = useRef(null);
  const [virtualListData, setVirtualListData] = useState<IVirtualListData>([]);

  const virtualListCache = useCreateLRUCache<
    string,
    Parameters<Required<ListProps>['getPositionCache']>[0]
  >('list');

  useEffect(() => {
    initRequest().then((res) => {
      setVirtualListData(res);
      if (getNavigationType === 'POP') {
        const cachedValue = virtualListCache.get('virtualListCache');
        if (cachedValue && cachedValue.stopIndex) {
          listRef.current?.virtualScrollToIndex(cachedValue.stopIndex);
        }
      } else {
        virtualListCache.delete('virtualListCache');
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h3 className="mb-2 text-lg font-medium">虚拟滚动列表</h3>
      <List
        ref={listRef}
        className="h-[216px] border border-gray-200"
        virtualScroll
        getPositionCache={(cache) => {
          virtualListCache.set('virtualListCache', cache);
        }}
        list={virtualListData}
      >
        {(listData) => {
          return listData.map((item) => (
            <List.Item
              key={item.id}
              title={item.title}
              description={item.id === 15 ? 'description' : ''}
            />
          ));
        }}
      </List>
    </div>
  );
};

export default VirtualList;
