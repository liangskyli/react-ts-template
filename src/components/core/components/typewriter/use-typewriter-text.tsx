import { useCallback, useRef } from 'react';
import type { TypeItProps } from 'typeit-react';
import TypeIt from 'typeit-react';

type TypeItCore = Parameters<Required<TypeItProps>['getAfterInit']>[0];
export type TypewriterProps = {
  /** 自定义类名 */
  className?: string;
} & TypeItProps;
const useTypewriterText = (opts: TypewriterProps = {}) => {
  const { getAfterInit, ...otherTypeItProps } = opts;
  const instanceRef = useRef<TypeItCore | null>(null);

  // 使用 useCallback 来稳定 getAfterInit 回调
  const handleAfterInit = useCallback(
    (i: TypeItCore) => {
      instanceRef.current = i;
      getAfterInit?.(i);
      return i;
    },
    [getAfterInit],
  );

  const text = <TypeIt {...otherTypeItProps} getAfterInit={handleAfterInit} />;

  return { text, getInstance: () => instanceRef.current };
};
export default useTypewriterText;
