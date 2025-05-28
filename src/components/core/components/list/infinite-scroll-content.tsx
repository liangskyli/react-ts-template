import classConfig from '@/components/core/components/list/class-config.ts';

type InfiniteScrollContentProps = {
  hasMore: boolean;
  failed: boolean;
  retry: () => void;
};
const InfiniteScrollContent = (props: InfiniteScrollContentProps) => {
  const className = classConfig.infiniteScrollContentConfig.wrap;
  if (!props.hasMore) {
    return <div className={className}>没有更多数据了</div>;
  }

  if (props.failed) {
    return (
      <div className={className}>
        <span>加载失败</span>
        <a
          className={classConfig.infiniteScrollContentConfig.retry}
          onClick={() => {
            props.retry();
          }}
        >
          重新加载
        </a>
      </div>
    );
  }

  return <div className={className}>加载中...</div>;
};

export default InfiniteScrollContent;
