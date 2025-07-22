import { useState } from 'react';
import type { ColumnConfig } from '@/components/core/components/virtual-table';
import VirtualTable from '@/components/core/components/virtual-table';

type IDataType = {
  name: string;
  age: number;
  email: string;
  phone: string;
  address: string;
  status: string;
};

const VirtualTableDemo = () => {
  // 基础数据
  const basicColumns: ColumnConfig<IDataType>[] = [
    {
      title: '姓名',
      dataIndex: 'name',
      width: 80,
      fixed: 'left',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      width: 80,
      align: 'center',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      width: 200,
    },
    {
      title: '电话',
      dataIndex: 'phone',
      width: 150,
    },
    {
      title: '地址',
      dataIndex: 'address',
      width: 300,
      align: 'left',
      headerAlign: 'left',
      render: (address, _record, index) => {
        return (
          <>
            <div>{address}</div>
            {index % 10 === 5 && (
              <div>
                有股权交易易主的有股权交易易主的有股权交易易主的有股权交易易主的有股权交易易主的有股权交易易主的有股权交易易主的有股权交易易主的11
              </div>
            )}
          </>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      align: 'center',
      render: (status) => (
        <span
          className={`tw-rounded tw-px-2 tw-py-1 tw-text-xs ${
            status === 'active'
              ? 'tw-bg-green-100 tw-text-green-800'
              : 'tw-bg-gray-100 tw-text-gray-800'
          }`}
        >
          {status === 'active' ? '活跃' : '非活跃'}
        </span>
      ),
    },
    {
      title: '操作',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <div className="tw-space-x-2">
          <button
            className="tw-text-blue-600 hover:tw-text-blue-800"
            onClick={(e) => {
              e.stopPropagation();
              console.log('编辑', record);
            }}
          >
            编辑
          </button>
          <button
            className="tw-text-red-600 hover:tw-text-red-800"
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
      name: `用户${index} ${index === 1 ? '很长很长很长很长很长' : ''}`,
      age: 20 + (index % 50),
      email: `user${index}@example.com`,
      phone: `138${String(index).padStart(8, '0')}`,
      address: `北京市朝阳区某某街道${index}号`,
      status: index % 3 === 0 ? 'active' : 'inactive',
    }));
  };

  const [dataSource] = useState(() => generateData(1000));

  return (
    <div className="tw-space-y-8 tw-p-6">
      <h1 className="tw-text-3xl tw-font-bold tw-text-gray-900">
        VirtualTable 控件演示
      </h1>

      <div className="tw-space-y-8">
        {/* 基础表格 */}
        <div>
          <h2 className="tw-mb-4 tw-text-lg tw-font-semibold">基础表格</h2>
          <VirtualTable
            className="tw-h-[400px]"
            columns={basicColumns}
            dataSource={dataSource.slice(0, 50)}
          />
        </div>
      </div>

      {/* 大数据量虚拟滚动 */}
      <div>
        <h2 className="tw-mb-4 tw-text-lg tw-font-semibold">
          大数据量虚拟滚动 (1000条数据)
        </h2>
        <VirtualTable
          columns={basicColumns}
          dataSource={dataSource}
          className="tw-h-[400px]"
        />
      </div>
    </div>
  );
};

export default VirtualTableDemo;
