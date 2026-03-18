import type { FC, SVGAttributes } from 'react';

const svgModules = import.meta.glob<
  true,
  string,
  undefined | FC<SVGAttributes<SVGSVGElement>>
>('@/icons/**/*.svg', {
  // use vite-plugin-svgr
  query: '?react',
  eager: true,
  import: 'default',
});

export default svgModules;
