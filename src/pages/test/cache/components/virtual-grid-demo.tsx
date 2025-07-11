import { useEffect, useRef, useState } from 'react';
import { useCreateLRUCache } from '@/components/core/components/cache';
import type {
  MultiGrid2Props,
  MultiGrid2Ref,
} from '@/components/core/components/virtual-grid/multi2-grid.tsx';
import MultiGrid2 from '@/components/core/components/virtual-grid/multi2-grid.tsx';

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
    Parameters<Required<MultiGrid2Props>['getPositionCache']>[0]
  >('virtualGrid');
  const [virtualGridCacheValue, setVirtualGridCacheValue] =
    useState<Parameters<Required<MultiGrid2Props>['getPositionCache']>[0]>();

  const virtualMultiGridCache = useCreateLRUCache<
    string,
    Parameters<Required<MultiGrid2Props>['getPositionCache']>[0]
  >('virtualMultiGrid');
  const [virtualMultiGridCacheValue, setVirtualMultiGridValue] =
    useState<Parameters<Required<MultiGrid2Props>['getPositionCache']>[0]>();
  const multiGrid2Ref = useRef<MultiGrid2Ref>(null);
  const fixedTopRowCount = 1;
  const fixedLeftColumnCount = 1;
  const fixedRightColumnCount = 1;

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

  /*useEffect(() => {
    if (virtualMultiGridCacheValue && multiGrid2Ref.current) {
      const {
        virtualScrollInfo: { rowStopIndex, columnStopIndex },
      } = virtualMultiGridCacheValue;
      multiGrid2Ref.current.scrollToCell(
        rowStopIndex + fixedTopRowCount,
        columnStopIndex + fixedLeftColumnCount,
      );
    }
  }, [virtualMultiGridCacheValue]);*/
  useEffect(() => {
  if (multiGrid2Ref.current) {
    multiGrid2Ref.current.scrollToCell(
      211,
      5,
    );
  }
}, []);

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
          scrollToRow={virtualGridCacheValue?.virtualScrollInfo.rowStopIndex}
          scrollToColumn={
            virtualGridCacheValue?.virtualScrollInfo.columnStopIndex
          }
        />
      </div>

      <div className="h-[400px] w-full">
        <MultiGrid2
          ref={multiGrid2Ref}
          columnCount={10}
          rowCount={100000}
          cellRenderer={renderItem}
          fixedWidth
          defaultWidth={150}
          fixedHeight
          defaultHeight={40}
          fixedLeftColumnCount={fixedLeftColumnCount}
          fixedTopRowCount={fixedTopRowCount}
          fixedRightColumnCount={fixedRightColumnCount}
          /*getPositionCache={(cache) => {
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
          }*/
          /*scrollToRow={211}
          scrollToColumn={5}*/
        />
      </div>
    </div>
  );
};

export default VirtualGridDemo;
