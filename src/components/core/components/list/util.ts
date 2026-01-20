import type { ReactNode } from 'react';
import { Fragment } from 'react';

export const flattenChildren = (children: ReactNode): ReactNode[] => {
  const result: ReactNode[] = [];

  const flatten = (child: ReactNode) => {
    if (child == null) return;

    if (Array.isArray(child)) {
      child.forEach(flatten);
    } else if (
      typeof child === 'object' &&
      'type' in child &&
      child.type === Fragment
    ) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      flatten((child as any).props.children);
    } else {
      result.push(child);
    }
  };

  flatten(children);
  return result;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isWindow(element: any | Window): element is Window {
  return element === window;
}
