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
    ],
  },
];
export default testRoutes;
