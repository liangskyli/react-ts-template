import { useCallback, useRef, useState } from "react";
import { cn } from '@/components/core/class-config';
import RadioGroup from '@/components/core/components/radio';
import type { TreeNode, TreeProps, TreeRef } from '@/components/core/components/tree/tree.tsx';
import Tree from '@/components/core/components/tree/tree.tsx';


export type TreeRadioProps = Omit<TreeProps,'ref'> & {
  /** 是否只有叶子节点可以选择 */
  onlyLeafSelectable?: boolean;
  /** 选中的节点key */
  selectedKey?: string | number | null;
  /** 默认选中的节点key */
  defaultSelectedKey?: string | number;
  /** 节点选择回调 */
  onSelect?: (
    selectedKey: string | number | undefined,
    info: {
      node: TreeNode;
    },
  ) => void;
};

const TreeRadio = (props: TreeRadioProps) => {
  const {
    onlyLeafSelectable,
    selectedKey: controlledSelectedKey,
    defaultSelectedKey,
    onSelect,
    ...treeProps
  } = props;

  const treeRef = useRef<TreeRef>(null);

  // 内部状态管理
  const [internalSelectedKey, setInternalSelectedKey] = useState<
    string | number | undefined
  >(controlledSelectedKey || defaultSelectedKey);

  // 使用受控或非受控状态
  const selectedKey =
    controlledSelectedKey !== undefined
      ? controlledSelectedKey
      : (internalSelectedKey ?? null);

  // 处理单选节点选择
  const handleSingleSelect = useCallback(
    (newSelectedKey: string | number | undefined) => {
      if (controlledSelectedKey === undefined) {
        setInternalSelectedKey(newSelectedKey);
      }

      const flattenNodes = treeRef.current?.getFlattenNodes() || [];
      const selectedNode = flattenNodes.find((n) => n.key === newSelectedKey);
      if (selectedNode) {
        onSelect?.(newSelectedKey, {node: selectedNode});
      }
    },
    [controlledSelectedKey, onSelect],
  );

  const innerRenderNode: TreeProps['renderNode'] = (node) => {
    // 如果节点不可选择或只有叶子节点可选择且当前节点不是叶子节点，则使用默认渲染
    if (node.selectable === false || onlyLeafSelectable && !node.isLeaf) {
      return;
    }
    return (
      <RadioGroup.Radio value={node.key} disabled={node.disabled}>
        {node.title}
      </RadioGroup.Radio>
    );
  };

  return (
    <RadioGroup
      value={selectedKey}
      onChange={handleSingleSelect}
      className={cn('block')}
    >
      <Tree {...treeProps} ref={treeRef} renderNode={innerRenderNode}/>
    </RadioGroup>
  );
};

export default TreeRadio;
