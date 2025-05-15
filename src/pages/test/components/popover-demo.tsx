import Button from '@/components/button';
import Popover from '@/components/popover/index.tsx';

const PopoverDemo = () => {
  return (
    <div className="px-2 pb-2">
      <div>Popover：</div>
      <div className="text-left">
        <Popover
          className="mr-1"
          content={
            <div className="w-[150px]">
              <h3 className="mb-2 font-medium">标题</h3>
              <p className="text-gray-600">这是一个自定义内容的 Popover</p>
            </div>
          }
          placement="top-start"
          defaultVisible
        >
          <Button>顶部开始部弹出</Button>
        </Popover>
        <Popover
          contentClassName="p-0"
          content={(setOpen) => (
            <div className="h-[80px] w-[150px] overflow-y-auto">
              <Button
                variant="ghost"
                className="w-full border-none bg-opacity-0 text-[16px] text-main before:rounded-none before:rounded-t-lg hover:bg-opacity-0"
                onClick={() => {
                  setOpen(false);
                }}
              >
                title1
              </Button>
              <Button
                variant="ghost"
                className="w-full border-none bg-opacity-0 text-[16px] text-main before:rounded-none hover:bg-opacity-0"
              >
                title2
              </Button>
              <Button
                variant="ghost"
                className="w-full border-none bg-opacity-0 text-[16px] text-main before:rounded-none before:rounded-b-lg hover:bg-opacity-0"
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
      <div className="relative h-[300px] overflow-auto">
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
            <div className="w-[100px] text-white">
              这是一个简单的 Popover 内容
            </div>
          }
          placement={'right'}
          contentClassName="bg-black/75"
          className="mr-2"
          arrow={{
            bgColor: 'rgba(0,0,0,0.75)',
          }}
          getContainer={null}
        >
          <Button>右边弹出</Button>
        </Popover>
        <Popover
          content={
            <div className="w-[150px]">
              <h3 className="mb-2 font-medium">标题</h3>
              <p className="text-gray-600">这是一个自定义内容的 Popover</p>
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
