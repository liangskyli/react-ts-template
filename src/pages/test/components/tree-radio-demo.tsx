import { useMemo, useState } from 'react';
import Tree from '@/components/core/components/tree';
import type { TreeNode } from '@/components/core/components/tree';

const TreeRadioDemo = () => {
  // 基础树形数据
  const basicTreeData: TreeNode[] = useMemo(
    () => [
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
            disabled: true,
          },
          {
            key: '2-3',
            title: '子节点2-3',
            selectable: false,
          },
        ],
      },
      {
        key: '3',
        title: '叶子节点3',
        selectable: false,
      },
      {
        key: '4',
        title: '父节点4',
        selectable: false,
        children: [
          {
            key: '4-1',
            title: '子节点4-1',
          },
          {
            key: '4-2',
            title: '子节点4-2',
          },
        ],
      },
    ],
    [],
  );

  // 大量数据生成函数
  const generateLargeTreeData = (level = 0, parentKey = ''): TreeNode[] => {
    if (level > 2) return [];

    return Array.from({ length: 50 }, (_, index) => {
      const key = parentKey ? `${parentKey}-${index}` : `${index}`;
      return {
        key,
        title: `节点 ${key}`,
        children: level < 2 ? generateLargeTreeData(level + 1, key) : undefined,
      };
    });
  };

  const largeTreeData = useMemo(
    () => generateLargeTreeData(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // 受控模式状态
  const [expandedKeys, setExpandedKeys] = useState<string[]>(['1']);
  const [selectedKey, setSelectedKey] = useState<string | undefined | null>(
    '1-1',
  );
  const [virtualScrollSelectedKey, setVirtualScrollSelectedKey] = useState<
    string | undefined | null
  >('');

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-3xl font-bold text-gray-900">
        Tree radio 树形控件演示
      </h1>

      {/* 基础用法 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">基础用法</h2>
        <div className="rounded-lg border bg-white p-6">
          <Tree.Radio
            treeData={basicTreeData}
            defaultExpandedKeys={['1', '2']}
            defaultSelectedKey={'1-1'}
            allowDeselect={true}
            onSelect={(selectedKey, info) => {
              console.log('选中的节点:', selectedKey, info);
            }}
          />
        </div>
      </section>

      {/* 只有叶子节点可选择 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          只有叶子节点可选择
        </h2>
        <div className="rounded-lg border bg-white p-6">
          <Tree.Radio
            treeData={basicTreeData}
            onlyLeafSelectable={true}
            defaultExpandedKeys={['1', '1-2', '2']}
            onSelect={(selectedKey, info) => {
              console.log('只有叶子节点可选择:', selectedKey, info);
            }}
          />
          <p className="mt-4 text-sm text-gray-600">
            <strong>功能说明：</strong>
            只有叶子节点可以选择
          </p>
        </div>
      </section>

      {/* 受控模式 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">受控模式</h2>
        <div className="rounded-lg border bg-white p-6">
          <div className="mb-4 space-y-2">
            <p className="text-sm">
              <strong>展开的节点:</strong> {expandedKeys.join(', ') || '无'}
            </p>
            <p className="text-sm">
              <strong>选中的key:</strong> {selectedKey || '无'}
            </p>
            <div className="space-x-2">
              <button
                className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
                onClick={() => setExpandedKeys(['1', '2', '4'])}
              >
                展开1, 2, 4
              </button>
              <button
                className="rounded bg-gray-500 px-3 py-1 text-sm text-white hover:bg-gray-600"
                onClick={() => setExpandedKeys([])}
              >
                收起所有
              </button>
            </div>
          </div>
          <Tree.Radio
            treeData={basicTreeData}
            expandedKeys={expandedKeys}
            onExpand={(keys) => setExpandedKeys(keys)}
            selectedKey={selectedKey}
            onSelect={(key) => setSelectedKey(key)}
          />
        </div>
      </section>

      {/* 虚拟滚动 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          虚拟滚动（大量数据）
        </h2>
        <div className="rounded-lg border bg-white p-6">
          <p className="mb-2 text-sm text-gray-600">
            包含 {largeTreeData.length} 个根节点，每个根节点有 50
            个子节点，每个子节点又有 50 个子节点
          </p>
          <p className="mb-4 text-sm">
            <strong>选中的key:</strong> {virtualScrollSelectedKey || '无'}
          </p>
          <Tree.Radio
            treeData={largeTreeData}
            virtualScroll
            className="rounded-md border border-gray-200"
            selectedKey={virtualScrollSelectedKey}
            onSelect={(key) => setVirtualScrollSelectedKey(key)}
          />
        </div>
      </section>
    </div>
  );
};

export default TreeRadioDemo;
