import type {
  TreeNode,
  TreeProps,
  TreeRef,
} from '@/components/core/components/tree/tree.tsx';
import Tree from '@/components/core/components/tree/tree.tsx';
import TreeRadio from "@/components/core/components/tree/tree-radio.tsx";
import TreeCheckbox from "@/components/core/components/tree/tree-checkbox.tsx";

/* eslint-disable @typescript-eslint/no-explicit-any */
(Tree as any).Radio = TreeRadio;
(Tree as any).Checkbox = TreeCheckbox;

export default Tree as typeof Tree & {
  Radio: typeof TreeRadio;
  Checkbox: typeof TreeCheckbox;
};
export type { TreeProps, TreeNode, TreeRef };
