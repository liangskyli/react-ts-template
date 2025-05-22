import Button from '@/components/button';
import Popover from '@/components/popover/index.tsx';

const PopoverDemo = () => {
  return (
    <div className="tw-px-2 tw-pb-2">
      <div>Popover：</div>
      <div className="tw-text-left">
        <Popover
          className="tw-mr-1"
          content={
            <div className="tw-w-[150px]">
              <h3 className="tw-mb-2 tw-font-medium">标题</h3>
              <p className="tw-text-gray-600">这是一个自定义内容的 Popover</p>
            </div>
          }
          placement="top-start"
          defaultVisible
        >
          <Button>顶部开始部弹出</Button>
        </Popover>
        <Popover
          contentClassName="tw-p-0"
          content={(setOpen) => (
            <div className="tw-h-[80px] tw-w-[150px] tw-overflow-y-auto">
              <Button
                variant="ghost"
                className="tw-w-full tw-border-none tw-bg-opacity-0 tw-text-[16px] tw-text-main before:tw-rounded-none before:tw-rounded-t-lg hover:tw-bg-opacity-0"
                onClick={() => {
                  setOpen(false);
                }}
              >
                title1
              </Button>
              <Button
                variant="ghost"
                className="tw-w-full tw-border-none tw-bg-opacity-0 tw-text-[16px] tw-text-main before:tw-rounded-none hover:tw-bg-opacity-0"
              >
                title2
              </Button>
              <Button
                variant="ghost"
                className="tw-w-full tw-border-none tw-bg-opacity-0 tw-text-[16px] tw-text-main before:tw-rounded-none before:tw-rounded-b-lg hover:tw-bg-opacity-0"
              >
                title3
              </Button>
            </div>
          )}
          placement="bottom"
          closeOnOutsideClick={false}
        >
          <Button>自定义弹出</Button>
        </Popover>
      </div>
      <div className="tw-relative tw-h-[300px] tw-overflow-auto">
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <Popover
          content={
            <div className="tw-w-[100px] tw-text-white">
              这是一个简单的 Popover 内容
            </div>
          }
          placement={'right'}
          contentClassName="tw-bg-black/75"
          className="tw-mr-2"
          arrow={{
            bgColor: 'rgba(0,0,0,0.75)',
          }}
          getContainer={null}
        >
          <Button>右边弹出</Button>
        </Popover>
        <Popover
          content={
            <div className="tw-w-[150px]">
              <h3 className="tw-mb-2 tw-font-medium">标题</h3>
              <p className="tw-text-gray-600">这是一个自定义内容的 Popover</p>
            </div>
          }
          placement="bottom"
          getContainer={null}
        >
          <Button>底部弹出</Button>
        </Popover>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </div>
    </div>
  );
};

export default PopoverDemo;
