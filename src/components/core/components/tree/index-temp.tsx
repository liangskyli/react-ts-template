import React, { useCallback, useMemo, useRef, useState } from 'react';
import { cn } from '@/components/core/class-config';
import Checkbox from '@/components/core/components/checkbox';
import type { ListProps, ListRef } from '@/components/core/components/list';
import List from '@/components/core/components/list';
import RadioGroup from '@/components/core/components/radio';
import classConfig from '@/components/core/components/tree/class-config.ts';
import {
  DefaultCollapseIcon,
  DefaultExpandIcon,
} from '@/components/core/components/tree/icons.tsx';

export interface TreeNode {
  /** 节点的唯一标识 */
  key: string | number;
  /** 节点标题 */
  title: React.ReactNode;
  /** 子节点 */
  children?: TreeNode[];
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否可选择 */
  selectable?: boolean;
  /** 是否默认展开 */
  defaultExpanded?: boolean;
}

interface FlattenNode extends TreeNode {
  level: number;
  parentKey?: string | number;
  isLeaf: boolean;
  childrenKeys: (string | number)[];
  allDescendantKeys: (string | number)[];
}

export type TreeRef = ListRef;

export type TreeProps = {
  /** 树形数据 */
  treeData: TreeNode[];
  /** 是否支持多选 */
  multiple?: boolean;
  /** 是否可选择 */
  selectable?: boolean;
  /** 是否启用严格模式，即禁用父子节点联动（仅多选模式有效） */
  checkStrictly?: boolean;
  /** 是否只有叶子节点可以选择 */
  onlyLeafSelectable?: boolean;
  /** 多选模式下的最大选择数量，0表示不限制 */
  maxSelectCount?: number;
  /** 选中的节点key（单选模式） */
  selectedKey?: string | number;
  /** 选中的节点keys（多选模式） */
  selectedKeys?: (string | number)[];
  /** 展开的节点key */
  expandedKeys?: (string | number)[];
  /** 默认展开的节点key */
  defaultExpandedKeys?: (string | number)[];
  /** 默认选中的节点key（单选模式） */
  defaultSelectedKey?: string | number;
  /** 默认选中的节点key（多选模式） */
  defaultSelectedKeys?: (string | number)[];
  /** 是否显示展开/收起图标，不显示图标时节点默认展开 */
  showIcon?: boolean;
  /** 自定义展开图标 */
  expandIcon?: React.ReactNode;
  /** 自定义收起图标 */
  collapseIcon?: React.ReactNode;
  /** 节点选择回调（单选模式） */
  onSelect?: (
    selectedKey: string | number | undefined,
    info: {
      node: TreeNode;
    },
  ) => void;
  /** 节点选择回调（多选模式） */
  onMultipleSelect?: (
    /** 所有选中的节点keys，包括半选状态的父节点 */
    selectedKeys: (string | number)[],
    info: {
      /** 选中的节点对象 */
      selectedNodes: TreeNode[];
      /** 完全选中的节点keys */
      checkedKeys: (string | number)[];
      /** 半选状态的节点keys */
      halfCheckedKeys: (string | number)[];
      /** 叶子节点keys */
      leafKeys: (string | number)[];
      /** 非叶子节点keys */
      nonLeafKeys: (string | number)[];
    },
  ) => void;
  /** 多选达到上限时的回调 */
  onMaxSelectReached?: (maxCount: number) => void;
  /** 展开/收起回调 */
  onExpand?: (
    expandedKeys: (string | number)[],
    info: {
      expanded: boolean;
      node: TreeNode;
    },
  ) => void;
  /** 自定义类名 */
  className?: string;
} & Pick<ListProps, 'virtualScroll' | 'infiniteScroll' | 'getPositionCache'>;

const Tree = (props: TreeProps) => {
  const {
    treeData,
    multiple = false,
    selectable = true,
    checkStrictly = false,
    onlyLeafSelectable = false,
    maxSelectCount = 0,
    selectedKey: controlledSelectedKey,
    selectedKeys: controlledSelectedKeys,
    expandedKeys: controlledExpandedKeys,
    defaultExpandedKeys = [],
    defaultSelectedKey,
    defaultSelectedKeys = [],
    showIcon = true,
    expandIcon = <DefaultExpandIcon />,
    collapseIcon = <DefaultCollapseIcon />,
    onSelect,
    onMultipleSelect,
    onMaxSelectReached,
    onExpand,
    className,
    virtualScroll = false,
    infiniteScroll,
    getPositionCache,
  } = props;

  // 创建内部ref
  const listRef = useRef<ListRef>(null);

  // 内部状态管理
  const [internalSelectedKey, setInternalSelectedKey] = useState<
    string | number | undefined
  >(controlledSelectedKey || defaultSelectedKey);
  const [internalSelectedKeys, setInternalSelectedKeys] = useState<
    (string | number)[]
  >(controlledSelectedKeys || defaultSelectedKeys);
  const [internalExpandedKeys, setInternalExpandedKeys] = useState<
    (string | number)[]
  >(controlledExpandedKeys || defaultExpandedKeys);

  // 使用受控或非受控状态
  const selectedKey =
    controlledSelectedKey !== undefined
      ? controlledSelectedKey
      : internalSelectedKey;
  const selectedKeys = controlledSelectedKeys || internalSelectedKeys;
  const expandedKeys = controlledExpandedKeys || internalExpandedKeys;

  // 构建节点关系映射
  const nodeMap = useMemo(() => {
    const map = new Map<string | number, TreeNode>();
    const childrenMap = new Map<string | number, (string | number)[]>();
    const descendantMap = new Map<string | number, (string | number)[]>();

    const buildMap = (nodes: TreeNode[], parentKey?: string | number) => {
      nodes.forEach((node) => {
        map.set(node.key, node);

        if (parentKey) {
          const siblings = childrenMap.get(parentKey) || [];
          siblings.push(node.key);
          childrenMap.set(parentKey, siblings);
        }

        if (node.children) {
          buildMap(node.children, node.key);

          // 收集所有后代节点
          const descendants: (string | number)[] = [];
          const collectDescendants = (children: TreeNode[]) => {
            children.forEach((child) => {
              descendants.push(child.key);
              if (child.children) {
                collectDescendants(child.children);
              }
            });
          };
          collectDescendants(node.children);
          descendantMap.set(node.key, descendants);
        }
      });
    };

    buildMap(treeData);
    return { nodeMap: map, childrenMap, descendantMap };
  }, [treeData]);

  // 扁平化树形数据
  const flattenNodes = useMemo(() => {
    const flatten = (
      nodes: TreeNode[],
      level = 0,
      parentKey?: string | number,
    ): FlattenNode[] => {
      const result: FlattenNode[] = [];

      nodes.forEach((node) => {
        const childrenKeys = nodeMap.childrenMap.get(node.key) || [];
        const allDescendantKeys = nodeMap.descendantMap.get(node.key) || [];

        const flatNode: FlattenNode = {
          ...node,
          level,
          parentKey,
          isLeaf: !node.children || node.children.length === 0,
          childrenKeys,
          allDescendantKeys,
        };

        result.push(flatNode);

        // 如果节点展开且有子节点，递归处理子节点
        if (expandedKeys.includes(node.key) && node.children) {
          result.push(...flatten(node.children, level + 1, node.key));
        }
      });

      return result;
    };

    return flatten(treeData);
  }, [treeData, expandedKeys, nodeMap]);

  // 处理单选节点选择
  const handleSingleSelect = useCallback(
    (newSelectedKey: string | number | undefined) => {
      if (controlledSelectedKey === undefined) {
        setInternalSelectedKey(newSelectedKey);
      }

      const selectedNode = flattenNodes.find((n) => n.key === newSelectedKey);
      if (selectedNode) {
        onSelect?.(newSelectedKey, { node: selectedNode });
      }
    },
    [controlledSelectedKey, flattenNodes, onSelect],
  );

  // 检查节点是否应该显示为选中状态（包括父节点选中时子节点自动选中的情况）
  const isNodeEffectivelySelected = useCallback(
    (nodeKey: string | number, checkedKeys: (string | number)[]): boolean => {
      // 如果节点本身被选中
      if (checkedKeys.includes(nodeKey)) {
        return true;
      }

      // 如果启用了严格模式，不考虑父子联动
      if (checkStrictly) {
        return false;
      }

      // 检查节点是否被禁用或不可选择，这些节点不会因为父节点选中而显示为选中
      const node = nodeMap.nodeMap.get(nodeKey);
      if (node && (node.disabled || node.selectable === false)) {
        return false;
      }

      // 检查是否有祖先节点被选中
      // 从nodeMap中查找父节点关系
      const findParentKey = (
        key: string | number,
      ): string | number | undefined => {
        for (const [parentKey, children] of nodeMap.childrenMap.entries()) {
          if (children.includes(key)) {
            return parentKey;
          }
        }
        return undefined;
      };

      // 向上查找祖先节点
      let currentKey = nodeKey;
      while (currentKey) {
        const parentKey = findParentKey(currentKey);
        if (!parentKey) break;

        // 如果父节点被选中，则当前节点也应该显示为选中
        if (checkedKeys.includes(parentKey)) {
          return true;
        }
        currentKey = parentKey;
      }

      return false;
    },
    [checkStrictly, nodeMap],
  );

  // 计算半选状态 - 基于完整树结构而不是扁平化节点
  const getCheckState = useCallback(
    (nodeKey: string | number, checkedKeys: (string | number)[]) => {
      if (checkStrictly) {
        return {
          checked: checkedKeys.includes(nodeKey),
          indeterminate: false,
        };
      }

      // 从完整的节点映射中查找节点，而不是从flattenNodes
      const node = nodeMap.nodeMap.get(nodeKey);
      if (!node) {
        return {
          checked: checkedKeys.includes(nodeKey),
          indeterminate: false,
        };
      }

      // 获取子节点keys
      const childrenKeys = nodeMap.childrenMap.get(nodeKey) || [];

      // 如果是叶子节点，检查是否有效选中（包括父节点选中的情况）
      if (childrenKeys.length === 0) {
        return {
          checked: isNodeEffectivelySelected(nodeKey, checkedKeys),
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
        const childState = getCheckState(childKey, checkedKeys);
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
          checked: checkedKeys.includes(nodeKey),
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
    [checkStrictly, nodeMap, isNodeEffectivelySelected],
  );

  // 处理父子节点联动选择
  const getUpdatedKeysWithCascade = useCallback(
    (
      targetKey: string | number,
      checked: boolean,
      currentKeys: (string | number)[],
    ): (string | number)[] => {
      if (checkStrictly) {
        return checked
          ? [...currentKeys, targetKey]
          : currentKeys.filter((key) => key !== targetKey);
      }

      let newKeys = [...currentKeys];
      const targetNode = flattenNodes.find((n) => n.key === targetKey);

      if (!targetNode) return newKeys;

      if (checked) {
        // 选中节点：选中自己和所有后代
        if (!newKeys.includes(targetKey)) {
          newKeys.push(targetKey);
        }

        // 选中所有后代节点（排除禁用的节点和不可选择的节点）
        targetNode.allDescendantKeys.forEach((descendantKey) => {
          const descendantNode = flattenNodes.find(
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
          const parentNode = flattenNodes.find(
            (n) => n.key === targetNode.parentKey,
          );
          if (parentNode) {
            const enabledSiblings = parentNode.childrenKeys.filter(
              (siblingKey) => {
                const siblingNode = flattenNodes.find(
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
              );
            }
          }
        }
      } else {
        // 取消选中：需要特殊处理父子联动的情况

        // 检查当前节点是否是因为父节点选中而显示为选中的
        const isEffectivelySelectedByParent =
          isNodeEffectivelySelected(targetKey, currentKeys) &&
          !currentKeys.includes(targetKey);

        if (isEffectivelySelectedByParent) {
          // 如果是因为父节点选中而显示选中的，需要将父节点改为半选状态
          // 这意味着要取消父节点的选中，但保持其他兄弟节点的选中状态
          let currentParent = targetNode.parentKey;
          while (currentParent) {
            if (newKeys.includes(currentParent)) {
              // 取消父节点的选中
              newKeys = newKeys.filter((key) => key !== currentParent);

              // 添加其他兄弟节点到选中列表（除了当前取消的节点）
              const parentNode = flattenNodes.find(
                (n) => n.key === currentParent,
              );
              if (parentNode) {
                parentNode.allDescendantKeys.forEach((descendantKey) => {
                  const descendantNode = flattenNodes.find(
                    (n) => n.key === descendantKey,
                  );
                  if (
                    descendantNode &&
                    !descendantNode.disabled &&
                    descendantNode.selectable !== false &&
                    descendantKey !== targetKey &&
                    !newKeys.includes(descendantKey)
                  ) {
                    newKeys.push(descendantKey);
                  }
                });
              }
              break;
            }
            const parentNode = flattenNodes.find(
              (n) => n.key === currentParent,
            );
            currentParent = parentNode?.parentKey;
          }
        } else {
          // 正常的取消选中：取消自己和所有后代
          newKeys = newKeys.filter(
            (key) =>
              key !== targetKey && !targetNode.allDescendantKeys.includes(key),
          );

          // 取消所有祖先节点的选中状态
          let currentParent = targetNode.parentKey;
          while (currentParent) {
            newKeys = newKeys.filter((key) => key !== currentParent);
            const parentNode = flattenNodes.find(
              (n) => n.key === currentParent,
            );
            currentParent = parentNode?.parentKey;
          }
        }
      }

      return [...new Set(newKeys)]; // 去重
    },
    [checkStrictly, flattenNodes, isNodeEffectivelySelected],
  );

  // 处理多选节点选择
  const handleMultipleSelect = useCallback(
    (newSelectedKeys: (string | number)[]) => {
      // 计算所有实际选中的节点（包括因为父子联动而选中的节点）
      const allEffectivelySelectedKeys: (string | number)[] = [];
      const checkedKeys: (string | number)[] = [];
      const halfCheckedKeys: (string | number)[] = [];
      const leafKeys: (string | number)[] = [];
      const nonLeafKeys: (string | number)[] = [];

      // 遍历所有节点（包括未展开的节点）
      nodeMap.nodeMap.forEach((node, nodeKey) => {
        // 跳过不可选择的节点
        if (node.selectable === false) {
          return;
        }

        const { checked, indeterminate } = getCheckState(
          nodeKey,
          newSelectedKeys,
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

      // 检查是否超过最大选择数量（基于所有实际选中的节点）
      if (
        maxSelectCount > 0 &&
        allEffectivelySelectedKeys.length > maxSelectCount
      ) {
        onMaxSelectReached?.(maxSelectCount);
        return;
      }

      if (!controlledSelectedKeys) {
        setInternalSelectedKeys(newSelectedKeys);
      }

      // 获取选中的节点信息（基于所有实际选中的节点，排除不可选择的节点）
      const selectedNodes = flattenNodes.filter(
        (n) =>
          allEffectivelySelectedKeys.includes(n.key) && n.selectable !== false,
      );

      // 返回所有实际选中的节点作为selectedKeys
      onMultipleSelect?.(allEffectivelySelectedKeys, {
        selectedNodes,
        checkedKeys,
        halfCheckedKeys,
        leafKeys,
        nonLeafKeys,
      });
    },
    [
      maxSelectCount,
      onMaxSelectReached,
      controlledSelectedKeys,
      flattenNodes,
      nodeMap.nodeMap,
      nodeMap.childrenMap,
      onMultipleSelect,
      getCheckState,
    ],
  );

  // 处理展开/收起
  const handleNodeExpand = useCallback(
    (node: FlattenNode) => {
      if (node.isLeaf) return;

      const isExpanded = expandedKeys.includes(node.key);
      let newExpandedKeys: (string | number)[];

      if (isExpanded) {
        newExpandedKeys = expandedKeys.filter((key) => key !== node.key);
      } else {
        newExpandedKeys = [...expandedKeys, node.key];
      }

      if (!controlledExpandedKeys) {
        setInternalExpandedKeys(newExpandedKeys);
      }

      onExpand?.(newExpandedKeys, {
        expanded: !isExpanded,
        node,
      });
    },
    [expandedKeys, controlledExpandedKeys, onExpand],
  );

  // 渲染节点
  const renderNode = useCallback(
    (node: FlattenNode) => {
      const isExpanded = expandedKeys.includes(node.key);
      const canExpand = !node.isLeaf;

      // 计算节点是否可选择（暂时保留变量以备将来使用）
      // let nodeSelectable = selectable && node.selectable !== false && !node.disabled;

      // 如果设置了只有叶子节点可选择，则非叶子节点不可选择
      // if (onlyLeafSelectable && !node.isLeaf) {
      //   nodeSelectable = false;
      // }

      // 计算节点是否应该显示为disabled状态
      const isNodeDisabled =
        node.disabled ||
        node.selectable === false ||
        (onlyLeafSelectable && !node.isLeaf) ||
        (maxSelectCount > 0 &&
          selectedKeys.length >= maxSelectCount &&
          !selectedKeys.includes(node.key));

      // 计算选中和半选状态
      const { checked, indeterminate } = multiple
        ? getCheckState(node.key, selectedKeys)
        : { checked: false, indeterminate: false };

      return (
        <div
          key={node.key}
          className={cn(classConfig.nodeConfig)}
          data-disabled={node.disabled}
        >
          {/* 缩进 */}
          <div
            className={classConfig.nodeContentConfig.indent}
            style={{ width: `${node.level * 24}px` }}
          />

          {/* 展开/收起图标 */}
          {showIcon && (
            <div
              className={classConfig.nodeContentConfig.switcher}
              onClick={() => handleNodeExpand(node)}
              data-testid={
                canExpand
                  ? isExpanded
                    ? 'collapse-icon'
                    : 'expand-icon'
                  : 'leaf-icon'
              }
            >
              {canExpand ? (isExpanded ? collapseIcon : expandIcon) : null}
            </div>
          )}

          {/* 节点内容 */}
          <div className={classConfig.nodeContentConfig.wrap}>
            {selectable &&
            node.selectable !== false &&
            (!onlyLeafSelectable || node.isLeaf) ? (
              multiple ? (
                <Checkbox
                  value={node.key}
                  disabled={isNodeDisabled}
                  checked={checked}
                  indeterminate={indeterminate}
                  onChange={(newChecked) => {
                    // 如果节点被禁用，不处理点击
                    if (isNodeDisabled) return;

                    // 处理半选状态的点击逻辑
                    if (indeterminate) {
                      // 半选状态点击时的逻辑：
                      // 1. 如果存在禁用的子节点，点击后应该取消所有可选子节点的选中状态
                      // 2. 如果不存在禁用的子节点，点击后选中所有子节点
                      const childrenKeys =
                        nodeMap.childrenMap.get(node.key) || [];
                      const hasDisabledChildren = childrenKeys.some(
                        (childKey) => {
                          const childNode = nodeMap.nodeMap.get(childKey);
                          return (
                            childNode &&
                            (childNode.disabled ||
                              childNode.selectable === false)
                          );
                        },
                      );

                      if (hasDisabledChildren) {
                        // 存在禁用子节点，取消所有可选子节点的选中状态
                        const newKeys = getUpdatedKeysWithCascade(
                          node.key,
                          false,
                          selectedKeys,
                        );
                        handleMultipleSelect(newKeys);
                      } else {
                        // 不存在禁用子节点，选中所有子节点
                        const newKeys = getUpdatedKeysWithCascade(
                          node.key,
                          true,
                          selectedKeys,
                        );
                        handleMultipleSelect(newKeys);
                      }
                    } else {
                      // 正常的选中/取消选中逻辑
                      const newKeys = getUpdatedKeysWithCascade(
                        node.key,
                        newChecked,
                        selectedKeys,
                      );
                      handleMultipleSelect(newKeys);
                    }
                  }}
                >
                  {node.title}
                </Checkbox>
              ) : (
                <RadioGroup.Radio value={node.key} disabled={isNodeDisabled}>
                  {node.title}
                </RadioGroup.Radio>
              )
            ) : (
              <div className={classConfig.nodeContentConfig.title}>
                {node.title}
              </div>
            )}
          </div>
        </div>
      );
    },
    [
      expandedKeys,
      onlyLeafSelectable,
      maxSelectCount,
      selectedKeys,
      multiple,
      getCheckState,
      showIcon,
      collapseIcon,
      expandIcon,
      selectable,
      handleNodeExpand,
      nodeMap.childrenMap,
      nodeMap.nodeMap,
      getUpdatedKeysWithCascade,
      handleMultipleSelect,
    ],
  );

  const listContent = (
    <List
      ref={listRef}
      className={cn(
        /*classConfig.treeConfig({
          virtualScroll: Boolean(virtualScroll),
          infiniteScroll: Boolean(infiniteScroll),
        }),*/
        className,
      )}
      virtualScroll={virtualScroll}
      infiniteScroll={infiniteScroll}
      getPositionCache={getPositionCache}
      list={flattenNodes}
    >
      {(nodes) => nodes.map(renderNode)}
    </List>
  );

  if (!selectable) {
    return listContent;
  }

  if (multiple) {
    // 多选模式使用Checkbox.Group包装，但不使用其onChange，而是使用自定义联动逻辑
    /*return (
      <Checkbox.Group
        value={selectedKeys}
        className={cn('block')}
      >
        {listContent}
      </Checkbox.Group>
    );*/
    // 多选模式不使用Checkbox.Group，因为我们需要自定义联动逻辑
    return listContent;
  } else {
    return (
      <RadioGroup
        value={selectedKey}
        onChange={handleSingleSelect}
        className={cn('block')}
      >
        {listContent}
      </RadioGroup>
    );
  }
};

Tree.displayName = 'Tree';

export default Tree;
