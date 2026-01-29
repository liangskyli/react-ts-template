import type { FC, LazyExoticComponent } from 'react';
import { Suspense } from 'react';
import Loading from '@/components/core/components/loading';

type LazyLoadProps = {
  component: LazyExoticComponent<FC>;
};

export const LazyLoad = (props: LazyLoadProps) => {
  const { component: Component } = props;
  return (
    // fallback的loading效果可自行修改为ui组件库的loading组件或骨架屏等等
    <Suspense fallback={<Loading visible={true} />}>
      <Component />
    </Suspense>
  );
};
