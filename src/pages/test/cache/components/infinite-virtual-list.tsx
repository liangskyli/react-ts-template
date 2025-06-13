import { useEffect, useRef, useState } from 'react';
import { useNavigationType } from 'react-router';
import { useCreateLRUCache } from '@/components/core/components/cache/use-lru-cache.ts';
import List, { type ListProps } from '@/components/core/components/list';

const sleep = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));
const mockRequest = async (oldList: IBaseList) => {
  const total = 40;
  if (oldList.length >= total) {
    return {
      total,
      list: oldList,
    };
  }
  await sleep(2000);
  const oldCount = oldList.length;
  const appendList = Array.from({ length: 10 }, (_, index) => ({
    id: index + oldCount,
    title: `项目 ${index + 1 + oldCount}`,
  }));
  return {
    total,
    list: [...oldList, ...appendList],
  };
};

type IBaseList = { id: number; title: string }[];
type IBaseListData = { total: number; list: IBaseList };

const InfiniteVirtualScrollList = () => {
  const getNavigationType = useNavigationType();

  const [pageIndex, setPageIndex] = useState(1);
  const infiniteVirtualScrollCache = useCreateLRUCache<
    string,
    {
      data: IBaseListData;
      query: { pageIndex: number };
      positionCache: Parameters<Required<ListProps>['getPositionCache']>[0];
    }
  >('list');

  const [infiniteScrollListData, setInfiniteScrollListData] =
    useState<IBaseListData>();
  const [hasListPageMore, setHasListPageMore] = useState(true);
  const listPageLoadMore = async () => {
    setPageIndex(pageIndex + 1);
    const newData = await mockRequest(infiniteScrollListData!.list);
    setInfiniteScrollListData(newData);
    setHasListPageMore(newData.list.length < newData.total);
  };
  const listRef: ListProps['ref'] = useRef(null);

  useEffect(() => {
    let hasInfiniteScrollCache = false;
    if (getNavigationType === 'POP') {
      // 后退
      const cachedValue = infiniteVirtualScrollCache.get(
        'infiniteVirtualScrollCache',
      );
      if (cachedValue && cachedValue.positionCache.stopIndex) {
        hasInfiniteScrollCache = true;
        setInfiniteScrollListData(cachedValue.data);
        listRef.current?.virtualScrollToIndex(
          cachedValue.positionCache.stopIndex,
        );
        setPageIndex(cachedValue.query.pageIndex);
      }
    } else {
      // remove cache
      infiniteVirtualScrollCache.delete('infiniteVirtualScrollCache');
    }
    if (!hasInfiniteScrollCache) {
      mockRequest([]).then((res) => {
        setInfiniteScrollListData(res);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h3 className="mb-2 text-lg font-medium">虚拟滚动分页列表</h3>
      <List
        className="h-[216px] border border-gray-200 text-left"
        infiniteScroll={{
          loadMore: listPageLoadMore,
          hasMore: hasListPageMore,
        }}
        virtualScroll
        getPositionCache={(cache) => {
          if (infiniteScrollListData!.list.length > 0) {
            infiniteVirtualScrollCache.set('infiniteVirtualScrollCache', {
              data: infiniteScrollListData!,
              positionCache: cache,
              query: { pageIndex },
            });
          }
        }}
        ref={listRef}
        list={infiniteScrollListData?.list}
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

export default InfiniteVirtualScrollList;
