import { useState } from 'react';
import Table from '@/components/core/components/table';
import type { ColumnConfig } from '@/components/core/components/table';
import GridExample from '@/pages/test/table/grid-example.tsx';

const TableDemo = () => {
  // 基础数据
  const basicColumns: ColumnConfig[] = [
    {
      key: 'name',
      title: '姓名',
      dataIndex: 'name',
      width: 80,
      fixed: 'left',
    },
    {
      key: 'age',
      title: '年龄',
      dataIndex: 'age',
      width: 80,
      align: 'center',
    },
    {
      key: 'email',
      title: '邮箱',
      dataIndex: 'email',
      width: 200,
    },
    {
      key: 'phone',
      title: '电话',
      dataIndex: 'phone',
      width: 150,
    },
    {
      key: 'address',
      title: '地址',
      dataIndex: 'address',
      width: 300,
    },
    {
      key: 'status',
      title: '状态',
      dataIndex: 'status',
      width: 100,
      align: 'center',
      render: (status: any) => (
        <span
          className={`rounded px-2 py-1 text-xs ${
            status === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {status === 'active' ? '活跃' : '非活跃'}
        </span>
      ),
    },
    {
      key: 'action',
      title: '操作',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <div className="space-x-2">
          <button
            className="text-blue-600 hover:text-blue-800"
            onClick={(e) => {
              e.stopPropagation();
              console.log('编辑', record);
            }}
          >
            编辑
          </button>
          <button
            className="text-red-600 hover:text-red-800"
            onClick={(e) => {
              e.stopPropagation();
              console.log('删除', record);
            }}
          >
            删除
          </button>
        </div>
      ),
    },
  ];

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
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>(
    [],
  );

  const rowSelection = {
    selectedRowKeys,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange: (selectedRowKeys: (string | number)[], selectedRows: any[]) => {
      setSelectedRowKeys(selectedRowKeys);
      console.log('选中的行:', selectedRows);
    },
  };

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Table 表格组件演示</h1>
      <GridExample />
      <div className="space-y-8">
        {/* 基础表格 */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">基础表格</h2>
          <Table
            columns={basicColumns.slice(0, 4)}
            dataSource={dataSource.slice(0, 10)}
            className="h-[400px]"
            onRowClick={(record, index) => {
              console.log('点击行:', record, index);
            }}
          />
        </div>

        {/* 固定列表格 */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">固定列表格</h2>
          <Table
            columns={basicColumns}
            dataSource={dataSource.slice(0, 20)}
            className="h-[400px]"
            onRowClick={(record, index) => {
              console.log('点击行:', record, index);
            }}
          />
        </div>

        {/* 大数据量虚拟滚动 */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">
            大数据量虚拟滚动 (1000条数据)
          </h2>
          <Table
            columns={basicColumns}
            dataSource={dataSource}
            className="h-[500px]"
            rowSelection={rowSelection}
            onRowClick={(record, index) => {
              console.log('点击行:', record, index);
            }}
            onRowDoubleClick={(record, index) => {
              console.log('双击行:', record, index);
            }}
          />
          <div className="mt-2 text-sm text-gray-600">
            已选中 {selectedRowKeys.length} 行
          </div>
        </div>

        {/* 自定义渲染 */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">自定义渲染</h2>
          <Table
            columns={[
              {
                key: 'avatar',
                title: '头像',
                width: 80,
                render: (_, record) => (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm text-white">
                    {record.name.slice(-1)}
                  </div>
                ),
              },
              ...basicColumns.slice(0, 3),
              {
                key: 'tags',
                title: '标签',
                width: 150,
                render: (_, record) => (
                  <div className="flex flex-wrap gap-1">
                    <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-800">
                      用户
                    </span>
                    {record.age > 30 && (
                      <span className="rounded bg-orange-100 px-2 py-0.5 text-xs text-orange-800">
                        资深
                      </span>
                    )}
                  </div>
                ),
              },
            ]}
            dataSource={dataSource.slice(0, 15)}
            className="h-[400px]"
          />
        </div>
      </div>
    </div>
  );
};

export default TableDemo;
