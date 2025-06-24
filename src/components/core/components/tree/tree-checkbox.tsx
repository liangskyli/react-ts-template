import { useCallback, useRef, useState } from 'react';
import Checkbox from '@/components/core/components/checkbox';
import type {
  TreeNode,
  TreeProps,
  TreeRef,
} from '@/components/core/components/tree/tree.tsx';
import Tree from '@/components/core/components/tree/tree.tsx';

type TreeExtendedProps = {
  /** 是否可选择 */
  selectable?: boolean;
};

export type TreeCheckboxProps<K extends string | number = string> = Omit<
  TreeProps<K, TreeExtendedProps>,
  'ref'
> & {
  /** 是否启用严格模式，即禁用父子节点联动 */
  checkStrictly?: boolean;
  /** 是否只有叶子节点可以选择 */
  onlyLeafSelectable?: boolean;
  /** 最大选择数量，0表示不限制 */
  maxSelectCount?: number;
  /** 完全选中的节点keys */
  selectedKeys?: K[];
  /** 默认完全选中的节点key */
  defaultSelectedKeys?: K[];
  /** 节点选择回调 */
  onSelect?: (
    /** 所有完全选中的节点keys，不包括半选状态的节点 */
    selectedKeys: K[],
    info: {
      /** 选中的节点对象，包括半选状态的节点 */
      selectedNodes: TreeNode<K, TreeExtendedProps>[];
      /** 完全选中的节点keys */
      checkedKeys: K[];
      /** 半选状态的节点keys */
      halfCheckedKeys: K[];
      /** 叶子节点keys */
      leafKeys: K[];
      /** 非叶子节点keys */
      nonLeafKeys: K[];
    },
  ) => void;
  /** 多选达到上限时的回调 */
  onMaxSelectReached?: (maxCount: number) => void;
};

const TreeCheckbox = <K extends string | number = string>(
  props: TreeCheckboxProps<K>,
) => {
  const {
    onlyLeafSelectable,
    selectedKeys: controlledSelectedKeys,
    maxSelectCount = 0,
    defaultSelectedKeys = [],
    checkStrictly = false,
    onSelect,
    onMaxSelectReached,
    className,
    ...treeProps
  } = props;

  type NodesData = Parameters<Required<TreeCheckboxProps<K>>['renderNode']>[1];

  const treeRef = useRef<TreeRef<K, TreeExtendedProps>>(null);

  // 内部状态管理
  const [internalSelectedKeys, setInternalSelectedKeys] = useState<K[]>(
    controlledSelectedKeys || defaultSelectedKeys,
  );

  // 使用受控或非受控状态
  const selectedKeys = controlledSelectedKeys || internalSelectedKeys;

  // 计算半选状态 - 基于完整树结构而不是扁平化节点
  const getCheckState = useCallback(
    (nodeKey: K, checkedKeys: K[], nodesData: NodesData) => {
      const { nodeMap } = nodesData;
      const nodeKeyChecked = checkedKeys.includes(nodeKey);
      if (checkStrictly) {
        return {
          checked: nodeKeyChecked,
          indeterminate: false,
        };
      }

      // 从完整的节点映射中查找节点，而不是从flattenNodes
      const node = nodeMap.nodeMap.get(nodeKey);
      if (!node) {
        return {
          checked: nodeKeyChecked,
          indeterminate: false,
        };
      }

      // 获取子节点keys
      const childrenKeys = nodeMap.childrenMap.get(nodeKey) || [];
      // 如果是叶子节点，检查是否有效选中（包括父节点选中的情况）
      if (childrenKeys.length === 0) {
        return {
          checked: nodeKeyChecked,
          indeterminate: false,
        };
      }

      // 对于非叶子节点，需要递归检查子节点状态
      // 计算子节点的状态，但要排除禁用的子节点
      let checkedChildrenCount = 0;
      let indeterminateChildrenCount = 0;
      let enabledChildrenCount = 0;

      childrenKeys.forEach((childKey) => {
        const childNode = nodeMap.nodeMap.get(childKey);
        if (
          childNode &&
          (childNode.disabled || childNode.selectable === false)
        ) {
          // 跳过禁用的子节点和不可选择的子节点
          return;
        }

        enabledChildrenCount++;
        const childState = getCheckState(childKey, checkedKeys, nodesData);
        if (childState.checked) {
          checkedChildrenCount++;
        } else if (childState.indeterminate) {
          indeterminateChildrenCount++;
        }
      });

      // 根据子节点状态确定父节点状态
      if (checkedChildrenCount === 0 && indeterminateChildrenCount === 0) {
        // 没有任何可用子节点被选中或半选，检查自身是否被选中
        return {
          checked: nodeKeyChecked,
          indeterminate: false,
        };
      } else if (
        enabledChildrenCount > 0 &&
        checkedChildrenCount === enabledChildrenCount
      ) {
        // 所有可用子节点都被选中，但如果总子节点数大于可用子节点数（存在禁用子节点），则显示半选状态
        const totalChildrenCount = childrenKeys.length;
        if (totalChildrenCount > enabledChildrenCount) {
          // 存在禁用的子节点，显示半选状态
          return {
            checked: false,
            indeterminate: true,
          };
        } else {
          // 所有子节点都可用且都被选中
          return {
            checked: true,
            indeterminate: false,
          };
        }
      } else {
        // 部分子节点被选中或有半选状态
        return {
          checked: false,
          indeterminate: true,
        };
      }
    },
    [checkStrictly],
  );

  // 处理父子节点联动选择
  const getUpdatedKeysWithCascade = useCallback(
    (
      targetKey: K,
      checked: boolean,
      currentKeys: K[],
      nodesData: NodesData,
    ): K[] => {
      const { allFlattenNodes } = nodesData;
      if (checkStrictly) {
        return checked
          ? [...currentKeys, targetKey]
          : currentKeys.filter((key) => key !== targetKey);
      }

      let newKeys = [...currentKeys];
      const targetNode = allFlattenNodes.find((n) => n.key === targetKey);

      if (!targetNode) return newKeys;

      if (checked) {
        // 选中节点：选中自己和所有后代
        if (!newKeys.includes(targetKey)) {
          newKeys.push(targetKey);
        }

        // 选中所有后代节点（排除禁用的节点和不可选择的节点）
        targetNode.allDescendantKeys.forEach((descendantKey) => {
          const descendantNode = allFlattenNodes.find(
            (n) => n.key === descendantKey,
          );
          if (
            descendantNode &&
            !descendantNode.disabled &&
            descendantNode.selectable !== false &&
            !newKeys.includes(descendantKey)
          ) {
            newKeys.push(descendantKey);
          }
        });

        // 检查父节点是否应该被选中（当所有兄弟节点都被选中时）
        if (targetNode.parentKey) {
          const parentNode = allFlattenNodes.find(
            (n) => n.key === targetNode.parentKey,
          );
          if (parentNode) {
            const enabledSiblings = parentNode.childrenKeys.filter(
              (siblingKey) => {
                const siblingNode = allFlattenNodes.find(
                  (n) => n.key === siblingKey,
                );
                return (
                  siblingNode &&
                  !siblingNode.disabled &&
                  siblingNode.selectable !== false
                );
              },
            );
            const allEnabledSiblingsChecked = enabledSiblings.every(
              (siblingKey) => newKeys.includes(siblingKey),
            );
            if (
              allEnabledSiblingsChecked &&
              !newKeys.includes(targetNode.parentKey)
            ) {
              // 递归选中父节点
              newKeys = getUpdatedKeysWithCascade(
                targetNode.parentKey,
                true,
                newKeys,
                nodesData,
              );
            }
          }
        }
      } else {
        // 取消选中：取消自己和所有后代
        newKeys = newKeys.filter(
          (key) =>
            key !== targetKey && !targetNode.allDescendantKeys.includes(key),
        );

        // 取消所有祖先节点的选中状态
        let currentParent = targetNode.parentKey;
        while (currentParent) {
          newKeys = newKeys.filter((key) => key !== currentParent);
          const parentNode = allFlattenNodes.find(
            (n) => n.key === currentParent,
          );
          currentParent = parentNode?.parentKey;
        }
      }

      return [...new Set(newKeys)]; // 去重
    },
    [checkStrictly],
  );

  // 处理多选节点选择
  const handleMultipleSelect = useCallback(
    (newSelectedKeys: K[]) => {
      console.log('newSelectedKeys:',newSelectedKeys)
      // 计算所有实际选中的节点（包括因为父子联动而选中的节点）
      const allEffectivelySelectedKeys: K[] = [];
      const checkedKeys: K[] = [];
      const halfCheckedKeys: K[] = [];
      const leafKeys: K[] = [];
      const nonLeafKeys: K[] = [];

      const nodeMap = treeRef.current!.getNodeMap();
      const flattenNodes = treeRef.current!.getFlattenNodes();
      const allFlattenNodes = treeRef.current!.getAllFlattenNodes();
      // 遍历所有节点（包括未展开的节点）
      const now1 = +new Date();
      nodeMap.nodeMap.forEach((node, nodeKey) => {
        // 跳过不可选择的节点
        const isLeaf = !node.children || node.children.length === 0;
        if (node.selectable === false || (onlyLeafSelectable && !isLeaf)) {
          return;
        }

        const { checked, indeterminate } = getCheckState(
          nodeKey,
          newSelectedKeys,
          { nodeMap, flattenNodes, allFlattenNodes },
        );

        if (checked) {
          checkedKeys.push(nodeKey);
          allEffectivelySelectedKeys.push(nodeKey);
        } else if (indeterminate) {
          halfCheckedKeys.push(nodeKey);
          allEffectivelySelectedKeys.push(nodeKey);
        }

        // 区分叶子节点和非叶子节点（基于所有实际选中的节点）
        if (checked || indeterminate) {
          const childrenKeys = nodeMap.childrenMap.get(nodeKey) || [];
          if (childrenKeys.length === 0) {
            // 叶子节点
            leafKeys.push(nodeKey);
          } else {
            // 非叶子节点
            nonLeafKeys.push(nodeKey);
          }
        }
      });
      const now2 = +new Date();
      console.log('nodeMap.nodeMap耗时:', now2 - now1);

      // 检查是否超过最大选择数量（基于所有实际选中的节点）
      if (
        maxSelectCount > 0 &&
        checkedKeys.length > maxSelectCount
      ) {
        onMaxSelectReached?.(maxSelectCount);
        return;
      }

      if (!controlledSelectedKeys) {
        setInternalSelectedKeys(checkedKeys);
      }

      // 获取选中的节点信息（基于所有实际选中的节点，排除不可选择的节点）
      const selectedNodes = flattenNodes.filter(
        (n) =>
          allEffectivelySelectedKeys.includes(n.key) && n.selectable !== false,
      );

      // 返回所有实际选中的节点作为selectedKeys
      onSelect?.(checkedKeys, {
        selectedNodes,
        checkedKeys,
        halfCheckedKeys,
        leafKeys,
        nonLeafKeys,
      });
    },
    [
      maxSelectCount,
      controlledSelectedKeys,
      onSelect,
      onlyLeafSelectable,
      getCheckState,
      onMaxSelectReached,
    ],
  );

  const innerRenderNode: TreeCheckboxProps<K>['renderNode'] = (
    node,
    nodesData,
  ) => {
    const { nodeMap } = nodesData;
    // 如果节点不可选择或只有叶子节点可选择且当前节点不是叶子节点，则使用默认渲染
    if (node.selectable === false || (onlyLeafSelectable && !node.isLeaf)) {
      return;
    }
    // 计算节点是否应该显示为disabled状态
    const isNodeDisabled =
      node.disabled ||
      (maxSelectCount > 0 &&
        selectedKeys.length >= maxSelectCount &&
        !selectedKeys.includes(node.key));
    // 计算选中和半选状态
    const { checked, indeterminate } = getCheckState(
      node.key,
      selectedKeys,
      nodesData,
    );

    return (
      <Checkbox
        value={node.key}
        disabled={isNodeDisabled}
        checked={checked}
        indeterminate={indeterminate}
        onChange={(newChecked) => {
          console.log('begin:')
          const now1 = +new Date();
          // 如果节点被禁用，不处理点击
          if (isNodeDisabled) return;

          // 处理半选状态的点击逻辑
          if (indeterminate) {
            // 半选状态点击时的逻辑：
            // 1. 如果存在禁用的子节点，点击后应该取消所有可选子节点的选中状态
            // 2. 如果不存在禁用的子节点，点击后选中所有子节点
            const childrenKeys = nodeMap.childrenMap.get(node.key) || [];
            const hasDisabledChildren = childrenKeys.some((childKey) => {
              const childNode = nodeMap.nodeMap.get(childKey);
              return childNode && childNode.disabled;
            });

            if (hasDisabledChildren) {
              // 存在禁用子节点，取消所有可选子节点的选中状态
              const newKeys = getUpdatedKeysWithCascade(
                node.key,
                false,
                selectedKeys,
                nodesData,
              );
              handleMultipleSelect(newKeys);
            } else {
              // 不存在禁用子节点，选中所有子节点
              const newKeys = getUpdatedKeysWithCascade(
                node.key,
                true,
                selectedKeys,
                nodesData,
              );
              handleMultipleSelect(newKeys);
            }
          } else {
            // 正常的选中/取消选中逻辑
            const newKeys = getUpdatedKeysWithCascade(
              node.key,
              newChecked,
              selectedKeys,
              nodesData,
            );
            handleMultipleSelect(newKeys);
          }
          const now2 = +new Date();
          console.log('耗时:', now2 - now1,indeterminate);
        }}
      >
        {node.title}
      </Checkbox>
    );
  };

  return (
    <Tree
      {...treeProps}
      ref={treeRef}
      renderNode={innerRenderNode}
      className={className}
    />
  );
};

export default TreeCheckbox;
