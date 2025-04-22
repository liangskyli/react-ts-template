import type { ReactElement, ReactPortal } from 'react';
import { createPortal } from 'react-dom';

type GetContainerFun = () => HTMLElement | undefined;
export type GetContainer = HTMLElement | GetContainerFun | undefined;

function resolveContainer(getContainer: GetContainer) {
  const container =
    typeof getContainer === 'function'
      ? (getContainer as GetContainerFun)()
      : getContainer;
  return container || document.body;
}

export function renderToContainer(
  getContainer: GetContainer,
  node: ReactElement,
) {
  if (getContainer) {
    const container = resolveContainer(getContainer);
    return createPortal(node, container) as ReactPortal;
  }
  return node;
}
