import { useCallback, useRef, useState } from 'react';
import { cn } from '@/components/core/class-config';
import type { RadioGroupProps } from '@/components/core/components/radio';
import RadioGroup from '@/components/core/components/radio';
import classConfig from '@/components/core/components/tree/class-config.ts';
import type {
  TreeNode,
  TreeProps,
  TreeRef,
} from '@/components/core/components/tree/tree.tsx';
import Tree from '@/components/core/components/tree/tree.tsx';

const classConfigData = classConfig();

type TreeExtendedProps = {
  /** 是否可选择 */
  selectable?: boolean;
};
export type TreeRadioProps<K extends string | number = string> = Omit<
  TreeProps<K, TreeExtendedProps>,
  'className'
> & {
  /** 自定义类名 */
  className?: string;
  /** 树的类名 */
  treeClassName?: string;
  /** 是否只有叶子节点可以选择 */
  onlyLeafSelectable?: boolean;
  /** 选中的节点key */
  selectedKey?: K | null;
  /** 默认选中的节点key */
  defaultSelectedKey?: K;
  /** 节点选择回调 */
  onSelect?: (
    selectedKey: K | undefined | null,
    info: {
      node?: TreeNode<K, TreeExtendedProps>;
    },
  ) => void;
} & Pick<RadioGroupProps, 'allowDeselect'>;

const TreeRadio = <K extends string | number = string>(
  props: TreeRadioProps<K>,
) => {
  const {
    onlyLeafSelectable,
    selectedKey: controlledSelectedKey,
    defaultSelectedKey,
    onSelect,
    allowDeselect,
    className,
    treeClassName,
    ref,
    ...treeProps
  } = props;

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
  const [internalSelectedKey, setInternalSelectedKey] = useState<
    K | undefined | null
  >(controlledSelectedKey || defaultSelectedKey);

  // 使用受控或非受控状态
  const selectedKey =
    controlledSelectedKey !== undefined
      ? controlledSelectedKey
      : (internalSelectedKey ?? null);

  // 处理单选节点选择
  const handleSingleSelect = useCallback(
    (newSelectedKey: K | undefined | null) => {
      if (controlledSelectedKey === undefined) {
        setInternalSelectedKey(newSelectedKey);
      }

      const flattenNodes = treeRef.current!.getFlattenNodes();
      const selectedNode = flattenNodes.find((n) => n.key === newSelectedKey);
      onSelect?.(newSelectedKey, { node: selectedNode });
    },
    [controlledSelectedKey, onSelect],
  );

  const innerRenderNode: TreeRadioProps<K>['renderNode'] = (
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
      <RadioGroup.Radio value={node.key} disabled={node.disabled}>
        {node.title}
      </RadioGroup.Radio>
    );
  };

  return (
    <RadioGroup
      value={selectedKey}
      onChange={handleSingleSelect}
      className={cn(classConfigData.treeRadio({ className }))}
      allowDeselect={allowDeselect}
    >
      <Tree
        {...treeProps}
        ref={mergedRef}
        renderNode={innerRenderNode}
        className={treeClassName}
      />
    </RadioGroup>
  );
};

export default TreeRadio;
