import { DefaultLoadingIcon } from '@/components/loading';

const LoadingDemo = () => {
  return (
    <div className="space-y-4 px-2 pb-2">
      {/* 基础用法 */}
      <div className="flex items-center justify-center">
        <DefaultLoadingIcon />
        <DefaultLoadingIcon className="text-gray-600" />
        <DefaultLoadingIcon className="h-6 w-6 text-blue-600" />
        <DefaultLoadingIcon className="h-6 w-6 text-red" />
      </div>
    </div>
  );
};
export default LoadingDemo;
