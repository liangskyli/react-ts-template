import { useState } from 'react';
import { Column, Table as ReactVirtualizedTable } from 'react-virtualized';
import 'react-virtualized/styles.css';

// https://github.com/mckervinc/react-fluid-table
// https://github.com/TanStack/virtual

const TableDemo = () => {

  // 生成测试数据
  const generateData = (count: number) => {
    return Array.from({ length: count }, (_, index) => ({
      key: index,
      name: `用户${index}`,
      age: 20 + (index % 50),
      email: `user${index}@example.com`,
      phone: `138${String(index).padStart(8, '0')}`,
      address: `北京市朝阳区某某街道${index}号`,
      status: index % 3 === 0 ? 'active' : 'inactive',
    }));
  };

  const [dataSource] = useState(() => generateData(1000));

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Table 表格组件演示</h1>
      <div className="space-y-8">
        {/* 基础表格 */}
        <ReactVirtualizedTable
          width={800}
          height={400}
          headerHeight={40}
          rowHeight={50}
          rowCount={dataSource.length}
          rowGetter={({ index }) => dataSource[index]}
        >
          <Column
            width={100}
            minWidth={100}
            label="姓名"
            dataKey="name"
            cellDataGetter={({ rowData }) => rowData.name}
            headerRenderer={() => "姓名"}
            cellRenderer={({ cellData }) => cellData}
          />
          <Column
            width={100}
            label="年龄"
            dataKey="age"
            cellDataGetter={({ rowData }) => rowData.age}
            headerRenderer={() => "年龄"}
            cellRenderer={({ cellData }) => cellData}
          />
          <Column
            width={100}
            maxWidth={100}
            label="邮箱"
            dataKey="email"
            cellDataGetter={({ rowData }) => rowData.email}
            headerRenderer={() => "邮箱"}
            cellRenderer={({ cellData }) => <div>{cellData}</div>}
          />
          <Column
            width={150}
            label="电话"
            dataKey="phone"
            cellDataGetter={({ rowData }) => rowData.phone}
            headerRenderer={() => "电话"}
            cellRenderer={({ cellData }) => cellData}
          />
        </ReactVirtualizedTable>
      </div>
    </div>
  );
};

export default TableDemo;
