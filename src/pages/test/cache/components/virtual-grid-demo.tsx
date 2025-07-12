import { useEffect, useRef, useState } from 'react';
import { useCreateLRUCache } from '@/components/core/components/cache';
import type { VirtualGridProps } from '@/components/core/components/virtual-grid';
import VirtualGrid from '@/components/core/components/virtual-grid';

const VirtualGridDemo = () => {
  // 单元格渲染函数
  const renderItem: VirtualGridProps['renderItem'] = (props) => {
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

  const virtualGridCache = useCreateLRUCache<
    string,
    Parameters<Required<VirtualGridProps>['getPositionCache']>[0]
  >('virtualGrid');
  const [virtualGridCacheValue, setVirtualGridCacheValue] =
    useState<Parameters<Required<VirtualGridProps>['getPositionCache']>[0]>();

  useEffect(() => {
    const cachedValue = virtualGridCache.get('virtualGridCache');
    if (cachedValue) {
      setVirtualGridCacheValue(cachedValue);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const virtualGridRef: VirtualGridProps['ref'] = useRef(null);
  const goToGrid = () => {
    virtualGridRef.current?.scrollToCell({ rowIndex: 458, columnIndex: 5 });
  };

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-3xl font-bold text-gray-900">VirtualGrid 控件演示</h1>
      <div onClick={() => goToGrid()}>滚动定位</div>
      <div className="h-[200px] w-full">
        <VirtualGrid
          ref={virtualGridRef}
          columnCount={10}
          rowCount={100000}
          renderItem={renderItem}
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
        />
      </div>
    </div>
  );
};

export default VirtualGridDemo;
