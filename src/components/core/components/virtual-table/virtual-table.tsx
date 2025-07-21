import React from 'react';
import VirtualGrid, {
  VirtualGridProps,
} from '@/components/core/components/virtual-grid';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TableRecord = Record<string, any>;

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
  render?: (
    value: TableRecord,
    record: TableRecord,
    index: number,
  ) => React.ReactNode;
  /** 数据字段名 */
  dataIndex?: string;
  /** 列对齐方式 */
  align?: 'left' | 'center' | 'right';
  /** 列头对齐方式 */
  headerAlign?: 'left' | 'center' | 'right';
};

export type VirtualTableProps = {
  /** 列配置 */
  columns: ColumnConfig[];
  /** 数据源 */
  dataSource: TableRecord[];
  /** 行高 */
  rowHeight?: number;
  /** 表头高度 */
  headerHeight?: number;
  /** 是否显示表头 */
  showHeader?: boolean;
} & Pick<VirtualGridProps, 'className'>;

const VirtualTable = (props: VirtualTableProps) => {
  const {
    columns,
    dataSource,
    rowHeight,
    headerHeight = 40,
    showHeader = true,
    className,
  } = props;

  // 计算固定列
  const leftFixedColumns = columns.filter((col) => col.fixed === 'left');
  const rightFixedColumns = columns.filter((col) => col.fixed === 'right');
  const centerColumns = columns.filter((col) => !col.fixed);

  // 计算各区域的列数和宽度
  const leftColumnCount = leftFixedColumns.length;
  const centerColumnCount = centerColumns.length;
  const rightColumnCount = rightFixedColumns.length;

  const dataRowCount = dataSource.length;

  const cellRenderer: VirtualGridProps['cellRenderer'] = ({
    rowIndex,
    columnIndex,
  }) => {
    const currentColumn = columns[columnIndex];
    const { headerAlign, title, align, render, dataIndex, width } = currentColumn;

    if (showHeader && rowIndex === 0) {
      // 表头
      return (
        <div
          className="h-full border-b border-r border-gray-200 bg-gray-50 flex items-center"
          style={{ height: headerHeight, textAlign: headerAlign }}
        >
          <div style={{ width }}>{title}</div>
        </div>
      );
    }
    // 数据
    const record = dataSource[showHeader ? rowIndex-1: rowIndex];
    let content: React.ReactNode;
    if (render) {
      content = render(
        dataIndex ? record[dataIndex] : record,
        record,
        rowIndex,
      );
    } else {
      content = dataIndex ? record[dataIndex] : '';
    }
    return (
      <div
        className="h-full border-b border-r border-gray-200"
        style={{ textAlign: align,height: rowHeight }}
      >{content}</div>
    );
  };

  return (
    <VirtualGrid
      className={className}
      rowCount={dataRowCount + 1}
      columnCount={columns.length}
      fixedWidth={true}
      fixedLeftColumnCount={leftColumnCount}
      fixedTopRowCount={showHeader ? 1 : 0}
      fixedRightColumnCount={rightColumnCount}
      cellRenderer={cellRenderer}
      columnWidth={({ index }) => columns[index].width}
      rightHeaderClass="border-l border-gray-200"
      rightBodyClass="border-l border-gray-200"
    />
  );
};

export default VirtualTable;
