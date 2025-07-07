import React, {
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import type { GridCellRenderer, MultiGridProps } from 'react-virtualized';
import { AutoSizer, MultiGrid } from 'react-virtualized';
import { cn } from '@/components/core/class-config';
import classConfig from '@/components/core/components/table/class-config.ts';

export type ColumnConfig = {
  /** 列的唯一标识 */
  key: string;
  /** 列标题 */
  title: React.ReactNode;
  /** 列宽度 */
  width: number;
  /** 是否固定列 */
  fixed?: 'left' | 'right';
  /** 自定义渲染函数 */
  render?: (value: any, record: any, index: number) => React.ReactNode;
  /** 数据字段名 */
  dataIndex?: string;
  /** 列对齐方式 */
  align?: 'left' | 'center' | 'right';
  /** 列头对齐方式 */
  headerAlign?: 'left' | 'center' | 'right';
};

export type VirtualTableRef = {
  /** 滚动到指定行 */
  scrollToRow: (rowIndex: number) => void;
  /** 滚动到指定列 */
  scrollToColumn: (columnIndex: number) => void;
  /** 重新计算网格大小 */
  recomputeGridSize: () => void;
};

export type VirtualTableProps = {
  /** 列配置 */
  columns: ColumnConfig[];
  /** 数据源 */
  dataSource: any[];
  /** 行高 */
  rowHeight?: number;
  /** 表头高度 */
  headerHeight?: number;
  /** 是否显示表头 */
  showHeader?: boolean;
  /** 行选择配置 */
  rowSelection?: {
    selectedRowKeys?: (string | number)[];
    onChange?: (
      selectedRowKeys: (string | number)[],
      selectedRows: any[],
    ) => void;
    getCheckboxProps?: (record: any) => { disabled?: boolean };
  };
  /** 行点击事件 */
  onRowClick?: (record: any, index: number) => void;
  /** 行双击事件 */
  onRowDoubleClick?: (record: any, index: number) => void;
  /** 自定义类名 */
  className?: string;
  /** 表格引用 */
  ref?: React.Ref<VirtualTableRef>;
  /** 获取行的key */
  rowKey?: string | ((record: any, index: number) => string | number);
};

const VirtualTable = (props: VirtualTableProps) => {
  const {
    columns,
    dataSource,
    rowHeight = 48,
    headerHeight = 40,
    showHeader = true,
    rowSelection,
    onRowClick,
    onRowDoubleClick,
    className,
    ref,
    rowKey = 'key',
  } = props;

  const multiGridRef = useRef<MultiGrid>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>(
    rowSelection?.selectedRowKeys || [],
  );

  // 计算固定列
  const leftFixedColumns = columns.filter((col) => col.fixed === 'left');
  const rightFixedColumns = columns.filter((col) => col.fixed === 'right');
  const normalColumns = columns.filter((col) => !col.fixed);

  const fixedColumnCount = leftFixedColumns.length;
  const fixedRowCount = showHeader ? 1 : 0;

  // 获取行的key值
  const getRowKey = useCallback(
    (record: any, index: number) => {
      if (typeof rowKey === 'function') {
        return rowKey(record, index);
      }
      return record[rowKey] || index;
    },
    [rowKey],
  );

  // 处理行选择
  const handleRowSelect = useCallback(
    (record: any, index: number, selected: boolean) => {
      const key = getRowKey(record, index);
      let newSelectedKeys: (string | number)[];

      if (selected) {
        newSelectedKeys = [...selectedRowKeys, key];
      } else {
        newSelectedKeys = selectedRowKeys.filter((k) => k !== key);
      }

      setSelectedRowKeys(newSelectedKeys);
      const selectedRows = dataSource.filter((item, idx) =>
        newSelectedKeys.includes(getRowKey(item, idx)),
      );
      rowSelection?.onChange?.(newSelectedKeys, selectedRows);
    },
    [selectedRowKeys, dataSource, getRowKey, rowSelection],
  );

  // 同步外部传入的selectedRowKeys
  React.useEffect(() => {
    if (rowSelection?.selectedRowKeys) {
      setSelectedRowKeys(rowSelection.selectedRowKeys);
    }
  }, [rowSelection?.selectedRowKeys]);

  // 单元格渲染器
  const cellRenderer: GridCellRenderer = useCallback(
    ({ columnIndex, rowIndex, style, key }) => {
      const isHeader = rowIndex === 0 && showHeader;
      const dataIndex = isHeader ? rowIndex : rowIndex - (showHeader ? 1 : 0);
      const column = columns[columnIndex];
      const record = isHeader ? null : dataSource[dataIndex];

      if (!column) return null;

      let content: React.ReactNode;
      let cellClassName: string;
      const cellStyle: React.CSSProperties = { ...style };

      if (isHeader) {
        content = column.title;
        cellClassName = cn(
          classConfig.headerCellConfig(),
          column.headerAlign && `text-${column.headerAlign}`,
        );
      } else {
        if (column.render) {
          content = column.render(
            column.dataIndex ? record?.[column.dataIndex] : record,
            record,
            dataIndex,
          );
        } else {
          content = column.dataIndex ? record?.[column.dataIndex] : '';
        }

        const isSelected = record
          ? selectedRowKeys.includes(getRowKey(record, dataIndex))
          : false;
        cellClassName = cn(
          classConfig.bodyCellConfig(),
          column.align && `text-${column.align}`,
          isSelected && 'bg-blue-50',
        );
      }

      return (
        <div
          key={key}
          style={cellStyle}
          className={cellClassName}
          onClick={() => {
            if (!isHeader && onRowClick && record) {
              onRowClick(record, dataIndex);
            }
          }}
          onDoubleClick={() => {
            if (!isHeader && onRowDoubleClick && record) {
              onRowDoubleClick(record, dataIndex);
            }
          }}
        >
          {content}
        </div>
      );
    },
    [
      columns,
      dataSource,
      showHeader,
      selectedRowKeys,
      getRowKey,
      onRowClick,
      onRowDoubleClick,
    ],
  );

  // 获取列宽
  const getColumnWidth = useCallback(
    ({ index }: { index: number }) => {
      return columns[index]?.width || 100;
    },
    [columns],
  );

  // 获取行高
  const getRowHeight = useCallback(
    ({ index }: { index: number }) => {
      if (index === 0 && showHeader) {
        return headerHeight;
      }
      return rowHeight;
    },
    [showHeader, headerHeight, rowHeight],
  );

  useImperativeHandle<VirtualTableRef, VirtualTableRef>(
    ref,
    () => ({
      scrollToRow: (rowIndex: number) => {
        multiGridRef.current?.scrollToCell({ rowIndex, columnIndex: 0 });
      },
      scrollToColumn: (columnIndex: number) => {
        multiGridRef.current?.scrollToCell({ rowIndex: 0, columnIndex });
      },
      recomputeGridSize: () => {
        multiGridRef.current?.recomputeGridSize();
      },
    }),
    [],
  );

  const totalRowCount = dataSource.length + (showHeader ? 1 : 0);
  const totalColumnCount = columns.length;

  return (
    <div
      className={cn(
        classConfig.containerConfig({ defaultHeight: true }),
        className,
      )}
    >
      <AutoSizer>
        {({ width, height }) => (
          <MultiGrid
            ref={multiGridRef}
            width={width}
            height={height}
            columnCount={totalColumnCount}
            rowCount={totalRowCount}
            columnWidth={getColumnWidth}
            rowHeight={getRowHeight}
            fixedColumnCount={fixedColumnCount}
            fixedRowCount={fixedRowCount}
            cellRenderer={cellRenderer}
            classNameBottomLeftGrid="bg-white"
            classNameBottomRightGrid="bg-white"
            classNameTopLeftGrid="bg-gray-50"
            classNameTopRightGrid="bg-gray-50"
            enableFixedColumnScroll
            enableFixedRowScroll
            hideTopRightGridScrollbar
            hideBottomLeftGridScrollbar
            style={{
              outline: 'none',
            }}
          />
        )}
      </AutoSizer>
    </div>
  );
};

export default VirtualTable;
