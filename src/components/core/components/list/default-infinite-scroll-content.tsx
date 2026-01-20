import classConfig from '@/components/core/components/list/class-config.ts';

const classConfigData = classConfig();

export type InfiniteScrollContentProps = {
  hasMore: boolean;
  failed: boolean;
  retry: () => void;
};
const DefaultInfiniteScrollContent = (props: InfiniteScrollContentProps) => {
  const className = classConfigData.defaultInfiniteScrollContentWrap();
  if (!props.hasMore) {
    return <div className={className}>没有更多数据了</div>;
  }

  if (props.failed) {
    return (
      <div className={className}>
        <span>加载失败</span>
        <a
          className={classConfigData.defaultInfiniteScrollContentRetry()}
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

export default DefaultInfiniteScrollContent;
