import type { VirtualGridProps } from '@/components/core/components/virtual-grid/virtual-grid.tsx';
import VirtualGrid from '@/components/core/components/virtual-grid/virtual-grid.tsx';

const VirtualGridDemo = () => {
  // 单元格渲染函数
  const renderItem: VirtualGridProps['cellRenderer'] = (props) => {
    // eslint-disable-next-line react/prop-types
    const { rowIndex, columnIndex } = props;
    return (
      <div
        className="tw-h-full tw-p-2"
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
            <div>more data3</div>
            <div>more data4</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="tw-space-y-8 tw-p-6">
      <h1 className="tw-text-3xl tw-font-bold tw-text-gray-900">
        VirtualGrid 控件演示
      </h1>
      <VirtualGrid
        className="tw-h-[200px]"
        columnCount={1}
        rowCount={100000}
        cellRenderer={renderItem}
      />

      <VirtualGrid
        className="tw-mt-10 tw-h-[200px]"
        columnCount={2}
        rowCount={100000}
        cellRenderer={renderItem}
        fixedWidth
        columnWidth={({ index, gridWidth }) => {
          if (index === 0) {
            return 150;
          }
          return gridWidth - 150;
        }}
      />

      <VirtualGrid
        className="tw-mt-10 tw-h-[200px]"
        columnCount={10}
        rowCount={100000}
        cellRenderer={renderItem}
        fixedWidth
        defaultWidth={150}
      />

      <VirtualGrid
        className="tw-mt-10 tw-h-[400px]"
        columnCount={10}
        rowCount={100000}
        cellRenderer={renderItem}
        fixedWidth
        defaultWidth={150}
        fixedTopRowCount={1}
        fixedLeftColumnCount={1}
        fixedRightColumnCount={1}
      />
    </div>
  );
};

export default VirtualGridDemo;
