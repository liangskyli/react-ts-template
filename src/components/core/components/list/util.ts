import React from 'react';

export const flattenChildren = (
  children: React.ReactNode,
): React.ReactNode[] => {
  const result: React.ReactNode[] = [];

  const flatten = (child: React.ReactNode) => {
    if (child == null) return;

    if (Array.isArray(child)) {
      child.forEach(flatten);
    } else if (
      typeof child === 'object' &&
      'type' in child &&
      child.type === React.Fragment
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
