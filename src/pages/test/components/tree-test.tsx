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
              <div className="mt-2 text-sm text-gray-600">
                <p><strong>测试说明：</strong></p>
                <p>• 选中子节点后，父节点会显示半选状态（横线图标）</p>
                <p>• 点击半选状态的父节点会选中所有子节点</p>
                <p>• 即使收起节点，半选状态仍然正确显示</p>
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
        <h2 className="text-xl font-semibold text-gray-800">缩起状态下的半选功能测试</h2>
        <div className="rounded-lg border bg-white p-6">
          <div className="mb-4">
            <p className="text-sm">
              <strong>当前选中:</strong> {selectedKeys.join(', ') || '无'}
            </p>
            <div className="mt-2 space-x-2">
              <button
                className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
                onClick={() => setSelectedKeys(['1-2-1'])}
              >
                选中深层子节点1-2-1
              </button>
              <button
                className="rounded bg-green-500 px-3 py-1 text-sm text-white hover:bg-green-600"
                onClick={() => setSelectedKeys(['2-1', '2-2'])}
              >
                选中父节点2的所有子节点
              </button>
              <button
                className="rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
                onClick={() => setSelectedKeys([])}
              >
                清空选择
              </button>
            </div>
          </div>

          <Tree
            treeData={testTreeData}
            multiple
            selectedKeys={selectedKeys}
            expandedKeys={[]} // 所有节点都收起
            onMultipleSelect={(keys, info) => {
              console.log('缩起状态选择:', keys);
              console.log('半选状态的节点:', info.halfCheckedKeys);
              setSelectedKeys(keys);
            }}
          />
          <p className="mt-4 text-sm text-gray-600">
            <strong>关键测试：</strong>所有节点都收起，但半选状态仍然正确显示。
            选中深层子节点后，所有祖先节点都会显示半选状态。
          </p>
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
        <h2 className="text-xl font-semibold text-gray-800">只有叶子节点可选择</h2>
        <div className="rounded-lg border bg-white p-6">
          <Tree
            treeData={testTreeData}
            multiple
            onlyLeafSelectable={true}
            defaultExpandedKeys={['1', '1-2', '2']}
            onMultipleSelect={(keys, info) => {
              console.log('只有叶子节点可选择:', keys, info);
            }}
          />
          <p className="mt-4 text-sm text-gray-600">
            <strong>功能说明：</strong>只有叶子节点可以选择，父节点不显示checkbox/radiobox，样式不置灰。
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">子节点存在禁用的，父节点选择后显示半选状态</h2>
        <div className="rounded-lg border bg-white p-6">
          <Tree
            treeData={[
              {
                key: '1',
                title: '父节点1',
                children: [
                  { key: '1-1', title: '正常子节点1-1' },
                  { key: '1-2', title: '禁用子节点1-2', disabled: true },
                  { key: '1-3', title: '正常子节点1-3' },
                ],
              },
              {
                key: '2',
                title: '父节点2',
                children: [
                  { key: '2-1', title: '正常子节点2-1' },
                  { key: '2-2', title: '禁用子节点2-2', disabled: true },
                ],
              },
            ]}
            multiple
            defaultExpandedKeys={['1', '2']}
            onMultipleSelect={(keys, info) => {
              console.log('子节点存在禁用的选择:', keys, info);
            }}
          />
          <p className="mt-4 text-sm text-gray-600">
            <strong>功能说明：</strong>当子节点中存在禁用的节点时，选择父节点后会显示半选状态，因为禁用的子节点不会被选中。
            <br />
            <strong>交互说明：</strong>点击半选状态的父节点会取消所有可选子节点的选中状态，再次点击会重新选中所有可选子节点。
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">禁用子节点不会被自动选中</h2>
        <div className="rounded-lg border bg-white p-6">
          <Tree
            treeData={[
              {
                key: '1',
                title: '父节点1',
                children: [
                  { key: '1-1', title: '正常子节点1-1' },
                  { key: '1-2', title: '禁用子节点1-2', disabled: true },
                  { key: '1-3', title: '正常子节点1-3' },
                ],
              },
            ]}
            multiple
            defaultExpandedKeys={['1']}
            onMultipleSelect={(keys, info) => {
              console.log('禁用子节点不会被自动选中:', keys, info);
            }}
          />
          <p className="mt-4 text-sm text-gray-600">
            <strong>功能说明：</strong>选择父节点时，只有正常的子节点会被选中，禁用的子节点不会被自动选中。
            禁用的子节点也不会因为父节点选中而显示为选中状态。
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">onMultipleSelect回调增强</h2>
        <div className="rounded-lg border bg-white p-6">
          <Tree
            treeData={testTreeData}
            multiple
            defaultExpandedKeys={['1', '1-2', '2']}
            onMultipleSelect={(selectedKeys, info) => {
              console.log('=== onMultipleSelect 回调信息 ===');
              console.log('selectedKeys (总选中):', selectedKeys);
              console.log('checkedKeys (完全选中):', info.checkedKeys);
              console.log('halfCheckedKeys (半选状态):', info.halfCheckedKeys);
              console.log('leafKeys (叶子节点):', info.leafKeys);
              console.log('nonLeafKeys (非叶子节点):', info.nonLeafKeys);
              console.log('selectedNodes (节点对象):', info.selectedNodes);
            }}
          />
          <p className="mt-4 text-sm text-gray-600">
            <strong>功能说明：</strong>onMultipleSelect回调现在提供了更详细的信息，包括叶子节点和非叶子节点的区分。
            <br />
            <strong>数据一致性：</strong>selectedKeys = checkedKeys + halfCheckedKeys，selectedKeys = leafKeys + nonLeafKeys。
            <br />
            打开控制台查看详细信息。
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">selectable: false 节点测试</h2>
        <div className="rounded-lg border bg-white p-6">
          <Tree
            treeData={[
              {
                key: '1',
                title: '父节点1',
                children: [
                  { key: '1-1', title: '正常子节点1-1' },
                  { key: '1-2', title: '不可选择子节点1-2', selectable: false },
                  { key: '1-3', title: '正常子节点1-3' },
                ],
              },
              {
                key: '2',
                title: '不可选择父节点2',
                selectable: false,
                children: [
                  { key: '2-1', title: '正常子节点2-1' },
                  { key: '2-2', title: '正常子节点2-2' },
                ],
              },
            ]}
            multiple
            defaultExpandedKeys={['1', '2']}
            onMultipleSelect={(keys, info) => {
              console.log('selectable: false 节点测试:', keys, info);
            }}
          />
          <p className="mt-4 text-sm text-gray-600">
            <strong>功能说明：</strong>设置了 selectable: false 的节点不会显示选择组件（checkbox/radiobox），
            也不会参与父子联动选择，更不会出现在回调数据中。
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">虚拟滚动多选测试</h2>
        <div className="rounded-lg border bg-white p-6">
          <Tree
            treeData={Array.from({ length: 1000 }, (_, i) => ({
              key: `node-${i}`,
              title: `节点 ${i + 1}`,
              children: i % 10 === 0 ? [
                { key: `node-${i}-1`, title: `子节点 ${i + 1}-1` },
                { key: `node-${i}-2`, title: `子节点 ${i + 1}-2` },
              ] : undefined,
            }))}
            multiple
            virtualScroll
            style={{ height: 300 }}
            defaultExpandedKeys={['node-0', 'node-10', 'node-20']}
            onMultipleSelect={(keys, info) => {
              console.log('虚拟滚动多选:', keys.length, '个节点选中');
              console.log('详细信息:', info);
            }}
          />
          <p className="mt-4 text-sm text-gray-600">
            <strong>功能说明：</strong>虚拟滚动模式下的多选功能现在可以正常工作。
            这里有1000个节点，每10个节点有一个父节点。
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">多选上限限制</h2>
        <div className="rounded-lg border bg-white p-6">
          <Tree
            treeData={testTreeData}
            multiple
            maxSelectCount={3}
            defaultExpandedKeys={['1', '1-2', '2']}
            onMultipleSelect={(keys, info) => {
              console.log('多选上限限制:', keys, info);
            }}
            onMaxSelectReached={(maxCount) => {
              alert(`最多只能选择 ${maxCount} 个节点！`);
            }}
          />
          <p className="mt-4 text-sm text-gray-600">
            <strong>功能说明：</strong>最多只能选择3个节点，超过限制时会弹出提示。
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">父节点选中子节点自动显示选中</h2>
        <div className="rounded-lg border bg-white p-6">
          <div className="mb-4">
            <p className="text-sm">
              <strong>当前选中:</strong> {selectedKeys.join(', ') || '无'}
            </p>
            <div className="mt-2 space-x-2">
              <button
                className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
                onClick={() => setSelectedKeys(['1'])}
              >
                只选中父节点1
              </button>
              <button
                className="rounded bg-green-500 px-3 py-1 text-sm text-white hover:bg-green-600"
                onClick={() => setSelectedKeys(['1-2'])}
              >
                只选中父节点1-2
              </button>
              <button
                className="rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
                onClick={() => setSelectedKeys([])}
              >
                清空选择
              </button>
            </div>
          </div>

          <Tree
            treeData={testTreeData}
            multiple
            selectedKeys={selectedKeys}
            defaultExpandedKeys={['1', '1-2', '2']}
            onMultipleSelect={(keys, info) => {
              console.log('父节点选中子节点自动显示选中:', keys, info);
              setSelectedKeys(keys);
            }}
          />
          <p className="mt-4 text-sm text-gray-600">
            <strong>功能说明：</strong>当父节点被选中时，所有子节点会自动显示为选中状态，即使子节点的key不在selectedKeys中。
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
