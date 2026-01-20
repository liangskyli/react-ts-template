import React, {
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { cn } from '@/components/core/class-config';
import type { ListProps, ListRef } from '@/components/core/components/list';
import List from '@/components/core/components/list';
import classConfig from '@/components/core/components/tree/class-config.ts';
import {
  DefaultCollapseIcon,
  DefaultExpandIcon,
} from '@/components/core/components/tree/icons.tsx';

const classConfigData = classConfig();

export type TreeNode<
  K extends string | number = string,
  T extends Record<string, unknown> = Record<string, unknown>,
> = {
  /** 节点的唯一标识 */
  key: K;
  /** 节点标题 */
  title: React.ReactNode;
  /** 子节点 */
  children?: TreeNode<K, T>[];
  /** 是否默认展开 */
  defaultExpanded?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
} & T;

export type FlattenNode<
  K extends string | number = string,
  T extends Record<string, unknown> = Record<string, unknown>,
> = TreeNode<K, T> & {
  /** 节点层级 */
  level: number;
  /** 父节点key */
  parentKey?: K;
  /** 是否是叶子节点 */
  isLeaf: boolean;
  /** 子节点keys */
  childrenKeys: K[];
  /** 所有后代节点keys */
  allDescendantKeys: K[];
};
type NodeMap<
  K extends string | number = string,
  T extends Record<string, unknown> = Record<string, unknown>,
> = {
  /** 节点映射 */
  nodeMap: Map<K, TreeNode<K, T>>;
  /** 子节点映射 */
  childrenMap: Map<K, K[]>;
  /** 后代节点映射 */
  descendantMap: Map<K, K[]>;
};
export type NodesData<
  K extends string | number = string,
  T extends Record<string, unknown> = Record<string, unknown>,
> = {
  nodeMap: NodeMap<K, T>;
  flattenNodes: FlattenNode<K, T>[];
  allFlattenNodeMap: Map<K, FlattenNode<K, T>>;
};
export type TreeRef<
  K extends string | number = string,
  T extends Record<string, unknown> = Record<string, unknown>,
> = {
  /** 获取展开的节点扁平化树形数据 */
  getFlattenNodes: () => NodesData<K, T>['flattenNodes'];
  /** 获取所有扁平化节点映射 */
  getAllFlattenNodeMap: () => NodesData<K, T>['allFlattenNodeMap'];
  /** 获取节点映射 */
  getNodeMap: () => NodesData<K, T>['nodeMap'];
};
export type TreeProps<
  K extends string | number = string,
  T extends Record<string, unknown> = Record<string, unknown>,
> = {
  /** ref */
  ref?: React.Ref<TreeRef<K, T>>;
  /** 树形数据 */
  treeData: TreeNode<K, T>[];
  /** 展开的节点key */
  expandedKeys?: K[];
  /** 默认展开的节点key */
  defaultExpandedKeys?: K[];
  /** 是否显示展开/收起图标，不显示图标时节点默认展开 */
  showIcon?: boolean;
  /** 自定义展开图标 */
  expandIcon?: React.ReactNode;
  /** 自定义收起图标 */
  collapseIcon?: React.ReactNode;
  /** 缩进宽度 */
  indentWidth?: number;
  /** 展开/收起回调 */
  onExpand?: (
    expandedKeys: K[],
    info: {
      expanded: boolean;
      node: FlattenNode<K, T>;
    },
  ) => void;
  /** 自定义渲染节点标题 */
  renderNode?: (
    node: FlattenNode<K, T>,
    nodesData: NodesData<K, T>,
  ) => React.ReactNode | undefined;
  /** 自定义类名 */
  className?: string;
  /** 渲染节点类名 */
  nodeClassName?: string;
  /** 缩进类名 */
  indentClassName?: string;
  /** 展开/收起区域类名 */
  switcherClassName?: string;
  /** 节点文本内容类名 */
  nodeTitleContentClassName?: string;
} & Pick<ListProps, 'virtualScroll'>;

const Tree = <
  K extends string | number = string,
  T extends Record<string, unknown> = Record<string, unknown>,
>(
  props: TreeProps<K, T>,
) => {
  const {
    ref,
    treeData,
    expandedKeys: controlledExpandedKeys,
    defaultExpandedKeys = [],
    showIcon = true,
    expandIcon = <DefaultExpandIcon />,
    collapseIcon = <DefaultCollapseIcon />,
    onExpand,
    indentWidth = 24,
    renderNode,
    className,
    nodeClassName,
    indentClassName,
    switcherClassName,
    nodeTitleContentClassName,
    virtualScroll = false,
  } = props;

  // 创建内部ref
  const listRef = useRef<ListRef>(null);

  const [internalExpandedKeys, setInternalExpandedKeys] = useState<K[]>(
    controlledExpandedKeys || defaultExpandedKeys,
  );

  const expandedKeys = controlledExpandedKeys || internalExpandedKeys;

  // 构建节点关系映射
  const nodeMap = useMemo(() => {
    const map = new Map<K, TreeNode<K, T>>();
    const childrenMap = new Map<K, K[]>();
    const descendantMap = new Map<K, K[]>();

    const buildMap = (nodes: TreeNode<K, T>[], parentKey?: K) => {
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
          const descendants: K[] = [];
          const collectDescendants = (children: TreeNode<K, T>[]) => {
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

  const memoFlatten = useCallback(
    (
      nodes: TreeNode<K, T>[],
      opts: {
        level: number;
        parentKey?: K;
        expandedKeys?: K[];
      } = { level: 0 },
    ): FlattenNode<K, T>[] => {
      const { level, parentKey, expandedKeys } = opts;
      const result: FlattenNode<K, T>[] = [];

      nodes.forEach((node) => {
        const childrenKeys = nodeMap.childrenMap.get(node.key) || [];
        const allDescendantKeys = nodeMap.descendantMap.get(node.key) || [];

        const flatNode: FlattenNode<K, T> = {
          ...node,
          level,
          parentKey,
          isLeaf: !node.children || node.children.length === 0,
          childrenKeys,
          allDescendantKeys,
        };
        result.push(flatNode);

        if (expandedKeys) {
          // 如果节点展开且有子节点，递归处理子节点
          if (expandedKeys.includes(node.key) && node.children) {
            result.push(
              ...memoFlatten(node.children, {
                level: level + 1,
                parentKey: node.key,
                expandedKeys,
              }),
            );
          }
        } else {
          // 递归处理子节点
          if (node.children) {
            result.push(
              ...memoFlatten(node.children, {
                level: level + 1,
                parentKey: node.key,
              }),
            );
          }
        }
      });

      return result;
    },
    [nodeMap.childrenMap, nodeMap.descendantMap],
  );

  // 展开的扁平化树形数据
  const flattenNodes = useMemo(() => {
    return memoFlatten(treeData, {
      expandedKeys: showIcon ? expandedKeys : undefined,
      level: 0,
    });
  }, [memoFlatten, treeData, showIcon, expandedKeys]);

  // 所有的扁平化树形数据
  const allFlattenNodeMap = useMemo(() => {
    return new Map(memoFlatten(treeData).map((node) => [node.key, node]));
  }, [memoFlatten, treeData]);

  // 处理展开/收起
  const handleNodeExpand = useCallback(
    (node: FlattenNode<K, T>) => {
      if (node.isLeaf) return;

      const isExpanded = expandedKeys.includes(node.key);
      let newExpandedKeys: K[];

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
  const innerRenderNode = useCallback(
    (node: FlattenNode<K, T>) => {
      const isExpanded = expandedKeys.includes(node.key);
      const canExpand = !node.isLeaf;

      return (
        <div
          key={node.key}
          className={cn(classConfigData.node({ className: nodeClassName }))}
          data-disabled={node.disabled ? true : undefined}
        >
          {/* 缩进 */}
          <div
            className={cn(
              classConfigData.nodeContentIndent({ className: indentClassName }),
            )}
            style={{ width: `${node.level * indentWidth}px` }}
          />

          {/* 展开/收起图标 */}
          {showIcon && (
            <div
              data-can-expand={canExpand ? true : undefined}
              className={cn(
                classConfigData.nodeContentSwitcher({
                  className: switcherClassName,
                }),
              )}
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
          <div
            className={cn(
              classConfigData.nodeContentWrap({
                className: nodeTitleContentClassName,
              }),
            )}
          >
            {renderNode?.(node, { nodeMap, flattenNodes, allFlattenNodeMap }) ??
              node.title}
          </div>
        </div>
      );
    },
    [
      expandedKeys,
      nodeClassName,
      indentClassName,
      indentWidth,
      showIcon,
      switcherClassName,
      collapseIcon,
      expandIcon,
      nodeTitleContentClassName,
      renderNode,
      nodeMap,
      flattenNodes,
      allFlattenNodeMap,
      handleNodeExpand,
    ],
  );

  useImperativeHandle(ref, () => {
    return {
      getFlattenNodes: () => flattenNodes,
      getAllFlattenNodeMap: () => allFlattenNodeMap,
      getNodeMap: () => nodeMap,
    } as TreeRef<K, T>;
  }, [allFlattenNodeMap, flattenNodes, nodeMap]);

  return (
    <List<FlattenNode<K, T>>
      ref={listRef}
      className={cn(className)}
      virtualScroll={virtualScroll}
      list={flattenNodes}
    >
      {(nodes) => nodes.map(innerRenderNode)}
    </List>
  );
};

export default Tree;
