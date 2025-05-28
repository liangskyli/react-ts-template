import type { ReactElement, ReactPortal } from 'react';
import { createPortal } from 'react-dom';

type GetContainerFun = () => HTMLElement | undefined;
/** 指定挂载的节点,如果为 null 的话，会渲染到当前节点 */
export type GetContainer = HTMLElement | GetContainerFun | undefined | null;

export function resolveContainer(getContainer: GetContainer) {
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
  if (getContainer !== null && getContainer) {
    const container = resolveContainer(getContainer);
    return createPortal(node, container) as ReactPortal;
  }
  return node;
}
