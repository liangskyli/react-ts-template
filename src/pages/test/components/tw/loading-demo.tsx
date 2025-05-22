import { DefaultLoadingIcon } from '@/components/loading';

const LoadingDemo = () => {
  return (
    <div className="tw-space-y-4 tw-px-2 tw-pb-2">
      {/* 基础用法 */}
      <div className="tw-flex tw-items-center tw-justify-center">
        <DefaultLoadingIcon />
        <DefaultLoadingIcon className="tw-text-gray-600" />
        <DefaultLoadingIcon className="tw-h-6 tw-w-6 tw-text-blue-600" />
        <DefaultLoadingIcon className="tw-h-6 tw-w-6 tw-text-red" />
      </div>
    </div>
  );
};
export default LoadingDemo;
