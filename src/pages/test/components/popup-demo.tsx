import { useState } from 'react';
import Button from '@/components/core/components/button';
import Popover from '@/components/core/components/popover';
import Popup from '@/components/core/components/popup';
import Toast from '@/components/core/components/toast';

const PopupDemo = () => {
  const [visibleCenterPopup, setVisibleCenterPopup] = useState(false);
  const [visibleBottomPopup, setVisibleBottomPopup] = useState(false);
  const [visibleRightPopup, setVisibleRightPopup] = useState(false);
  return (
    <>
      <div className="flex flex-wrap gap-2 px-2 pb-2">
        <Button
          className=""
          onClick={() => {
            const popup1 = Popup.show(
              <>
                <div className="px-4 pt-5">
                  <div className="mb-4 text-center text-lg font-medium">
                    标题
                  </div>
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
        <Button onClick={() => setVisibleRightPopup(true)}>右边弹出层</Button>
      </div>
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
          <div className="mb-2">
            <Popover
              content={
                <div className="w-[150px]">
                  <h3 className="mb-2 font-medium">标题</h3>
                  <p className="text-gray-600">这是一个自定义内容的 Popover</p>
                </div>
              }
              placement="top"
            >
              <Button>顶部部弹出</Button>
            </Popover>
          </div>
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
        bodyClassName="max-h-none"
      >
        <div className="relative">
          <div className="absolute left-0 right-0 top-[-30px] h-[30px] px-4">
            head
          </div>
          <div
            className="mt-[30px] overflow-auto pb-safe-area"
            style={{ maxHeight: 'calc(80vh - 30px)' }}
          >
            <div className="px-4 pb-4">{'这里是弹出层内容'.repeat(100)} </div>
          </div>
        </div>
      </Popup>

      <Popup
        visible={visibleRightPopup}
        onClose={() => setVisibleRightPopup(false)}
        position="right"
      >
        <div className="relative">
          <div className="absolute left-0 right-0 top-[-30px] h-[30px] px-4">
            head
          </div>
          <div
            className="mt-[30px] overflow-auto pb-safe-area"
            style={{ maxHeight: 'calc(100vh - 30px)' }}
          >
            <div className="px-4 pb-4">{'这里是弹出层内容'.repeat(100)}</div>
          </div>
        </div>
      </Popup>
    </>
  );
};
export default PopupDemo;
