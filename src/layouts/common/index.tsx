import { useLayoutEffect } from 'react';
import { Outlet, matchRoutes, useLocation } from 'react-router';
import routes from '@/router/modules';

const CommonLayout = () => {
  const location = useLocation();
  useLayoutEffect(() => {
    // 页面标题
    const route = matchRoutes(routes, location)?.pop()?.route;
    if (route) {
      const title = route.title ?? import.meta.env.VITE_APP_TITLE;
      if (title) {
        document.title = title;
      }
    }
  }, [location]);

  return (
    <>
      <div className="txt-center pt20">router pathname:{location.pathname}</div>
      <Outlet />
    </>
  );
};

export default CommonLayout;
