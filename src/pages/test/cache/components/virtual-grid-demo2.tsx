import { useEffect, useRef, useState } from 'react';
import { useCreateLRUCache } from '@/components/core/components/cache';
import type {
  VirtualGridProps,
  VirtualGridRef,
} from '@/components/core/components/virtual-grid';
import VirtualGrid from '@/components/core/components/virtual-grid';

const MultiGridDemo2 = () => {
  // 单元格渲染函数
  const renderItem: VirtualGridProps['cellRenderer'] = (props) => {
    // eslint-disable-next-line react/prop-types
    const { rowIndex, columnIndex } = props;
    return (
      <div
        className="h-full p-2"
        style={{
          backgroundColor:
            (columnIndex + rowIndex) % 2 === 0 ? '#f5f5f5' : '#ccc',
        }}
      >
        <div>{`R${rowIndex}, C${columnIndex}`}</div>
        {rowIndex % 10 === 0 && columnIndex === 0 && (
          <div>
            <div>more data1</div>
            <div>more data2</div>
          </div>
        )}
      </div>
    );
  };

  const multiGrid1Ref = useRef<VirtualGridRef>(null);
  const virtualGridCache = useCreateLRUCache<
    string,
    Parameters<Required<VirtualGridProps>['getPositionCache']>[0]
  >('virtualGrid_demo2');
  const [virtualGridCacheValue, setVirtualGridCacheValue] =
    useState<Parameters<Required<VirtualGridProps>['getPositionCache']>[0]>();

  useEffect(() => {
    const cachedValue = virtualGridCache.get('virtualGridCache');
    if (cachedValue) {
      setVirtualGridCacheValue(cachedValue);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goToGridPosition = () => {
    multiGrid1Ref.current?.scrollToPosition({
      scrollLeft: 200,
      scrollTop: 1200,
    });
  };
  const goToGridCell = () => {
    multiGrid1Ref.current?.scrollToCell(458, 5);
  };

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-3xl font-bold text-gray-900">
        VirtualGrid WindowScroller 控件演示
      </h1>
      <div className="flex justify-center space-x-4">
        <div onClick={() => goToGridPosition()}>滚动定位</div>
        <div onClick={() => goToGridCell()}>滚动定位单元</div>
      </div>

      <VirtualGrid
        ref={multiGrid1Ref}
        columnCount={10}
        rowCount={100000}
        cellRenderer={renderItem}
        fixedWidth
        defaultWidth={150}
        defaultHeight={40}
        getPositionCache={(cache) => {
          virtualGridCache.set('virtualGridCache', cache);
        }}
        scrollToRow={virtualGridCacheValue?.virtualScrollInfo.rowStopIndex}
        scrollToColumn={
          virtualGridCacheValue?.virtualScrollInfo.columnStopIndex
        }
        windowScroller
      />
    </div>
  );
};

export default MultiGridDemo2;
