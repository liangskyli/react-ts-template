import type {
  TreeNode,
  TreeProps,
} from '@/components/core/components/tree/tree.tsx';
import Tree from '@/components/core/components/tree/tree.tsx';
import TreeRadio from "@/components/core/components/tree/tree-radio.tsx";

/* eslint-disable @typescript-eslint/no-explicit-any */
(Tree as any).Radio = TreeRadio;

export default Tree as typeof Tree & {
  Radio: typeof TreeRadio;
};
export type { TreeProps, TreeNode };
