import { useState } from 'react';
import { Button } from '@headlessui/react';
import { useRouter } from '@/hooks/use-router.ts';
import reactLogo from '@/assets/react.svg';
import './index.css';
import viteLogo from '/vite.svg';

const Index = () => {
  const [count, setCount] = useState(0);
  const router = useRouter();
  return (
    <div className="pg-home">
      <div>
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="h-10 w-10" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="my-2 h-10 w-10" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="p-4">
        <Button
          className="rounded bg-red px-4 py-2 text-sm text-white hover:bg-red-600"
          onClick={() => setCount((count) => count + 1)}
        >
          count is {count}
        </Button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="text-secondary">
        Click on the Vite and React logos to learn more
      </p>
      <Button
        className="px-4 py-2 text-[20px] text-link"
        onClick={() => router.push('/test/test1')}
      >
        跳转测试页面
      </Button>
    </div>
  );
};

export default Index;
