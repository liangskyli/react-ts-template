import { useState } from 'react';
import { cn } from '@/components/core/class-config';
import Icon from '@/components/core/components/icon';
import { useRouter } from '@/hooks/use-router.ts';
import { useOpticsStoreStore } from '@/store';
import requestApi from '@/services/api';
import { requestApi as genRequestApi } from '@/services/gen-example/schema-api/request-api.ts';
import './index.less';
import styles from './index.module.less';

const Index = () => {
  const router = useRouter();
  const { setABC, getAllData, setBCDF } = useOpticsStoreStore();
  const [count, setCount] = useState(1);
  const [streamData, setStreamData] = useState<string>('');

  const axiosStreamExample = async () => {
    try {
      setStreamData('✅ Axios + Fetch Adapter 真正的流式处理\n');
      setStreamData(
        (prev) =>
          `${prev}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
          `✅ 使用 axios 的 fetch adapter\n` +
          `✅ 配置 responseType: stream\n` +
          `✅ response.data 是 ReadableStream\n` +
          `✅ 可以逐块读取和处理数据\n\n`,
      );

      const response = await requestApi.streamData({});

      // 获取 ReadableStream
      const stream = response.data;

      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let receivedLength = 0;
      let chunkCount = 0;

      setStreamData((prev) => prev + '开始接收流式数据...\n');

      // 逐块读取流式数据
      const startTime = Date.now();
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        // 解码当前数据块
        const chunk = decoder.decode(value, { stream: true });
        receivedLength += value.length;
        chunkCount++;

        const elapsed = Date.now() - startTime;

        // 实时更新显示 - 完整显示每个数据块
        setStreamData((prev) => {
          return `${prev}[${elapsed}ms] 数据块 #${chunkCount} (${value.length} bytes):\n${chunk}\n`;
        });
      }

      setStreamData(
        (prev) =>
          `${prev}\n✅ Axios 流式传输完成！\n📊 统计: 共接收 ${chunkCount} 个数据块, ${receivedLength} bytes\n`,
      );
      console.log('axios stream 完成');
    } catch (error) {
      console.error('axios stream 错误:', error);
      setStreamData((prev) => prev + `\n❌ 错误: ${error}\n`);
    }
  };

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
          const genData = await genRequestApi['/v1/card/delete'].post({
            data: { betaRoundId: 1 },
          });
          console.log(genData);
        }}
        className={cn(styles.testButton, 'test-button-local')}
      >
        请求接口
      </button>
      <div className={styles.optics}>
        <div>
          optics-ts适用于需要对大型嵌套对象进行深度操作，且希望代码类型安全、易读的场景。
        </div>
        <div className="p-[10px]">
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

      {/* 流请求演示 */}
      <div className="mt-[20px] border-gray-300 p-[10px]">
        <h3 className="mb-2 text-lg font-bold">流式请求演示</h3>
        <p className="mb-4 text-sm text-gray-600">
          <br />• <strong>Axios + Fetch Adapter</strong>: 通过配置 adapter:
          &apos;fetch&apos; 和 responseType: &apos;stream&apos;
        </p>

        <div className="mb-4 space-x-2">
          <button
            onClick={async () => {
              const data = await requestApi.noStreamData({
                customOptions: { isResponseStringSerializedObj: true },
              });
              console.log('data:', data);
            }}
            className="test-button-local"
          >
            普通请求
          </button>
          <button onClick={axiosStreamExample} className="test-button-local">
            Axios流式
          </button>

          <button
            onClick={() => {
              setStreamData('');
            }}
            className="test-button-local"
          >
            清空结果
          </button>
        </div>

        {/* 流数据展示 */}
        {streamData && (
          <div className="mt-4">
            <div className="mb-2 text-sm font-bold">接收到的数据:</div>
            <pre className="max-h-[400px] overflow-auto rounded bg-gray-100 p-4 text-xs">
              {streamData}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
