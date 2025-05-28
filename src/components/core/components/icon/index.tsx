import type { SVGAttributes } from 'react';
import svgModules from '@/components/core/components/icon/icons-loader.ts';

export type IconProps = {
  /** icon名字，含路径的全名 */
  name: string;
} & SVGAttributes<SVGSVGElement>;

const Icon = (props: IconProps) => {
  const { name, ...svgProps } = props;

  const SvgIcon = svgModules[`/src/icons/${name}.svg`];

  return <>{SvgIcon && <SvgIcon {...svgProps} />}</>;
};
export default Icon;
