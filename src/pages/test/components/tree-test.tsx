import { useState } from 'react';
import Tree from '@/components/core/components/tree';
import type { TreeNode } from '@/components/core/components/tree';

const TreeTest = () => {
  const testTreeData: TreeNode[] = [
    {
      key: '1',
      title: '父节点1',
      children: [
        {
          key: '1-1',
          title: '子节点1-1',
        },
        {
          key: '1-2',
          title: '子节点1-2',
          children: [
            {
              key: '1-2-1',
              title: '子节点1-2-1',
            },
            {
              key: '1-2-2',
              title: '子节点1-2-2',
            },
          ],
        },
      ],
    },
    {
      key: '2',
      title: '父节点2',
      children: [
        {
          key: '2-1',
          title: '子节点2-1',
        },
        {
          key: '2-2',
          title: '子节点2-2',
        },
      ],
    },
  ];

  const [selectedKeys, setSelectedKeys] = useState<(string | number)[]>([]);

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-3xl font-bold text-gray-900">Tree 半选状态测试</h1>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">测试半选状态</h2>
        <div className="rounded-lg border bg-white p-6">
          <div className="mb-4">
            <p className="text-sm">
              <strong>选中的节点:</strong> {selectedKeys.join(', ') || '无'}
            </p>
            <div className="mt-2 space-x-2 space-y-2">
              <div className="space-x-2">
                <button
                  className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
                  onClick={() => setSelectedKeys(['1-1'])}
                >
                  只选中1-1（父节点应该半选）
                </button>
                <button
                  className="rounded bg-green-500 px-3 py-1 text-sm text-white hover:bg-green-600"
                  onClick={() => setSelectedKeys(['1-2-1'])}
                >
                  只选中1-2-1（父节点和祖父节点都应该半选）
                </button>
                <button
                  className="rounded bg-purple-500 px-3 py-1 text-sm text-white hover:bg-purple-600"
                  onClick={() => setSelectedKeys(['1-1', '1-2-1', '1-2-2'])}
                >
                  选中1-1和1-2的所有子节点（父节点应该半选）
                </button>
              </div>
              <div className="space-x-2">
                <button
                  className="rounded bg-indigo-500 px-3 py-1 text-sm text-white hover:bg-indigo-600"
                  onClick={() =>
                    setSelectedKeys(['1-1', '1-2', '1-2-1', '1-2-2'])
                  }
                >
                  选中所有子节点（父节点应该全选）
                </button>
                <button
                  className="rounded bg-yellow-500 px-3 py-1 text-sm text-white hover:bg-yellow-600"
                  onClick={() => setSelectedKeys(['2-1'])}
                >
                  只选中2-1（父节点2应该半选）
                </button>
                <button
                  className="rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
                  onClick={() => setSelectedKeys([])}
                >
                  清空选择
                </button>
              </div>
            </div>
          </div>

          <Tree
            treeData={testTreeData}
            multiple
            selectedKeys={selectedKeys}
            defaultExpandedKeys={['1', '1-2', '2']}
            onMultipleSelect={(keys, info) => {
              console.log('选中的节点:', keys);
              console.log('完全选中的节点:', info.checkedKeys);
              console.log('半选状态的节点:', info.halfCheckedKeys);
              setSelectedKeys(keys);
            }}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">严格模式测试</h2>
        <div className="rounded-lg border bg-white p-6">
          <Tree
            treeData={testTreeData}
            multiple
            checkStrictly={true}
            defaultExpandedKeys={['1', '1-2', '2']}
            defaultSelectedKeys={['1-1', '2-1']}
            onMultipleSelect={(keys, info) => {
              console.log('严格模式选择:', keys, info);
            }}
          />
          <p className="mt-4 text-sm text-gray-600">
            严格模式下，父子节点选择互不影响，不会有半选状态
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">虚拟滚动测试</h2>
        <div className="rounded-lg border bg-white p-6">
          <Tree
            treeData={Array.from({ length: 100 }, (_, i) => ({
              key: `node-${i}`,
              title: `节点 ${i}`,
              children: Array.from({ length: 10 }, (_, j) => ({
                key: `node-${i}-${j}`,
                title: `子节点 ${i}-${j}`,
              })),
            }))}
            multiple
            virtualScroll
            className="h-[300px] rounded-md border border-gray-200"
            onMultipleSelect={(keys) => {
              console.log('虚拟滚动选择:', keys.length, '个节点');
            }}
          />
          <p className="mt-4 text-sm text-gray-600">
            虚拟滚动模式，100个父节点，每个有10个子节点
          </p>
        </div>
      </section>
    </div>
  );
};

export default TreeTest;
