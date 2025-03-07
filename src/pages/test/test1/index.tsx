import { useState } from 'react';
import classNames from 'classnames';
import Icon from '@/components/icon';
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
    <div className="txt-center mt10">
      <title>overwrite title</title>
      <button
        onClick={() => router.push('/index')}
        className={classNames(styles.testButton, 'test-button-local')}
      >
        跳转测试页面
      </button>
      <button
        onClick={async () => {
          const data = await requestApi.getList({ params: { id: 'id' } });
          console.log(data);
        }}
        className={classNames(styles.testButton, 'test-button-local')}
      >
        请求接口
      </button>
      <div className={styles.optics}>
        <div>
          optics-ts适用于需要对大型嵌套对象进行深度操作，且希望代码类型安全、易读的场景。
        </div>
        <div className="test-scss">
          <button
            onClick={() => {
              setCount(count + 1);
              setABC(`c${count}`);
              console.log('setABC getAllData:', JSON.stringify(getAllData()));
            }}
          >
            setABC
          </button>
          <button
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

      <Icon name="help" className={classNames('block', styles.svgCenter)} />
      <Icon
        name="dir1/apply"
        className={classNames('block', styles.svgCenter)}
        width={100}
        height={100}
      />
      <Icon
        name="dir1/apply"
        className={classNames('block', styles.svgCenter, styles.yellow)}
        width={100}
        height={100}
      />
    </div>
  );
};

export default Index;
