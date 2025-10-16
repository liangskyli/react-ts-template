import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import Button from '@/components/core/components/button';
import Typewriter, {
  useTypewriterText,
} from '@/components/core/components/typewriter';

const Card = ({ dataIndex }: { dataIndex: number }) => {
  return (
    <div>
      {dataIndex}
      获取到的数据：上海易居房地产研究院副院长严跃进对时代周报记者指出，
      <span className="tw-text-blue-600">通州</span>作为北京城市副中心。
    </div>
  );
};

const TypewriterDemo = () => {
  const [dataIndex, setDataIndex] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { text: typewriterText, getInstance } = useTypewriterText({
    children: '开始演示：',
    //className: 'before:!content-none',
    options: { cursor: false },
  });
  const scrollTimeout = useRef(-1);
  const [isStreamProcess, setIsStreamProcess] = useState(false);
  const scrollToBottomRef = useRef<() => void>(null);

  const scrollToBottom = useCallback(() => {
    scrollRef.current!.scrollTop = scrollRef.current!.scrollHeight;
    scrollTimeout.current = setTimeout(() => {
      scrollToBottomRef.current?.();
    }, 50) as unknown as number;
  }, []);

  useLayoutEffect(() => {
    scrollToBottomRef.current = scrollToBottom;
  });
  const getStreamData = () => {
    const instance = getInstance();
    if (instance) {
      const div = document.createElement('div');
      const root = createRoot(div);
      flushSync(() => {
        root.render(<Card dataIndex={dataIndex} />);
      });
      const html = div.innerHTML;
      root.unmount();
      setIsStreamProcess(true);
      instance.type(html).flush(() => {});
      const html2 = `<div>aaa</div>`;
      instance.type(html2).flush(() => {
        console.log(`${dataIndex}end`);
        setIsStreamProcess(false);
      });

      setDataIndex(dataIndex + 1);
    }
  };
  useEffect(() => {
    if (isStreamProcess) {
      scrollToBottom();
    }
    return () => {
      clearTimeout(scrollTimeout.current);
    };
  }, [scrollToBottom, isStreamProcess]);

  return (
    <div className="tw-space-y-8 tw-p-6">
      <h1 className="tw-text-3xl tw-font-bold tw-text-gray-900">
        Typewriter 控件演示
      </h1>

      <div className="tw-space-y-8">
        {/* 基础 */}
        <div>
          <h2 className="tw-mb-4 tw-text-lg tw-font-semibold">基础</h2>
          <div className="tw-text-left">
            <Typewriter>This will be typed in a `span` element!</Typewriter>
          </div>
        </div>

        {/* 不显示光标 */}
        <div>
          <h2 className="tw-mb-4 tw-text-lg tw-font-semibold">不显示光标</h2>
          <Typewriter
            className="tw-text-left before:!tw-content-none"
            options={{ cursor: false }}
          >
            <div>
              This will be typed in a `div`
              <span className="tw-text-green-500">element</span>!
            </div>
            <div>
              This will be typed in a `div`
              <span className="tw-text-red-600">element</span>!
            </div>
          </Typewriter>
        </div>

        {/* 动态获取数据 */}
        <div>
          <h2 className="tw-mb-4 tw-text-lg tw-font-semibold">动态获取数据</h2>
          <div
            ref={scrollRef}
            className="tw-max-h-[100px] tw-overflow-y-auto tw-text-left"
          >
            {typewriterText}
          </div>
          <Button onClick={getStreamData}>获取数据</Button>
        </div>
      </div>
    </div>
  );
};

export default TypewriterDemo;
