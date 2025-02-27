import { createBrowserRouter } from 'react-router';
import routes from '@/router/modules';
import config from '@/utils/config.ts';

const Router = createBrowserRouter(routes, {
  basename: config.baseRouterPrefix,
});
export default Router;
