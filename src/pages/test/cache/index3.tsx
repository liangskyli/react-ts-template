import Button from '@/components/core/components/button';
import { useRouter } from '@/hooks/use-router.ts';
import MultiGridDemo3 from '@/pages/test/cache/components/virtual-grid-demo3.tsx';

const Index = () => {
  const router = useRouter();

  return (
    <div
      className="mt-[10px] flex flex-col text-center"
      style={{ height: 'calc(100vh - 24px)' }}
    >
      <div>
        <Button
          onClick={() => {
            router.push('/test/ui');
          }}
        >
          前进
        </Button>
        <Button
          onClick={() => {
            window.location.href = '/sub/test/ui';
          }}
        >
          前进2
        </Button>
      </div>
      <MultiGridDemo3 />
    </div>
  );
};

export default Index;
