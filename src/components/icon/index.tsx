import type { FC, SVGAttributes } from 'react';

const svgModules = import.meta.glob<
  true,
  string,
  undefined | FC<SVGAttributes<SVGSVGElement>>
>('@/icons/**/*.svg', {
  query: '?react',
  eager: true,
  import: 'default',
});

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
