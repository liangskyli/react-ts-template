import Button from '@/components/button';
import Toast from '@/components/toast';

const ToastDemo = () => {
  return (
    <div className="my-2 space-x-2">
      <Button
        onClick={() => {
          Toast.show('这是一条提示消息显示Toast1', {
            duration: 3000,
            maskClickable: true,
            position: 'bottom',
            afterClose: () => {
              console.log('afterClose1');
            },
          });
        }}
      >
        显示Toast1
      </Button>
      <Button
        onClick={() => {
          Toast.show('这是一条提示消息2222', {
            duration: 3000,
            maskClickable: true,
            //getContainer: document.querySelector('#root')!,
            afterClose: () => {
              console.log('afterClose2');
            },
          });
        }}
      >
        显示Toast2
      </Button>
    </div>
  );
};
export default ToastDemo;
