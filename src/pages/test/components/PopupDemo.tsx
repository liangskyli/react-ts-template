import { useState } from 'react';
import Button from '@/components/button';
import Popup from '@/components/popup';
import Toast from '@/components/toast';

const PopupDemo = () => {
  const [visibleCenterPopup, setVisibleCenterPopup] = useState(false);
  const [visibleBottomPopup, setVisibleBottomPopup] = useState(false);
  return (
    <div className="space-x-2 px-2 pb-2">
      <Button
        onClick={() => {
          const popup1 = Popup.show(
            <>
              <div className="px-4 pt-5">
                <div className="mb-4 text-center text-lg font-medium">标题</div>
                <div className="mb-5 text-center text-base text-gray-600">
                  这里是弹出层内容
                </div>
              </div>
              <div className="flex border-t border-gray-200">
                <Button
                  className="flex-1 rounded-none bg-white text-base font-normal text-gray-600 before:rounded-none hover:bg-gray-50"
                  onClick={() => popup1.close()}
                >
                  取消
                </Button>
                <div className="relative z-10 w-[1px] bg-gray-200" />
                <Button
                  className="flex-1 rounded-none bg-white text-base font-normal text-red before:rounded-none hover:bg-gray-50"
                  onClick={() => {
                    Toast.show('dialog toast1', {
                      afterClose: () => {
                        console.log('afterClose dialog toast1');
                      },
                    });
                  }}
                >
                  确定
                </Button>
              </div>
            </>,
            {
              position: 'center',
              bodyClassName: 'w-[280px] rounded-lg bg-white',
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
