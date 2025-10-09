import { useCallback, useEffect, useRef, useState } from 'react';
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
      <span className="text-blue-600">通州</span>作为北京城市副中心。
    </div>
  );
};

const TypewriterDemo = () => {
  const [dataIndex, setDataIndex] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { text: typewriterText, instance } = useTypewriterText({
    children: '开始演示：',
    //className: 'before:!content-none',
    options: { cursor: false },
  });
  const scrollTimeout = useRef(-1);
  const [isStreamProcess, setIsStreamProcess] = useState(false);
  const scrollToBottom = useCallback(() => {
    scrollRef.current!.scrollTop = scrollRef.current!.scrollHeight;
    scrollTimeout.current = setTimeout(() => {
      scrollToBottom();
    }, 50) as unknown as number;
  }, []);
  const getStreamData = () => {
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
    <div className="space-y-8 p-6">
      <h1 className="text-3xl font-bold text-gray-900">Typewriter 控件演示</h1>

      <div className="space-y-8">
        {/* 基础 */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">基础</h2>
          <div className="text-left">
            <Typewriter>This will be typed in a `span` element!</Typewriter>
          </div>
        </div>

        {/* 不显示光标 */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">不显示光标</h2>
          <Typewriter
            className="text-left before:!content-none"
            options={{ cursor: false }}
          >
            <div>
              This will be typed in a `div`
              <span className="text-green-500">element</span>!
            </div>
            <div>
              This will be typed in a `div`
              <span className="text-red-600">element</span>!
            </div>
          </Typewriter>
        </div>

        {/* 动态获取数据 */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">动态获取数据</h2>
          <div
            ref={scrollRef}
            className="max-h-[100px] overflow-y-auto text-left"
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
