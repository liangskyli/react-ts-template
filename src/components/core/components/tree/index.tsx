import { DefaultCollapseIcon, DefaultExpandIcon } from './icons';
import TreeCheckbox from './tree-checkbox.tsx';
import TreeRadio from './tree-radio.tsx';
import type { TreeNode, TreeProps, TreeRef } from './tree.tsx';
import TreeBase from './tree.tsx';

type TreeType = typeof TreeBase & {
  Radio: typeof TreeRadio;
  Checkbox: typeof TreeCheckbox;
};
const Tree = TreeBase as TreeType;
Tree.Radio = TreeRadio;
Tree.Checkbox = TreeCheckbox;

export default Tree;
export type { TreeProps, TreeNode, TreeRef };
export { DefaultExpandIcon, DefaultCollapseIcon };
