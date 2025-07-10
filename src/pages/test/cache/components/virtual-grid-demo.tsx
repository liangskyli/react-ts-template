import { useEffect, useState } from 'react';
import { useCreateLRUCache } from '@/components/core/components/cache';
import type { VirtualGridProps } from '@/components/core/components/virtual-grid';
import VirtualGrid from '@/components/core/components/virtual-grid';
import type { MultiGrid2Props } from '@/components/core/components/virtual-grid/multi2-grid.tsx';
import MultiGrid2 from '@/components/core/components/virtual-grid/multi2-grid.tsx';
import type { VirtualMultiGridProps } from '@/components/core/components/virtual-grid/multi-grid.tsx';
import VirtualMultiGrid from '@/components/core/components/virtual-grid/multi-grid.tsx';

const VirtualGridDemo = () => {
  // 单元格渲染函数
  const renderItem: MultiGrid2Props['cellRenderer'] = (props) => {
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

  const virtualMultiGridCache = useCreateLRUCache<
    string,
    Parameters<Required<VirtualMultiGridProps>['getPositionCache']>[0]
  >('virtualMultiGrid');
  const [virtualMultiGridCacheValue, setVirtualMultiGridValue] =
    useState<
      Parameters<Required<VirtualMultiGridProps>['getPositionCache']>[0]
    >();

  useEffect(() => {
    const cachedValue = virtualGridCache.get('virtualGridCache');
    if (cachedValue) {
      setVirtualGridCacheValue(cachedValue);
    }

    const cachedValue2 = virtualMultiGridCache.get('virtualMultiGridCache');
    if (cachedValue2) {
      setVirtualMultiGridValue(cachedValue2);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const fixedTopRowCount = 1;
  const fixedLeftColumnCount = 1;

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-3xl font-bold text-gray-900">VirtualGrid 控件演示</h1>

      <div className="h-[200px] w-full">
        <MultiGrid2
          columnCount={10}
          rowCount={100000}
          cellRenderer={renderItem}
          fixedWidth
          defaultWidth={150}
          getPositionCache={(cache) => {
            virtualGridCache.set('virtualGridCache', cache);
          }}
          scrollToRow={275}
          scrollToColumn={8}
          /*scrollToRow={virtualGridCacheValue?.virtualScrollInfo.rowStopIndex}
          scrollToColumn={
            virtualGridCacheValue?.virtualScrollInfo.columnStopIndex
          }*/
        />
      </div>

      <div className="h-[400px] w-full">
        <MultiGrid2
          columnCount={10}
          rowCount={100000}
          cellRenderer={renderItem}
          fixedWidth
          defaultWidth={150}
          fixedLeftColumnCount={fixedLeftColumnCount}
          fixedTopRowCount={fixedTopRowCount}
          getPositionCache={(cache) => {
            virtualMultiGridCache.set('virtualMultiGridCache', cache);
          }}
          scrollToRow={
            virtualMultiGridCacheValue
              ? virtualMultiGridCacheValue.virtualScrollInfo.rowStopIndex +
                fixedTopRowCount
              : undefined
          }
          scrollToColumn={
            virtualMultiGridCacheValue
              ? virtualMultiGridCacheValue.virtualScrollInfo.columnStopIndex +
                fixedLeftColumnCount
              : undefined
          }
        />
      </div>
    </div>
  );
};

export default VirtualGridDemo;
