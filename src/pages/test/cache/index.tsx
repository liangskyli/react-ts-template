import { useEffect, useState } from 'react';
import { useNavigationType } from 'react-router';
import Button from '@/components/core/components/button';
import { useCreateLRUCache } from '@/components/core/components/cache';
import Checkbox from '@/components/core/components/checkbox';
import { useRouter } from '@/hooks/use-router.ts';
import ListDemo from '@/pages/test/cache/components/list-demo.tsx';
import VirtualGridDemo from '@/pages/test/cache/components/virtual-grid-demo.tsx';

const Index = () => {
  const router = useRouter();
  const getNavigationType = useNavigationType();

  const cache1 = useCreateLRUCache<string, string[]>('instanceId');

  const [groupValue, setGroupValue] = useState<string[]>(() => {
    console.log('getNavigationType:', getNavigationType);
    if (getNavigationType === 'POP') {
      // 后退
      const cachedValue = cache1.get('groupValue');
      if (cachedValue && cachedValue.length > 0) {
        return cachedValue;
      } else {
        const sessionGroupValue = window.sessionStorage.getItem('groupValue');
        if (sessionGroupValue) {
          let sessionGroupParseValue: string[] = [];
          try {
            sessionGroupParseValue = JSON.parse(sessionGroupValue);
          } catch {
            /* empty */
          }
          if (sessionGroupParseValue.length > 0) {
            return sessionGroupParseValue;
          }
        }
      }
    } else {
      // remove cache
      cache1.delete('groupValue');
      window.sessionStorage.removeItem('groupValue');
    }
    return [];
  });

  useEffect(() => {
    cache1.set('groupValue', groupValue);
    // 存session
    window.sessionStorage.setItem('groupValue', JSON.stringify(groupValue));
  }, [cache1, groupValue]);

  const onClickGet = () => {
    console.log('groupValue:', cache1.get('groupValue'));
    console.log('cache1 entries:', Array.from(cache1.entries()));
  };
  return (
    <div className="mt-[10px] text-center">
      <Checkbox.Group
        value={groupValue}
        onChange={(value) => setGroupValue(value as unknown as string[])}
      >
        <Checkbox value="1">选项1</Checkbox>
        <Checkbox value="2">选项2</Checkbox>
        <Checkbox value="3">选项3</Checkbox>
      </Checkbox.Group>
      <Button onClick={onClickGet}>获取缓存</Button>
      <Button
        onClick={() => {
          router.push('/test/cache2');
        }}
      >
        前进cache2
      </Button>
      <Button
        onClick={() => {
          router.push('/test/cache3');
        }}
      >
        前进cache3
      </Button>
      <Button
        onClick={() => {
          window.location.href = '/sub/test/ui';
        }}
      >
        非路由前进
      </Button>
      <div>
        <VirtualGridDemo />
        <ListDemo />
      </div>
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
  );
};

export default Index;
