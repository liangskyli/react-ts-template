import React, { forwardRef } from 'react';
import type {
  ColumnConfig,
  VirtualTableProps,
  VirtualTableRef,
} from '@/components/core/components/table/virtual-table.tsx';
import VirtualTable from '@/components/core/components/table/virtual-table.tsx';

export type { ColumnConfig, VirtualTableRef };

export type TableProps = VirtualTableProps;

export type TableRef = VirtualTableRef;

/**
 * Table 表格组件
 * 
 * 基于 react-virtualized 实现的高性能表格组件，支持：
 * - 虚拟滚动，适用于大数据量场景
 * - 列固定（左侧/右侧固定）
 * - 自定义列渲染
 * - 行选择功能
 * - 响应式布局
 */
const Table = forwardRef<TableRef, TableProps>((props, ref) => {
  return <VirtualTable {...props} ref={ref} />;
});

Table.displayName = 'Table';

export default Table;
