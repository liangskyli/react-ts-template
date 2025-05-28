import Button from '@/components/core/components/button';
import Icon from '@/components/core/components/icon';
import { useRouter } from '@/hooks/use-router.ts';

const ButtonDemo = () => {
  const router = useRouter();

  return (
    <div className="space-y-4 px-2 pb-2">
      {/* 基础用法 */}
      <div className="space-x-2 space-y-2">
        <Button variant="primary">主要按钮</Button>
        <Button variant="secondary">次要按钮</Button>
        <Button variant="danger">危险按钮</Button>
        <Button variant="ghost">幽灵按钮</Button>
        <Button className="bg-teal-600 text-red hover:bg-teal-600 disabled:bg-teal-400">
          <Icon className="-ml-1 mr-1 h-4 w-4" name="help" />
          自定义按钮
        </Button>
        <Button className="border border-red" as="div">
          自定义按钮
        </Button>
      </div>

      {/* 不同大小 */}
      <div className="space-x-2">
        <Button className="text-xs">小按钮</Button>
        <Button className="text-xl">大按钮</Button>
        <Button className="text-[24px]/[30px] font-bold">大粗按钮</Button>
      </div>

      {/* 不同形状 */}
      <div className="space-x-2">
        <Button>默认形状</Button>
        <Button className="rounded-none before:rounded-none">直角按钮</Button>
        <Button className="rounded-full before:rounded-full">圆角按钮</Button>
      </div>

      {/* 加载状态 */}
      <div className="space-x-2">
        <Button loading>加载中</Button>
        <Button loading variant="secondary">
          加载中
        </Button>
        <Button
          loading
          variant="danger"
          loadingIcon={
            <Icon className="-ml-1 mr-2 h-4 w-4 animate-spin" name="loading" />
          }
        >
          加载中
        </Button>
      </div>

      {/* 禁用状态 */}
      <div className="space-x-2">
        <Button disabled>禁用按钮</Button>
        <Button disabled variant="secondary">
          禁用按钮
        </Button>
      </div>

      {/* 块级按钮 */}
      <div>
        <Button block onClick={() => router.push('/test/tw-ui')}>
          块级按钮(跳转tw-ui页面)
        </Button>
      </div>
    </div>
  );
};
export default ButtonDemo;
