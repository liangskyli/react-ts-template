import VirtualTable, { ColumnConfig } from '@/components/core/components/virtual-table/virtual-table.tsx';
import { useState } from 'react';

const VirtualTableDemo = () => {
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
      name: `用户${index} ${index ===1 ? '很长很长很长很长很长': ''}`,
      age: 20 + (index % 50),
      email: `user${index}@example.com`,
      phone: `138${String(index).padStart(8, '0')}`,
      address: `北京市朝阳区某某街道${index}号`,
      status: index % 3 === 0 ? 'active' : 'inactive',
    }));
  };

  const [dataSource] = useState(() => generateData(1000));

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-3xl font-bold text-gray-900">VirtualTable 控件演示</h1>

      <div className="space-y-8">
        {/* 基础表格 */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">基础表格</h2>
          <VirtualTable
            className="h-[400px] border border-gray-200"
            columns={basicColumns}
            dataSource={dataSource.slice(0, 50)}
          />
        </div>
      </div>
      {/*<div className="h-[400px] w-full">
        <VirtualTable
          columns={basicColumns.slice(0, 4)}
          dataSource={dataSource.slice(0, 10)}
        />
      </div>*/}
    </div>
  );
};

export default VirtualTableDemo;
