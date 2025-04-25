import { useState } from 'react';
import Icon from '@/components/icon';
import Popup from '@/components/popup';
import Toast from '@/components/toast';
import { useRouter } from '@/hooks/use-router.ts';
import { useOpticsStoreStore } from '@/store';
import requestApi from '@/services/api';
import { cn } from '@/utils/styles.ts';
import './index.less';
import styles from './index.module.less';
import './index.scss';

const Index = () => {
  const router = useRouter();
  const { setABC, getAllData, setBCDF } = useOpticsStoreStore();
  const [count, setCount] = useState(1);

  const [visibleCenterPopup, setVisibleCenterPopup] = useState(false);
  const [visibleBottomPopup, setVisibleBottomPopup] = useState(false);
  return (
    <div className="mt-[10px] text-center">
      <title>overwrite title</title>
      <button
        className="mx-auto mt-4 block rounded bg-red px-4 py-2 text-sm text-white"
        onClick={() => setVisibleCenterPopup(true)}
      >
        显示中间弹出层
      </button>
      <Popup
        visible={visibleCenterPopup}
        onClose={() => setVisibleCenterPopup(false)}
        className="w-[300px]"
        position="center"
      >
        <div className="p-4" onClick={() => console.log('content')}>
          <h3 className="mb-2 text-lg font-bold">标题</h3>
          <p>这里是弹出层内容</p>
          <button
            className="mx-auto mt-4 block rounded bg-red px-4 py-2 text-sm text-white"
            onClick={() => setVisibleCenterPopup(false)}
          >
            关闭
          </button>
        </div>
      </Popup>
      <button
        className="mx-auto mt-4 block rounded bg-red px-4 py-2 text-sm text-white"
        onClick={() => setVisibleBottomPopup(true)}
      >
        显示底部弹出层
      </button>
      <Popup
        visible={visibleBottomPopup}
        onClose={() => setVisibleBottomPopup(false)}
        position="bottom"
      >
        <div className="p-4">
          这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容
        </div>
      </Popup>
      <button
        className="mx-auto mt-4 block rounded bg-red px-4 py-2 text-sm text-white"
        onClick={() => {
          Toast.show('这是一条提示消息', {
            duration: 3000,
            maskClickable: true,
            afterClose: () => {
              console.log('afterClose');
            },
          });
        }}
      >
        显示Toast1
      </button>
      <button
        className="mx-auto mb-10 mt-4 block rounded bg-red px-4 py-2 text-sm text-white"
        onClick={() => {
          Toast.show('这是一条提示消息2222', {
            duration: 3000,
            destroyOnClose: false,
            maskClickable: true,
            getContainer: document.querySelector('#root')!,
          });
        }}
      >
        显示Toast2
      </button>
      <button
        onClick={() => router.push('/index')}
        className={cn(styles.testButton, 'test-button-local')}
      >
        跳转测试页面
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
