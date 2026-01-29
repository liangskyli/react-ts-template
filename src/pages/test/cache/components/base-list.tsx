import { useEffect, useEffectEvent, useRef, useState } from 'react';
import { useNavigationType } from 'react-router';
import { useCreateLRUCache } from '@/components/core/components/cache/use-lru-cache.ts';
import type { ListProps } from '@/components/core/components/list';
import List from '@/components/core/components/list';

const sleep = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));

const initRequest = async () => {
  await sleep(500);
  const baseList = Array.from({ length: 10 }, (_, index) => ({
    id: index,
    title: `项目 ${index + 1}`,
  }));
  return baseList;
};

type IBaseList = { id: number; title: string }[];

const BaseList = () => {
  const getNavigationType = useNavigationType();
  const listRef: ListProps['ref'] = useRef(null);
  const [baseListData, setBaseListData] = useState<IBaseList>([]);

  const baseListCache = useCreateLRUCache<string, { scrollTop: number }>(
    'list',
  );

  const cacheInit = useEffectEvent(() => {
    if (getNavigationType === 'POP') {
      const cachedValue = baseListCache.get('baseListCache');
      if (cachedValue) {
        listRef.current?.scrollToPosition(cachedValue.scrollTop);
      }
    } else {
      baseListCache.delete('baseListCache');
    }
  });
  useEffect(() => {
    initRequest().then((res) => {
      setBaseListData(res);
      cacheInit();
    });
  }, []);

  return (
    <div>
      <h3 className="mb-2 text-lg font-medium">基础列表滚动</h3>
      <List
        className="h-[200px] overflow-y-auto border border-gray-200"
        getPositionCache={(cache) => {
          baseListCache.set('baseListCache', { scrollTop: cache.scrollTop });
        }}
        ref={listRef}
        list={baseListData}
      >
        {(listData) => {
          return listData.map((item) => (
            <List.Item key={item.id} title={item.title} />
          ));
        }}
      </List>
    </div>
  );
};

export default BaseList;
