import { useState } from 'react';
import Button from '@/components/button';
import Popover from '@/components/popover';
import Popup from '@/components/popup';
import Toast from '@/components/toast';

const PopupDemo = () => {
  const [visibleCenterPopup, setVisibleCenterPopup] = useState(false);
  const [visibleBottomPopup, setVisibleBottomPopup] = useState(false);
  const [visibleRightPopup, setVisibleRightPopup] = useState(false);
  return (
    <>
      <div className="tw-flex tw-flex-wrap tw-gap-2 tw-px-2 tw-pb-2">
        <Button
          className=""
          onClick={() => {
            const popup1 = Popup.show(
              <>
                <div className="tw-px-4 tw-pt-5">
                  <div className="tw-mb-4 tw-text-center tw-text-lg tw-font-medium">
                    标题
                  </div>
                  <div className="tw-mb-5 tw-text-center tw-text-base tw-text-gray-600">
                    这里是弹出层内容
                  </div>
                </div>
                <div className="tw-flex tw-border-t tw-border-gray-200">
                  <Button
                    className="tw-flex-1 tw-rounded-none tw-bg-white tw-text-base tw-font-normal tw-text-gray-600 before:tw-rounded-none hover:tw-bg-gray-50"
                    onClick={() => popup1.close()}
                  >
                    取消
                  </Button>
                  <div className="tw-relative tw-z-10 tw-w-[1px] tw-bg-gray-200" />
                  <Button
                    className="tw-flex-1 tw-rounded-none tw-bg-white tw-text-base tw-font-normal tw-text-red before:tw-rounded-none hover:tw-bg-gray-50"
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
                bodyClassName: 'tw-w-[280px] tw-rounded-lg tw-bg-white',
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
        bodyClassName="tw-w-[300px]"
        position="center"
        destroyOnClose
        closeOnMaskClick={false}
        afterClose={() => console.log('弹出层已关闭')}
      >
        <div className="tw-p-4" onClick={() => console.log('content')}>
          <h3 className="tw-mb-2 tw-text-lg tw-font-bold">标题</h3>
          <p>这里是弹出层内容</p>
          <div className="tw-mb-2">
            <Popover
              content={
                <div className="tw-w-[150px]">
                  <h3 className="tw-mb-2 tw-font-medium">标题</h3>
                  <p className="tw-text-gray-600">
                    这是一个自定义内容的 Popover
                  </p>
                </div>
              }
              placement="top"
            >
              <Button>顶部部弹出</Button>
            </Popover>
          </div>
          <div className="tw-flex tw-flex-col tw-space-y-2">
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
        bodyClassName="tw-max-h-none"
      >
        <div className="tw-relative">
          <div className="tw-absolute tw-left-0 tw-right-0 tw-top-[-30px] tw-h-[30px] tw-px-4">
            head
          </div>
          <div
            className="tw-mt-[30px] tw-overflow-auto tw-pb-safe-area"
            style={{ maxHeight: 'calc(80vh - 30px)' }}
          >
            <div className="tw-px-4 tw-pb-4">
              {'这里是弹出层内容'.repeat(100)}{' '}
            </div>
          </div>
        </div>
      </Popup>

      <Popup
        visible={visibleRightPopup}
        onClose={() => setVisibleRightPopup(false)}
        position="right"
      >
        <div className="tw-relative">
          <div className="tw-absolute tw-left-0 tw-right-0 tw-top-[-30px] tw-h-[30px] tw-px-4">
            head
          </div>
          <div
            className="tw-mt-[30px] tw-overflow-auto tw-pb-safe-area"
            style={{ maxHeight: 'calc(100vh - 30px)' }}
          >
            <div className="tw-px-4 tw-pb-4">
              {'这里是弹出层内容'.repeat(100)}
            </div>
          </div>
        </div>
      </Popup>
    </>
  );
};
export default PopupDemo;
