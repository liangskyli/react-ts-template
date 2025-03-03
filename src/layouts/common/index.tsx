import { Outlet, useLocation } from 'react-router';
import RouterTitle from '@/layouts/common/components/router-title.tsx';

const CommonLayout = () => {
  const location = useLocation();

  return (
    <>
      <RouterTitle />
      <div className="txt-center pt20">router pathname:{location.pathname}</div>
      <Outlet />
    </>
  );
};

export default CommonLayout;
