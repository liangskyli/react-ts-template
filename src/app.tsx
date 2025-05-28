import { RouterProvider } from 'react-router/dom';
import Loading from '@/components/core/components/loading';
import { useAjaxLoadingStore } from '@/store';
import router from './router';

function App() {
  const { isLoading } = useAjaxLoadingStore();
  return (
    <>
      <RouterProvider router={router} />
      <Loading visible={isLoading} />
    </>
  );
}

export default App;
