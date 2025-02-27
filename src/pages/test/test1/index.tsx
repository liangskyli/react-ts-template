import classNames from 'classnames';
import Icon from '@/components/icon';
import { useRouter } from '@/hooks/use-router.ts';
import requestApi from '@/services/api';
import './index.less';
import styles from './index.module.less';

const Index = () => {
  const router = useRouter();
  return (
    <div className="txt-center mt10">
      <button
        onClick={() => router.push('/index')}
        className={`${styles.testButton} test-button-local`}
      >
        跳转测试页面
      </button>
      <button
        onClick={async () => {
          const data = await requestApi.getList({ params: { id: 'id' } });
          console.log(data);
        }}
        className={`${styles.testButton} test-button-local`}
      >
        请求接口
      </button>
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
