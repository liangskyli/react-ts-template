import React, {
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import type { GridCellRenderer } from 'react-virtualized';
import { AutoSizer, Grid } from 'react-virtualized';
import { cn } from '@/components/core/class-config';
import classConfig from '@/components/core/components/table/class-config.ts';

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
  render?: (value: TableRecord, record: TableRecord, index: number) => React.ReactNode;
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
  dataSource: TableRecord[];
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
      selectedRows: TableRecord[],
    ) => void;
    getCheckboxProps?: (record: TableRecord) => { disabled?: boolean };
  };
  /** 行点击事件 */
  onRowClick?: (record: TableRecord, index: number) => void;
  /** 行双击事件 */
  onRowDoubleClick?: (record: TableRecord, index: number) => void;
  /** 自定义类名 */
  className?: string;
  /** 表格引用 */
  ref?: React.Ref<VirtualTableRef>;
  /** 获取行的key */
  rowKey?: string | ((record: TableRecord, index: number) => string | number);
};

const VirtualTable = (props: VirtualTableProps) => {
  const {
    columns,
    dataSource,
    rowHeight = 44,
    headerHeight = 40,
    showHeader = true,
    rowSelection,
    onRowClick,
    onRowDoubleClick,
    className,
    ref,
    rowKey = 'key',
  } = props;

  // 表头Grid引用
  const leftHeaderGridRef = useRef<Grid>(null);
  const centerHeaderGridRef = useRef<Grid>(null);
  const rightHeaderGridRef = useRef<Grid>(null);

  // 数据Grid引用
  const leftBodyGridRef = useRef<Grid>(null);
  const centerBodyGridRef = useRef<Grid>(null);
  const rightBodyGridRef = useRef<Grid>(null);

  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>(
    rowSelection?.selectedRowKeys || [],
  );

  // 跟踪滚动位置
  const scrollPositionRef = useRef({ scrollTop: 0, scrollLeft: 0 });

  // 计算固定列
  const leftFixedColumns = columns.filter((col) => col.fixed === 'left');
  const rightFixedColumns = columns.filter((col) => col.fixed === 'right');
  const centerColumns = columns.filter((col) => !col.fixed);

  // 计算各区域的列数和宽度

  const leftColumnCount = leftFixedColumns.length;
  const centerColumnCount = centerColumns.length;
  const rightColumnCount = rightFixedColumns.length;

  const leftWidth = leftFixedColumns.reduce((sum, col) => sum + col.width, 0);
  const rightWidth = rightFixedColumns.reduce((sum, col) => sum + col.width, 0);

  // 获取行的key值
  const getRowKey = useCallback(
    (record: TableRecord, index: number) => {
      if (typeof rowKey === 'function') {
        return rowKey(record, index);
      }
      return record[rowKey] || index;
    },
    [rowKey],
  );

  // 同步外部传入的selectedRowKeys
  React.useEffect(() => {
    if (rowSelection?.selectedRowKeys) {
      setSelectedRowKeys(rowSelection.selectedRowKeys);
    }
  }, [rowSelection?.selectedRowKeys]);

  // 创建表头单元格渲染器
  const createHeaderCellRenderer = useCallback((columnsToRender: ColumnConfig[]) => {
    const cellRenderer: GridCellRenderer = ({ columnIndex, style, key }) => {
      const column = columnsToRender[columnIndex];
      if (!column) return null;

      const cellClassName = cn(
        classConfig.headerCellConfig(),
        column.headerAlign && `text-${column.headerAlign}`,
      );

      return (
        <div
          key={key}
          style={style}
          className={cellClassName}
        >
          {column.title}
        </div>
      );
    };
    return cellRenderer;
  }, []);

  // 创建数据单元格渲染器
  const createBodyCellRenderer = useCallback((columnsToRender: ColumnConfig[]) => {
    const cellRenderer: GridCellRenderer = ({ columnIndex, rowIndex, style, key }) => {
      const column = columnsToRender[columnIndex];
      const record = dataSource[rowIndex];

      if (!column || !record) return null;

      let content: React.ReactNode;
      if (column.render) {
        content = column.render(
          column.dataIndex ? record[column.dataIndex] : record,
          record,
          rowIndex,
        );
      } else {
        content = column.dataIndex ? record[column.dataIndex] : '';
      }

      const isSelected = selectedRowKeys.includes(getRowKey(record, rowIndex));
      const cellClassName = cn(
        classConfig.bodyCellConfig(),
        column.align && `text-${column.align}`,
        isSelected && 'bg-blue-50',
      );

      return (
        <div
          key={key}
          style={style}
          className={cellClassName}
          onClick={() => {
            if (onRowClick) {
              onRowClick(record, rowIndex);
            }
          }}
          onDoubleClick={() => {
            if (onRowDoubleClick) {
              onRowDoubleClick(record, rowIndex);
            }
          }}
        >
          {content}
        </div>
      );
    };
    return cellRenderer;
  }, [dataSource, selectedRowKeys, getRowKey, onRowClick, onRowDoubleClick]);

  // 获取列宽函数工厂
  const createColumnWidthGetter = useCallback((columnsToUse: ColumnConfig[]) => {
    return ({ index }: { index: number }) => {
      return columnsToUse[index]?.width || 100;
    };
  }, []);

  // 获取表头行高
  const getHeaderRowHeight = useCallback(() => headerHeight, [headerHeight]);

  // 获取数据行高
  const getBodyRowHeight = useCallback(() => rowHeight, [rowHeight]);

  // 垂直滚动同步处理 - 从中间区域同步到固定列
  const handleCenterVerticalScroll = useCallback((params: { scrollTop: number; scrollLeft?: number }) => {
    const { scrollTop, scrollLeft } = params;
    scrollPositionRef.current.scrollTop = scrollTop;
    if (scrollLeft !== undefined) {
      scrollPositionRef.current.scrollLeft = scrollLeft;
    }

    // 同步所有数据Grid的垂直滚动
    if (leftBodyGridRef.current) {
      leftBodyGridRef.current.scrollToPosition({ scrollLeft: 0, scrollTop });
    }
    if (rightBodyGridRef.current) {
      rightBodyGridRef.current.scrollToPosition({ scrollLeft: 0, scrollTop });
    }
  }, []);

  // 垂直滚动同步处理 - 从左侧固定列同步到其他区域
  const handleLeftVerticalScroll = useCallback((params: { scrollTop: number }) => {
    const { scrollTop } = params;
    scrollPositionRef.current.scrollTop = scrollTop;

    // 同步中间和右侧数据Grid的垂直滚动
    if (centerBodyGridRef.current) {
      centerBodyGridRef.current.scrollToPosition({
        scrollLeft: scrollPositionRef.current.scrollLeft,
        scrollTop
      });
    }
    if (rightBodyGridRef.current) {
      rightBodyGridRef.current.scrollToPosition({ scrollLeft: 0, scrollTop });
    }
  }, []);

  // 垂直滚动同步处理 - 从右侧固定列同步到其他区域
  const handleRightVerticalScroll = useCallback((params: { scrollTop: number }) => {
    const { scrollTop } = params;
    scrollPositionRef.current.scrollTop = scrollTop;

    // 同步中间和左侧数据Grid的垂直滚动
    if (centerBodyGridRef.current) {
      centerBodyGridRef.current.scrollToPosition({
        scrollLeft: scrollPositionRef.current.scrollLeft,
        scrollTop
      });
    }
    if (leftBodyGridRef.current) {
      leftBodyGridRef.current.scrollToPosition({ scrollLeft: 0, scrollTop });
    }
  }, []);

  // 水平滚动同步处理 - 从中间区域同步到表头
  const handleCenterHorizontalScroll = useCallback((params: { scrollLeft: number }) => {
    const { scrollLeft } = params;
    scrollPositionRef.current.scrollLeft = scrollLeft;

    // 同步表头的水平滚动
    if (centerHeaderGridRef.current) {
      centerHeaderGridRef.current.scrollToPosition({ scrollLeft, scrollTop: 0 });
    }
  }, []);

  // 水平滚动同步处理 - 从表头同步到数据区域
  const handleHeaderHorizontalScroll = useCallback((params: { scrollLeft: number }) => {
    const { scrollLeft } = params;
    scrollPositionRef.current.scrollLeft = scrollLeft;

    // 同步数据区域的水平滚动
    if (centerBodyGridRef.current) {
      centerBodyGridRef.current.scrollToPosition({ scrollLeft, scrollTop: scrollPositionRef.current.scrollTop });
    }
  }, []);

  useImperativeHandle<VirtualTableRef, VirtualTableRef>(
    ref,
    () => ({
      scrollToRow: (rowIndex: number) => {
        centerBodyGridRef.current?.scrollToCell({ rowIndex, columnIndex: 0 });
        leftBodyGridRef.current?.scrollToCell({ rowIndex, columnIndex: 0 });
        rightBodyGridRef.current?.scrollToCell({ rowIndex, columnIndex: 0 });
      },
      scrollToColumn: (columnIndex: number) => {
        centerBodyGridRef.current?.scrollToCell({ rowIndex: 0, columnIndex });
        centerHeaderGridRef.current?.scrollToCell({ rowIndex: 0, columnIndex });
      },
      recomputeGridSize: () => {
        // 重新计算所有Grid的大小
        leftHeaderGridRef.current?.recomputeGridSize();
        centerHeaderGridRef.current?.recomputeGridSize();
        rightHeaderGridRef.current?.recomputeGridSize();
        leftBodyGridRef.current?.recomputeGridSize();
        centerBodyGridRef.current?.recomputeGridSize();
        rightBodyGridRef.current?.recomputeGridSize();
      },
    }),
    [],
  );

  const dataRowCount = dataSource.length;

  return (
    <div
      className={cn(
        classConfig.containerConfig({ defaultHeight: true }),
        className,
      )}
    >
      <AutoSizer>
        {({ width, height }) => {
          const centerWidth = width - leftWidth - rightWidth;
          const bodyHeight = height - (showHeader ? headerHeight : 0);

          return (
            <div className="relative" style={{ width, height }}>
              {/* 表头区域 */}
              {showHeader && (
                <div
                  className="absolute top-0 left-0 right-0 z-0 bg-gray-50 border-b border-gray-200"
                  style={{ height: headerHeight }}
                >
                  {/* 左固定表头 */}
                  {leftColumnCount > 0 && (
                    <div
                      className="absolute left-0 top-0 z-0"
                      style={{ width: leftWidth, height: headerHeight }}
                    >
                      <Grid
                        ref={leftHeaderGridRef}
                        width={leftWidth}
                        height={headerHeight}
                        columnCount={leftColumnCount}
                        rowCount={1}
                        columnWidth={createColumnWidthGetter(leftFixedColumns)}
                        rowHeight={getHeaderRowHeight}
                        cellRenderer={createHeaderCellRenderer(leftFixedColumns)}
                      />
                    </div>
                  )}

                  {/* 中间表头 */}
                  {centerColumnCount > 0 && (
                    <div
                      className="absolute top-0"
                      style={{
                        left: leftWidth,
                        width: centerWidth,
                        height: headerHeight,
                      }}
                    >
                      <Grid
                        ref={centerHeaderGridRef}
                        width={centerWidth}
                        height={headerHeight}
                        columnCount={centerColumnCount}
                        rowCount={1}
                        columnWidth={createColumnWidthGetter(centerColumns)}
                        rowHeight={getHeaderRowHeight}
                        cellRenderer={createHeaderCellRenderer(centerColumns)}
                        onScroll={handleHeaderHorizontalScroll}
                      />
                    </div>
                  )}

                  {/* 右固定表头 */}
                  {rightColumnCount > 0 && (
                    <div
                      className="absolute right-0 top-0 z-0 border-l border-gray-200"
                      style={{ width: rightWidth, height: headerHeight }}
                    >
                      <Grid
                        ref={rightHeaderGridRef}
                        width={rightWidth}
                        height={headerHeight}
                        columnCount={rightColumnCount}
                        rowCount={1}
                        columnWidth={createColumnWidthGetter(rightFixedColumns)}
                        rowHeight={getHeaderRowHeight}
                        cellRenderer={createHeaderCellRenderer(rightFixedColumns)}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* 数据体区域 */}
              <div
                className="absolute left-0 right-0 bg-white"
                style={{
                  top: showHeader ? headerHeight : 0,
                  height: bodyHeight
                }}
              >
                {/* 左固定数据列 */}
                {leftColumnCount > 0 && (
                  <div
                    className="absolute left-0 top-0 z-0 bg-white"
                    style={{ width: leftWidth, height: bodyHeight }}
                  >
                    <Grid
                      ref={leftBodyGridRef}
                      width={leftWidth}
                      height={bodyHeight}
                      columnCount={leftColumnCount}
                      rowCount={dataRowCount}
                      columnWidth={createColumnWidthGetter(leftFixedColumns)}
                      rowHeight={getBodyRowHeight}
                      cellRenderer={createBodyCellRenderer(leftFixedColumns)}
                      onScroll={handleLeftVerticalScroll}
                    />
                  </div>
                )}

                {/* 中间数据列 */}
                {centerColumnCount > 0 && (
                  <div
                    className="absolute top-0 bg-white"
                    style={{
                      left: leftWidth,
                      width: centerWidth,
                      height: bodyHeight,
                    }}
                  >
                    <Grid
                      ref={centerBodyGridRef}
                      width={centerWidth}
                      height={bodyHeight}
                      columnCount={centerColumnCount}
                      rowCount={dataRowCount}
                      columnWidth={createColumnWidthGetter(centerColumns)}
                      rowHeight={getBodyRowHeight}
                      cellRenderer={createBodyCellRenderer(centerColumns)}
                      onScroll={(params) => {
                        handleCenterVerticalScroll(params);
                        handleCenterHorizontalScroll(params);
                      }}
                    />
                  </div>
                )}

                {/* 右固定数据列 */}
                {rightColumnCount > 0 && (
                  <div
                    className="absolute right-0 top-0 z-0 bg-white border-l border-gray-200"
                    style={{ width: rightWidth, height: bodyHeight }}
                  >
                    <Grid
                      ref={rightBodyGridRef}
                      width={rightWidth}
                      height={bodyHeight}
                      columnCount={rightColumnCount}
                      rowCount={dataRowCount}
                      columnWidth={createColumnWidthGetter(rightFixedColumns)}
                      rowHeight={getBodyRowHeight}
                      cellRenderer={createBodyCellRenderer(rightFixedColumns)}
                      onScroll={handleRightVerticalScroll}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        }}
      </AutoSizer>
    </div>
  );
};

export default VirtualTable;
