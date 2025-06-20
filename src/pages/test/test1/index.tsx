import { useState } from 'react';
import { cn } from '@/components/core/class-config';
import Icon from '@/components/core/components/icon';
import { useRouter } from '@/hooks/use-router.ts';
import { useOpticsStoreStore } from '@/store';
import requestApi from '@/services/api';
import './index.less';
import styles from './index.module.less';
import './index.scss';

const Index = () => {
  const router = useRouter();
  const { setABC, getAllData, setBCDF } = useOpticsStoreStore();
  const [count, setCount] = useState(1);

  return (
    <div className="mt-[10px] text-center">
      <title>overwrite title</title>
      <button
        onClick={() => router.push('/test/ui')}
        className={cn(styles.testButton, 'test-button-local')}
      >
        跳转UI页面
      </button>
      <button
        onClick={() => router.push('/test/cache')}
        className={cn(styles.testButton, 'test-button-local')}
      >
        cache页面
      </button>
      <button
        onClick={() => (window.location.href = '/sub/test/cache')}
        className={cn(styles.testButton, 'test-button-local')}
      >
        cache页面2
      </button>
      <button
        onClick={async () => {
          const data = await requestApi.getList({ params: { id: 'id' } });
          console.log(data);
        }}
        className={cn(styles.testButton, 'test-button-local')}
      >
        请求接口
      </button>
      <div className={styles.optics}>
        <div>
          optics-ts适用于需要对大型嵌套对象进行深度操作，且希望代码类型安全、易读的场景。
        </div>
        <div className="test-scss">
          <button
            className="test-button-local"
            onClick={() => {
              setCount(count + 1);
              setABC(`c${count}`);
              console.log('setABC getAllData:', JSON.stringify(getAllData()));
            }}
          >
            setABC
          </button>
          <button
            className="test-button-local"
            onClick={() => {
              setCount(count + 1);
              setBCDF(count);
              console.log('setBCDF getAllData:', JSON.stringify(getAllData()));
            }}
          >
            setBCADF
          </button>
        </div>
      </div>

      <Icon name="help" className={cn('block', styles.svgCenter)} />
      <Icon
        name="dir1/apply"
        className={cn('block', styles.svgCenter)}
        width={100}
        height={100}
      />
      <Icon
        name="dir1/apply"
        className={cn('block', styles.svgCenter, styles.yellow)}
        width={100}
        height={100}
      />
    </div>
  );
};

export default Index;
