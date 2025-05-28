import Button from '@/components/core/components/button';
import Icon from '@/components/core/components/icon';
import { useRouter } from '@/hooks/use-router.ts';

const ButtonDemo = () => {
  const router = useRouter();

  return (
    <div className="tw-space-y-4 tw-px-2 tw-pb-2">
      {/* 基础用法 */}
      <div className="tw-space-x-2 tw-space-y-2">
        <Button variant="primary">主要按钮</Button>
        <Button variant="secondary">次要按钮</Button>
        <Button variant="danger">危险按钮</Button>
        <Button variant="ghost">幽灵按钮</Button>
        <Button className="tw-bg-teal-600 tw-text-red hover:tw-bg-teal-600 disabled:tw-bg-teal-400">
          <Icon className="-tw-ml-1 tw-mr-1 tw-h-4 tw-w-4" name="help" />
          自定义按钮
        </Button>
        <Button className="tw-border tw-border-red" as="div">
          自定义按钮
        </Button>
      </div>

      {/* 不同大小 */}
      <div className="tw-space-x-2">
        <Button className="tw-text-xs">小按钮</Button>
        <Button className="tw-text-xl">大按钮</Button>
        <Button className="tw-text-[24px]/[30px] tw-font-bold">大粗按钮</Button>
      </div>

      {/* 不同形状 */}
      <div className="tw-space-x-2">
        <Button>默认形状</Button>
        <Button className="tw-rounded-none before:tw-rounded-none">
          直角按钮
        </Button>
        <Button className="tw-rounded-full before:tw-rounded-full">
          圆角按钮
        </Button>
      </div>

      {/* 加载状态 */}
      <div className="tw-space-x-2">
        <Button loading>加载中</Button>
        <Button loading variant="secondary">
          加载中
        </Button>
        <Button
          loading
          variant="danger"
          loadingIcon={
            <Icon
              className="-tw-ml-1 tw-mr-2 tw-h-4 tw-w-4 tw-animate-spin"
              name="loading"
            />
          }
        >
          加载中
        </Button>
      </div>

      {/* 禁用状态 */}
      <div className="tw-space-x-2">
        <Button disabled>禁用按钮</Button>
        <Button disabled variant="secondary">
          禁用按钮
        </Button>
      </div>

      {/* 块级按钮 */}
      <div>
        <Button block onClick={() => router.push('/test/test1')}>
          块级按钮
        </Button>
      </div>
    </div>
  );
};
export default ButtonDemo;
