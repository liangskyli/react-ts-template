import React from 'react';
import { cn } from '@/components/core/class-config';
import type { VirtualGridProps } from '@/components/core/components/virtual-grid';
import VirtualGrid from '@/components/core/components/virtual-grid';
import classConfig from '@/components/core/components/virtual-table/class-config.ts';

/* eslint-disable @typescript-eslint/no-explicit-any */

const classConfigData = classConfig();

export type ColumnConfig<
  RecordType extends Record<string, any> = Record<string, any>,
> = {
  /** 列标题 */
  title: React.ReactNode;
  /** 列宽度 */
  width: number;
  /** 是否固定列 */
  fixed?: 'left' | 'right';
  /** 自定义渲染函数 */
  render?: (value: any, record: RecordType, index: number) => React.ReactNode;
  /** 数据字段名 */
  dataIndex?: string;
  /** 数据列对齐方式 */
  align?: 'left' | 'center' | 'right';
  /** 列头对齐方式 */
  headerAlign?: 'left' | 'center' | 'right';
};

export type VirtualTableProps<
  RecordType extends Record<string, any> = Record<string, any>,
> = {
  /** 列配置 */
  columns: ColumnConfig<RecordType>[];
  /** 数据源 */
  dataSource: RecordType[];
  /** 表头高度 */
  headerHeight?: number;
  /** 是否显示表头 */
  showHeader?: boolean;
  /** 表头单元格的类名 */
  headerCellClass?: string;
  /** 表体单元格的类名 */
  bodyCellClass?: string;
} & Pick<
  VirtualGridProps,
  | 'className'
  | 'rightHeaderClass'
  | 'rightBodyClass'
  | 'leftHeaderClass'
  | 'centerHeaderClass'
  | 'leftBodyClass'
  | 'centerBodyClass'
  | 'hideCenterHeaderGridScrollbar'
  | 'hideLeftBodyGridScrollbar'
  | 'hideRightBodyGridScrollbar'
  | 'ref'
  | 'windowScroller'
>;

const VirtualTable = <
  RecordType extends Record<string, any> = Record<string, any>,
>(
  props: VirtualTableProps<RecordType>,
) => {
  const {
    columns,
    dataSource,
    headerHeight = 40,
    showHeader = true,
    className,
    rightHeaderClass,
    rightBodyClass,
    headerCellClass,
    bodyCellClass,
    ...othersVirtualGridProps
  } = props;

  // 计算固定列
  const leftFixedColumns = columns.filter((col) => col.fixed === 'left');
  const rightFixedColumns = columns.filter((col) => col.fixed === 'right');

  // 计算各区域的列数和宽度
  const leftColumnCount = leftFixedColumns.length;
  const rightColumnCount = rightFixedColumns.length;

  const dataRowCount = dataSource.length;

  const cellRenderer: VirtualGridProps['cellRenderer'] = ({
    rowIndex,
    columnIndex,
  }) => {
    const currentColumn = columns[columnIndex];
    const { headerAlign, title, align, render, dataIndex, width } =
      currentColumn;

    if (showHeader && rowIndex === 0) {
      // 表头
      return (
        <div
          className={cn(
            classConfigData.headerCellClass({ className: headerCellClass }),
          )}
          style={{ height: headerHeight, textAlign: headerAlign }}
        >
          <div style={{ width }}>{title}</div>
        </div>
      );
    }
    // 数据
    const record = dataSource[showHeader ? rowIndex - 1 : rowIndex];
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
        className={cn(
          classConfigData.bodyCellClass({ className: bodyCellClass }),
        )}
        style={{ textAlign: align, width }}
      >
        {content}
      </div>
    );
  };

  return (
    <VirtualGrid
      {...othersVirtualGridProps}
      className={cn(classConfigData.container({ className }))}
      rowCount={showHeader ? dataRowCount + 1 : dataRowCount}
      columnCount={columns.length}
      fixedWidth={true}
      fixedLeftColumnCount={leftColumnCount}
      fixedTopRowCount={showHeader ? 1 : 0}
      fixedRightColumnCount={rightColumnCount}
      cellRenderer={cellRenderer}
      columnWidth={({ index }) => columns[index].width}
      rightHeaderClass={cn(
        classConfigData.rightHeaderClass({ className: rightHeaderClass }),
      )}
      rightBodyClass={cn(
        classConfigData.rightBodyClass({ className: rightBodyClass }),
      )}
    />
  );
};

export default VirtualTable;
