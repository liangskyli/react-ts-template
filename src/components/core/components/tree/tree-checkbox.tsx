import { memo, useCallback, useEffect, useRef, useState } from 'react';
import Checkbox from '@/components/core/components/checkbox';
import type {
  FlattenNode,
  NodesData,
  TreeProps,
  TreeRef,
} from '@/components/core/components/tree/tree.tsx';
import Tree from '@/components/core/components/tree/tree.tsx';

type TreeExtendedProps = {
  /** 是否可选择 */
  selectable?: boolean;
};

export type TreeCheckboxProps<K extends string | number = string> = TreeProps<
  K,
  TreeExtendedProps
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
      /** 选中的节点keys，包括半选状态的节点 */
      allEffectivelySelectedKeys: K[];
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
    ref,
    ...treeProps
  } = props;

  type NodesData = Parameters<Required<TreeCheckboxProps<K>>['renderNode']>[1];

  const treeRef = useRef<TreeRef<K, TreeExtendedProps>>(null);

  // 合并外部传入的ref和内部的ref
  const mergedRef = (node: TreeRef<K, TreeExtendedProps>) => {
    treeRef.current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };

  // 内部状态管理
  const [internalSelectedKeys, setInternalSelectedKeys] = useState<K[]>(
    controlledSelectedKeys || defaultSelectedKeys,
  );

  // 使用受控或非受控状态
  const selectedKeys = controlledSelectedKeys || internalSelectedKeys;

  // 使用 Map 作为缓存
  const stateCache = useRef(
    new Map<string, { checked: boolean; indeterminate: boolean }>(),
  );

  // 在treeData更新时清除缓存
  useEffect(() => {
    stateCache.current.clear();
  }, [treeProps.treeData]);

  // 计算半选状态
  const getCheckState = useCallback(
    (nodeKey: K, checkedKeys: K[], nodeMap: NodesData['nodeMap']) => {
      // 非严格模式下checkedKeys 存在半选数据
      const nodeKeyChecked = checkedKeys.includes(nodeKey);

      if (checkStrictly) {
        return {
          checked: nodeKeyChecked,
          indeterminate: false,
        };
      }

      // 获取子节点keys
      const childrenKeys = nodeMap.childrenMap.get(nodeKey) || [];
      // 获取后代节点keys
      const descendantMapKeys = nodeMap.descendantMap.get(nodeKey) || [];
      // 如果是叶子节点
      if (childrenKeys.length === 0) {
        return {
          checked: nodeKeyChecked,
          indeterminate: false,
        };
      }

      // 优化缓存键生成 - 获取当前节点和后代节点中的选中项
      const relevantKeys = new Set([nodeKey, ...descendantMapKeys]);
      const relevantCheckedKeys = checkedKeys.filter((key) =>
        relevantKeys.has(key),
      );
      const cacheKey = `${nodeKey}-${relevantCheckedKeys.sort().join(',')}`;
      const cachedState = stateCache.current.get(cacheKey);
      if (cachedState) {
        return cachedState;
      }

      // 对于非叶子节点，需要递归检查子节点状态
      // 计算子节点的状态，但要排除禁用的子节点
      let checkedChildrenCount = 0;
      let indeterminateChildrenCount = 0;
      let enabledChildrenCount = 0;
      let disabledChildrenCount = 0;

      // 使用 for...of 替代 forEach，性能更好
      for (const childKey of childrenKeys) {
        const childNode = nodeMap.nodeMap.get(childKey);
        if (
          childNode &&
          (childNode.disabled || childNode.selectable === false)
        ) {
          if (childNode.selectable !== false && childNode.disabled) {
            disabledChildrenCount++;
          }
          // 跳过禁用的子节点和不可选择的子节点
          continue;
        }

        enabledChildrenCount++;
        const childState = getCheckState(childKey, checkedKeys, nodeMap);
        if (childState.checked) {
          checkedChildrenCount++;
        } else if (childState.indeterminate) {
          indeterminateChildrenCount++;
        }
      }

      // 根据子节点状态确定父节点状态
      let result;
      if (checkedChildrenCount === 0 && indeterminateChildrenCount === 0) {
        // 没有任何可用子节点被选中或半选
        result = {
          checked: nodeKeyChecked,
          indeterminate: false,
        };
      } else if (
        enabledChildrenCount > 0 &&
        checkedChildrenCount === enabledChildrenCount
      ) {
        // 所有可用子节点都被选中，但如果存在禁用子节点，则显示半选状态
        if (disabledChildrenCount > 0) {
          // 存在禁用的子节点，显示半选状态
          result = {
            checked: false,
            indeterminate: true,
          };
        } else {
          // 所有子节点都可用且都被选中
          result = {
            checked: true,
            indeterminate: false,
          };
        }
      } else {
        // 部分子节点被选中或有半选状态
        result = {
          checked: false,
          indeterminate: true,
        };
      }

      // 缓存结果
      stateCache.current.set(cacheKey, result);
      return result;
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
      const { allFlattenNodeMap } = nodesData;
      if (checkStrictly) {
        return checked
          ? [...currentKeys, targetKey]
          : currentKeys.filter((key) => key !== targetKey);
      }

      const newKeys = new Set(currentKeys);
      const targetNode = allFlattenNodeMap.get(targetKey)!;

      // 使用Set进行批量处理
      const nodesToProcess = new Set<K>();

      if (checked) {
        // 选中节点：选中自己和所有后代

        let hasDisabledDescendantNode = false;
        // 一次性收集所有需要处理的后代节点（排除禁用的节点和不可选择的节点）
        for (const descendantKey of targetNode.allDescendantKeys) {
          const descendantNode = allFlattenNodeMap.get(descendantKey);
          if (descendantNode) {
            if (descendantNode.selectable !== false) {
              if (descendantNode.disabled) {
                hasDisabledDescendantNode = true;
              } else {
                nodesToProcess.add(descendantKey);
              }
            }
          }
        }

        if (!hasDisabledDescendantNode) {
          nodesToProcess.add(targetKey);
        }

        // 批量添加节点的选中状态
        for (const key of nodesToProcess) {
          newKeys.add(key);
        }

        // 检查父节点是否应该被选中（当所有兄弟节点都被选中时）
        let currentParent = targetNode.parentKey;
        while (currentParent) {
          const parentNode = allFlattenNodeMap.get(currentParent)!;

          const siblingsChecked = parentNode.childrenKeys.filter(
            (siblingKey) => {
              const siblingNode = allFlattenNodeMap.get(siblingKey);
              return siblingNode && siblingNode.selectable !== false;
            },
          );

          const allSiblingsChecked = siblingsChecked.every((siblingKey) =>
            newKeys.has(siblingKey),
          );
          if (allSiblingsChecked) {
            newKeys.add(currentParent);
            currentParent = parentNode.parentKey;
          } else {
            break;
          }
        }
      } else {
        // 取消选中：取消自己和所有后代
        nodesToProcess.add(targetKey);
        for (const key of targetNode.allDescendantKeys) {
          nodesToProcess.add(key);
        }

        // 添加所有祖先节点
        let currentParent = targetNode.parentKey;
        while (currentParent) {
          nodesToProcess.add(currentParent);
          const parentNode = allFlattenNodeMap.get(currentParent);
          currentParent = parentNode?.parentKey;
        }

        // 批量删除节点的选中状态
        for (const key of nodesToProcess) {
          newKeys.delete(key);
        }
      }

      return Array.from(newKeys);
    },
    [checkStrictly],
  );

  const checkedKeys = useRef<K[]>([]);
  const halfCheckedKeys = useRef<K[]>([]);

  // 处理多选节点选择
  const handleMultipleSelect = useCallback(
    (newSelectedKeys: K[], targetKey: K) => {
      const nodeMap = treeRef.current!.getNodeMap();
      const allFlattenNodeMap = treeRef.current!.getAllFlattenNodeMap();

      // 计算所有实际选中的节点（包括因为父子联动而选中的节点）
      const leafKeys: K[] = [];
      const nonLeafKeys: K[] = [];
      const newHalfCheckedKeys = new Set([...halfCheckedKeys.current]);

      // 创建一个Set用于存储需要处理的节点
      const nodesToProcess = new Set<K>();

      // 获取节点的所有祖先节点
      const getAncestors = (nodeKey: K): K[] => {
        const ancestors: K[] = [];
        let currentFlatNode = allFlattenNodeMap.get(nodeKey);
        while (currentFlatNode && currentFlatNode.parentKey) {
          const parentKey = currentFlatNode.parentKey;
          ancestors.push(parentKey);
          currentFlatNode = allFlattenNodeMap.get(parentKey);
        }
        return ancestors;
      };

      // 添加需要处理的节点
      const addNodesToProcess = (nodeKey: K) => {
        // 添加当前节点
        nodesToProcess.add(nodeKey);

        // 添加所有祖先节点
        const ancestors = getAncestors(nodeKey);
        ancestors.forEach((ancestor) => nodesToProcess.add(ancestor));

        // 添加所有子孙节点
        const currentFlatNode = allFlattenNodeMap.get(nodeKey);
        if (currentFlatNode && currentFlatNode.allDescendantKeys) {
          for (const descendant of currentFlatNode.allDescendantKeys) {
            nodesToProcess.add(descendant);
          }
        }
      };

      // 处理新选中的节点
      addNodesToProcess(targetKey);

      // 只处理需要处理的节点
      for (const nodeKey of nodesToProcess) {
        const node = nodeMap.nodeMap.get(nodeKey)!;

        // 跳过不可选择的节点
        const isLeaf = !node.children || node.children.length === 0;
        if (node.selectable === false || (onlyLeafSelectable && !isLeaf)) {
          continue;
        }

        const { indeterminate } = getCheckState(
          nodeKey,
          newSelectedKeys,
          nodeMap,
        );

        if (indeterminate) {
          newHalfCheckedKeys.add(nodeKey);
        } else {
          newHalfCheckedKeys.delete(nodeKey);
        }
      }
      // newSelectedKeys 去掉半选状态的数据,getUpdatedKeysWithCascade方法对后代数据没有处理
      const newSelectedKeysNoHalfChecked = newSelectedKeys.filter(
        (key) => !newHalfCheckedKeys.has(key),
      );

      // 检查是否超过最大选择数量
      if (
        maxSelectCount > 0 &&
        newSelectedKeysNoHalfChecked.length > maxSelectCount
      ) {
        onMaxSelectReached?.(maxSelectCount);
        return;
      }
      checkedKeys.current = [...newSelectedKeysNoHalfChecked];
      halfCheckedKeys.current = Array.from(newHalfCheckedKeys);

      const allEffectivelySelectedKeys: K[] = [
        ...checkedKeys.current,
        ...halfCheckedKeys.current,
      ];
      for (const key of allEffectivelySelectedKeys) {
        const node = nodeMap.nodeMap.get(key);
        if (!node) continue;
        const isLeaf = !node.children || node.children.length === 0;
        if (isLeaf) {
          leafKeys.push(key);
        } else {
          nonLeafKeys.push(key);
        }
      }

      if (!controlledSelectedKeys) {
        setInternalSelectedKeys([...checkedKeys.current]);
      }

      onSelect?.([...checkedKeys.current], {
        allEffectivelySelectedKeys,
        checkedKeys: [...checkedKeys.current],
        halfCheckedKeys: [...halfCheckedKeys.current],
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
    if (treeProps.renderNode) {
      // 自定义渲染
      return treeProps.renderNode(node, nodesData);
    }
    // 如果节点不可选择或只有叶子节点可选择且当前节点不是叶子节点，则使用默认渲染
    if (node.selectable === false || (onlyLeafSelectable && !node.isLeaf)) {
      return;
    }

    return (
      <MemoizedTreeCheckbox<K>
        node={node}
        nodesData={nodesData}
        selectedKeys={selectedKeys}
        maxSelectCount={maxSelectCount}
        getCheckState={getCheckState}
        getUpdatedKeysWithCascade={getUpdatedKeysWithCascade}
        handleMultipleSelect={handleMultipleSelect}
      />
    );
  };

  return (
    <Tree
      {...treeProps}
      ref={mergedRef}
      renderNode={innerRenderNode}
      className={className}
    />
  );
};

type MemoizedTreeCheckboxProps<K extends string | number> = {
  node: FlattenNode<K, TreeExtendedProps>;
  nodesData: NodesData<K, TreeExtendedProps>;
  selectedKeys: K[];
  maxSelectCount: number;
  getCheckState: (
    nodeKey: K,
    checkedKeys: K[],
    nodeMap: NodesData<K, TreeExtendedProps>['nodeMap'],
  ) => { checked: boolean; indeterminate: boolean };
  getUpdatedKeysWithCascade: (
    targetKey: K,
    checked: boolean,
    currentKeys: K[],
    nodesData: NodesData<K, TreeExtendedProps>,
  ) => K[];
  handleMultipleSelect: (newSelectedKeys: K[], targetKey: K) => void;
};

function TreeCheckboxComponent<K extends string | number>(
  props: MemoizedTreeCheckboxProps<K>,
) {
  const {
    node,
    nodesData,
    selectedKeys,
    maxSelectCount,
    getCheckState,
    getUpdatedKeysWithCascade,
    handleMultipleSelect,
  } = props;
  const { nodeMap } = nodesData;

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
    nodesData.nodeMap,
  );

  const handleChange = useCallback(
    (newChecked: boolean) => {
      // 如果节点被禁用，handleChange不会触发,不用处理

      // 处理半选状态的点击逻辑
      if (indeterminate) {
        // 半选状态点击时的逻辑：
        // 1. 如果存在禁用的子节点，点击后应该取消所有可选子节点的选中状态
        // 2. 如果不存在禁用的子节点，点击后选中所有子节点(selectable false要排除）
        const childrenKeys = nodeMap.childrenMap.get(node.key)!;
        const hasDisabledChildren = childrenKeys.some((childKey: K) => {
          const childNode = nodeMap.nodeMap.get(childKey);
          return (
            childNode && childNode.selectable !== false && childNode.disabled
          );
        });

        if (hasDisabledChildren) {
          // 存在禁用子节点，取消所有可选子节点的选中状态
          const newKeys = getUpdatedKeysWithCascade(
            node.key,
            false,
            selectedKeys,
            nodesData,
          );
          handleMultipleSelect(newKeys, node.key);
        } else {
          // 不存在禁用子节点，选中所有子节点
          const newKeys = getUpdatedKeysWithCascade(
            node.key,
            true,
            selectedKeys,
            nodesData,
          );
          handleMultipleSelect(newKeys, node.key);
        }
      } else {
        // 正常的选中/取消选中逻辑
        const newKeys = getUpdatedKeysWithCascade(
          node.key,
          newChecked,
          selectedKeys,
          nodesData,
        );
        handleMultipleSelect(newKeys, node.key);
      }
    },
    [
      indeterminate,
      nodeMap.childrenMap,
      nodeMap.nodeMap,
      node.key,
      getUpdatedKeysWithCascade,
      selectedKeys,
      nodesData,
      handleMultipleSelect,
    ],
  );

  return (
    <Checkbox
      value={node.key}
      disabled={isNodeDisabled}
      checked={checked}
      indeterminate={indeterminate}
      onChange={handleChange}
    >
      {node.title}
    </Checkbox>
  );
}

const MemoizedTreeCheckbox = memo(TreeCheckboxComponent) as <
  K extends string | number,
>(
  props: MemoizedTreeCheckboxProps<K>,
) => React.ReactElement;

export default TreeCheckbox;
