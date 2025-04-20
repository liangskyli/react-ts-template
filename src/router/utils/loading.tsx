import Icon from '@/components/icon';

const Loading = () => (
  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
    <div className="flex h-32 w-32 flex-col items-center justify-center rounded-lg bg-mask text-white">
      <Icon className="animate-spin" name="loading" />
      <div className="mt-2 text-base">加载中...</div>
    </div>
  </div>
);
export default Loading;
