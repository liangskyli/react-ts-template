const getSemanticClassNames = <
  T extends { root?: string } & Record<string, string>,
>(
  className?: string | T,
) => {
  let classNames: T | undefined = undefined;
  if (typeof className === 'object') {
    classNames = className;
  } else if (typeof className === 'string') {
    classNames = { root: className } as T;
  }
  return classNames;
};
export { getSemanticClassNames };
