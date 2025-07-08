import { useEffect, useState } from 'react';
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
        {rowIndex === 0 && columnIndex === 0 && (
          <div>
            <div>more data1</div>
            <div>more data2</div>
            <div>more data3</div>
            <div>more data4</div>
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

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-3xl font-bold text-gray-900">VirtualGrid 控件演示</h1>

      <div className="h-[200px] w-full">
        <VirtualGrid
          columnCount={10}
          rowCount={100000}
          renderItem={renderItem}
          fixedWidth
          defaultWidth={150}
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
