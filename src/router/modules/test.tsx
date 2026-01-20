import { lazy } from 'react';
import { Outlet } from 'react-router';
import { LazyLoad } from '@/router/utils';
import type { ExtendRouteObjectWith } from '@/types/router';

const testRoutes: ExtendRouteObjectWith[] = [
  {
    path: '/test',
    element: <Outlet />,
    children: [
      {
        path: '/test/test1',
        element: LazyLoad(lazy(() => import('@/pages/test/test1'))),
        title: 'test/test1',
      },
      {
        path: '/test/ui',
        element: LazyLoad(lazy(() => import('@/pages/test/ui'))),
        title: 'ui',
      },
      {
        path: '/test/cache',
        element: LazyLoad(lazy(() => import('@/pages/test/cache'))),
        title: 'cache',
      },
      {
        path: '/test/cache2',
        element: LazyLoad(lazy(() => import('@/pages/test/cache/index2.tsx'))),
        title: 'cache',
      },
      {
        path: '/test/cache3',
        element: LazyLoad(lazy(() => import('@/pages/test/cache/index3.tsx'))),
        title: 'cache',
      },
    ],
  },
];
export default testRoutes;
