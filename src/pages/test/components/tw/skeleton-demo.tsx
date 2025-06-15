import Skeleton from '@/components/core/components/skeleton';

const SkeletonDemo = () => {
  return (
    <div className="tw-space-y-8 tw-p-8">
      <h1 className="tw-mb-4 tw-text-2xl tw-font-bold">Skeleton 组件示例</h1>

      {/* 基础用法 */}
      <section>
        <h2 className="tw-mb-4 tw-text-lg tw-font-semibold">基础用法</h2>
        <div className="tw-space-y-4">
          <Skeleton />
        </div>
      </section>

      {/* 不同变体 */}
      <section>
        <h2 className="tw-mb-4 tw-text-lg tw-font-semibold">不同变体</h2>
        <div className="tw-space-y-4">
          <div>
            <p className="tw-mb-2 tw-text-sm tw-text-gray-600">矩形骨架屏</p>
            <Skeleton />
          </div>

          <div>
            <p className="tw-mb-2 tw-text-sm tw-text-gray-600">圆形骨架屏</p>
            <Skeleton.circular />
          </div>

          <div>
            <p className="tw-mb-2 tw-text-sm tw-text-gray-600">段落骨架屏</p>
            <Skeleton.Paragraph />
          </div>
        </div>
      </section>

      {/* 不同大小的文本骨架屏 */}
      <section>
        <h2 className="tw-mb-4 tw-text-lg tw-font-semibold">
          不同大小的文本骨架屏
        </h2>
        <div className="tw-space-y-2">
          <Skeleton />
          <Skeleton className="tw-h-[24px]" />
          <Skeleton className="tw-h-[80px]" />
        </div>
      </section>

      {/* 复杂布局骨架屏 */}
      <section>
        <h2 className="tw-mb-4 tw-text-lg tw-font-semibold">复杂布局骨架屏</h2>
        <div className="tw-flex tw-space-x-4">
          {/* 头像 */}
          <Skeleton.circular className="tw-size-[48px]" />

          {/* 内容区域 */}
          <Skeleton.Paragraph className="tw-flex-1" />
        </div>
      </section>

      {/* 卡片骨架屏 */}
      <section>
        <h2 className="tw-mb-4 tw-text-lg tw-font-semibold">卡片骨架屏</h2>
        <div className="tw-space-y-4 tw-rounded-lg tw-border tw-p-4">
          {/* 图片区域 */}
          <Skeleton.circular className="tw-size-[48px]" />

          {/* 标题和描述 */}
          <Skeleton.Paragraph lineClassName="first:tw-w-[80%]" />

          {/* 按钮区域 */}
          <div className="tw-flex tw-space-x-2">
            <Skeleton className="tw-h-[32px] tw-w-[80px]" />
            <Skeleton className="tw-h-[32px] tw-w-[80px]" />
          </div>
        </div>
      </section>

      {/* 列表骨架屏 */}
      <section>
        <h2 className="tw-mb-4 tw-text-lg tw-font-semibold">列表骨架屏</h2>
        <div className="tw-space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="tw-flex tw-space-x-4">
              <Skeleton.circular className="tw-size-[48px]" />
              <Skeleton.Paragraph
                className="tw-flex-1"
                lineCount={2}
                lineClassName="tw-w-[40%] last:tw-w-[80%]"
              />
            </div>
          ))}
        </div>
      </section>

      {/* 禁用动画 */}
      <section>
        <h2 className="tw-mb-4 tw-text-lg tw-font-semibold">禁用动画</h2>
        <div className="tw-space-y-4">
          <Skeleton animation={false} />
          <Skeleton.circular animation={false} />
        </div>
      </section>
    </div>
  );
};

export default SkeletonDemo;
