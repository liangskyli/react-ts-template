import { useState } from 'react';
import Button from '@/components/button';
import Popup from '@/components/popup';
import Toast from '@/components/toast';

const PopupDemo = () => {
  const [visibleCenterPopup, setVisibleCenterPopup] = useState(false);
  const [visibleBottomPopup, setVisibleBottomPopup] = useState(false);
  return (
    <div className="mt-2 space-x-2">
      <Button
        onClick={() => {
          const popup1 = Popup.show(
            <div className="p-4">
              <h3 className="mb-2 text-lg font-bold">标题</h3>
              <p>这里是弹出层内容</p>
              <div className="flex flex-col space-y-2">
                <Button
                  onClick={() => {
                    Toast.show('dialog toast1', {
                      afterClose: () => {
                        console.log('afterClose dialog toast1');
                      },
                    });
                  }}
                >
                  dialog toast1
                </Button>
                <Button onClick={() => popup1.close()}>关闭</Button>
              </div>
            </div>,
            {
              position: 'center',
              afterClose: () => console.log('弹出层已关闭'),
              closeOnMaskClick: false,
            },
          );
        }}
      >
        指令弹出层
      </Button>
      <Button onClick={() => setVisibleCenterPopup(true)}>中间弹出层</Button>
      <Button onClick={() => setVisibleBottomPopup(true)}>底部弹出层</Button>
      <Popup
        visible={visibleCenterPopup}
        onClose={() => setVisibleCenterPopup(false)}
        bodyClassName="w-[300px]"
        position="center"
        destroyOnClose
        closeOnMaskClick={false}
        afterClose={() => console.log('弹出层已关闭')}
      >
        <div className="p-4" onClick={() => console.log('content')}>
          <h3 className="mb-2 text-lg font-bold">标题</h3>
          <p>这里是弹出层内容</p>
          <div className="flex flex-col space-y-2">
            <Button
              onClick={() => {
                Toast.show('dialog toast2', {
                  afterClose: () => {
                    console.log('afterClose dialog toast2');
                  },
                });
              }}
            >
              dialog toast2
            </Button>
            <Button onClick={() => setVisibleCenterPopup(false)}>关闭</Button>
          </div>
        </div>
      </Popup>

      <Popup
        visible={visibleBottomPopup}
        onClose={() => setVisibleBottomPopup(false)}
        position="bottom"
      >
        <div className="p-4">
          这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容这里是底部弹出层内容
        </div>
      </Popup>
    </div>
  );
};
export default PopupDemo;
