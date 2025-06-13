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

const InfiniteScrollList = () => {
  const getNavigationType = useNavigationType();

  const [pageIndex, setPageIndex] = useState(1);
  const infiniteScrollCache = useCreateLRUCache<
    string,
    { data: IBaseListData; query: { pageIndex: number }; scrollTop: number }
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
      const cachedValue = infiniteScrollCache.get('infiniteScrollCache');
      if (cachedValue) {
        hasInfiniteScrollCache = true;
        setInfiniteScrollListData(cachedValue.data);
        listRef.current?.scrollToPosition(cachedValue.scrollTop);
        setPageIndex(cachedValue.query.pageIndex);
      }
    } else {
      // remove cache
      infiniteScrollCache.delete('infiniteScrollCache');
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
      <h3 className="mb-2 text-lg font-medium">列表滚动分页列表</h3>
      <List
        className="h-[216px] border border-gray-200 text-left"
        infiniteScroll={{
          loadMore: listPageLoadMore,
          hasMore: hasListPageMore,
        }}
        getPositionCache={(cache) => {
          if (infiniteScrollListData!.list.length > 0) {
            infiniteScrollCache.set('infiniteScrollCache', {
              data: infiniteScrollListData!,
              scrollTop: cache.scrollTop,
              query: { pageIndex },
            });
          }
        }}
        ref={listRef}
        list={infiniteScrollListData?.list}
      >
        {(listData) => {
          if (listData.length === 0) {
            return (
              <div className="flex h-[216px] items-center justify-center">
                暂无数据
              </div>
            );
          }
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

export default InfiniteScrollList;
