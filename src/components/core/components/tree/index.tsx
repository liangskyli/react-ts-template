import React, {
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
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
  /** 是否启用父子节点联动（仅多选模式有效） */
  checkStrictly?: boolean;
  /** 选中的节点key（单选模式） */
  selectedKey?: string | number;
  /** 选中的节点key（多选模式） */
  selectedKeys?: (string | number)[];
  /** 展开的节点key */
  expandedKeys?: (string | number)[];
  /** 默认展开的节点key */
  defaultExpandedKeys?: (string | number)[];
  /** 默认选中的节点key（单选模式） */
  defaultSelectedKey?: string | number;
  /** 默认选中的节点key（多选模式） */
  defaultSelectedKeys?: (string | number)[];
  /** 是否显示展开/收起图标 */
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
    selectedKeys: (string | number)[],
    info: {
      selectedNodes: TreeNode[];
      checkedKeys: (string | number)[];
      halfCheckedKeys: (string | number)[];
    },
  ) => void;
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
  /** 滚动列表的ref */
  ref?: React.Ref<TreeRef>;
} & Pick<ListProps, 'virtualScroll' | 'infiniteScroll' | 'getPositionCache'>;

const Tree = (props: TreeProps & { ref?: React.Ref<TreeRef> }) => {
  const {
    treeData,
    multiple = false,
    selectable = true,
    checkStrictly = false,
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
    onExpand,
    className,
    virtualScroll = false,
    infiniteScroll,
    getPositionCache,
    ref,
  } = props;

  // 创建内部ref
  const listRef = useRef<ListRef>(null);

  // 使用useImperativeHandle暴露方法
  useImperativeHandle(
    ref,
    () => ({
      scrollToPosition: (scrollTop: number) => {
        listRef.current?.scrollToPosition(scrollTop);
      },
      virtualScrollToIndex: (index: number) => {
        listRef.current?.virtualScrollToIndex(index);
      },
    }),
    [],
  );

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

  // 计算半选状态
  const getCheckState = useCallback(
    (nodeKey: string | number, checkedKeys: (string | number)[]) => {
      if (checkStrictly) {
        return {
          checked: checkedKeys.includes(nodeKey),
          indeterminate: false,
        };
      }

      const node = flattenNodes.find((n) => n.key === nodeKey);
      if (!node) {
        return {
          checked: checkedKeys.includes(nodeKey),
          indeterminate: false,
        };
      }

      // 如果是叶子节点，直接返回选中状态
      if (node.isLeaf) {
        return {
          checked: checkedKeys.includes(nodeKey),
          indeterminate: false,
        };
      }

      // 对于非叶子节点，需要递归检查子节点状态
      const childrenKeys = node.childrenKeys;

      if (childrenKeys.length === 0) {
        // 没有子节点，按叶子节点处理
        return {
          checked: checkedKeys.includes(nodeKey),
          indeterminate: false,
        };
      }

      // 计算子节点的状态
      let checkedChildrenCount = 0;
      let indeterminateChildrenCount = 0;

      childrenKeys.forEach((childKey) => {
        const childState = getCheckState(childKey, checkedKeys);
        if (childState.checked) {
          checkedChildrenCount++;
        } else if (childState.indeterminate) {
          indeterminateChildrenCount++;
        }
      });

      // 根据子节点状态确定父节点状态
      if (checkedChildrenCount === 0 && indeterminateChildrenCount === 0) {
        // 没有任何子节点被选中或半选
        return {
          checked: false,
          indeterminate: false,
        };
      } else if (checkedChildrenCount === childrenKeys.length) {
        // 所有子节点都被选中
        return {
          checked: true,
          indeterminate: false,
        };
      } else {
        // 部分子节点被选中或有半选状态
        return {
          checked: false,
          indeterminate: true,
        };
      }
    },
    [checkStrictly, flattenNodes],
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

        // 选中所有后代节点
        targetNode.allDescendantKeys.forEach((descendantKey) => {
          if (!newKeys.includes(descendantKey)) {
            newKeys.push(descendantKey);
          }
        });

        // 检查父节点是否应该被选中（当所有兄弟节点都被选中时）
        if (targetNode.parentKey) {
          const parentNode = flattenNodes.find(
            (n) => n.key === targetNode.parentKey,
          );
          if (parentNode) {
            const allSiblingsChecked = parentNode.childrenKeys.every(
              (siblingKey) => newKeys.includes(siblingKey),
            );
            if (allSiblingsChecked && !newKeys.includes(targetNode.parentKey)) {
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
        // 取消选中：取消自己和所有后代
        newKeys = newKeys.filter(
          (key) =>
            key !== targetKey && !targetNode.allDescendantKeys.includes(key),
        );

        // 取消所有祖先节点的选中状态
        let currentParent = targetNode.parentKey;
        while (currentParent) {
          newKeys = newKeys.filter((key) => key !== currentParent);
          const parentNode = flattenNodes.find((n) => n.key === currentParent);
          currentParent = parentNode?.parentKey;
        }
      }

      return [...new Set(newKeys)]; // 去重
    },
    [checkStrictly, flattenNodes],
  );

  // 处理多选节点选择
  const handleMultipleSelect = useCallback(
    (newSelectedKeys: (string | number)[]) => {
      if (!controlledSelectedKeys) {
        setInternalSelectedKeys(newSelectedKeys);
      }

      // 获取选中的节点信息
      const selectedNodes = flattenNodes.filter((n) =>
        newSelectedKeys.includes(n.key),
      );

      // 计算半选状态
      const checkedKeys: (string | number)[] = [];
      const halfCheckedKeys: (string | number)[] = [];

      flattenNodes.forEach((node) => {
        const { checked, indeterminate } = getCheckState(
          node.key,
          newSelectedKeys,
        );
        if (checked) {
          checkedKeys.push(node.key);
        } else if (indeterminate) {
          halfCheckedKeys.push(node.key);
        }
      });

      onMultipleSelect?.(newSelectedKeys, {
        selectedNodes,
        checkedKeys,
        halfCheckedKeys,
      });
    },
    [controlledSelectedKeys, flattenNodes, onMultipleSelect, getCheckState],
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
      const nodeSelectable =
        selectable && node.selectable !== false && !node.disabled;

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
            {nodeSelectable ? (
              multiple ? (
                <Checkbox
                  value={node.key}
                  disabled={node.disabled}
                  checked={checked || indeterminate} // 半选状态也需要checked=true
                  indeterminate={indeterminate}
                  onChange={(newChecked) => {
                    const newKeys = getUpdatedKeysWithCascade(
                      node.key,
                      newChecked,
                      selectedKeys,
                    );
                    handleMultipleSelect(newKeys);
                  }}
                >
                  {node.title}
                </Checkbox>
              ) : (
                <RadioGroup.Radio value={node.key} disabled={node.disabled}>
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
      showIcon,
      expandIcon,
      collapseIcon,
      handleNodeExpand,
      selectable,
      multiple,
      selectedKeys,
      getCheckState,
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

// 使用React.forwardRef包装组件以支持ref传递
const ForwardedTree = React.forwardRef<TreeRef, TreeProps>((props, ref) => {
  return <Tree {...props} ref={ref} />;
});

ForwardedTree.displayName = 'Tree';

export default ForwardedTree;
