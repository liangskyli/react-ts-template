import { useState } from 'react';
import type { TypeItProps } from 'typeit-react';
import TypeIt from 'typeit-react';

type TypeItCore = Parameters<Required<TypeItProps>['getAfterInit']>[0];
export type TypewriterProps = {
  /** 自定义类名 */
  className?: string;
} & TypeItProps;
const useTypewriterText = (opts: TypewriterProps = {}) => {
  const { getAfterInit, ...otherTypeItProps } = opts;
  const [instance, setInstance] = useState<TypeItCore | null>(null);

  const text = (
    <TypeIt
      {...otherTypeItProps}
      getAfterInit={(i) => {
        setInstance(i);
        getAfterInit?.(i);
        return i;
      }}
    />
  );

  return { text, instance };
};
export default useTypewriterText;
