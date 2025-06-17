import Badge from '@/components/core/components/badge';

const BadgeDemo = () => {
  return (
    <div className="tw-space-y-8 tw-p-8">
      <h1 className="tw-text-3xl tw-font-bold tw-text-gray-900">
        Badge 组件示例
      </h1>

      {/* 基础用法 */}
      <section className="tw-space-y-4">
        <h2 className="tw-text-xl tw-font-semibold tw-text-gray-800">
          基础用法
        </h2>
        <div className="tw-space-x-2">
          <Badge content="默认">
            <div className="tw-size-14 tw-rounded-lg tw-bg-[#eee]" />
          </Badge>
          <Badge content="5">
            <div className="tw-size-14 tw-rounded-lg tw-bg-[#eee]" />
          </Badge>
          <Badge content="99+">
            <div className="tw-size-14 tw-rounded-lg tw-bg-[#eee]" />
          </Badge>
        </div>
      </section>

      {/* 不显示 */}
      <section className="tw-space-y-4">
        <h2 className="tw-text-xl tw-font-semibold tw-text-gray-800">不显示</h2>
        <div className="tw-space-x-2">
          <Badge content="">
            <div className="tw-size-14 tw-rounded-lg tw-bg-[#eee]" />
          </Badge>
        </div>
      </section>

      {/* 不同颜色 */}
      <section className="tw-space-y-4">
        <h2 className="tw-text-xl tw-font-semibold tw-text-gray-800">
          不同颜色
        </h2>
        <div className="tw-space-x-2">
          <Badge content="蓝色" className="tw-bg-blue-500">
            <div className="tw-size-14 tw-rounded-lg tw-bg-[#eee]" />
          </Badge>
          <Badge content="绿色" className="tw-bg-green-500">
            <div className="tw-size-14 tw-rounded-lg tw-bg-[#eee]" />
          </Badge>
        </div>
      </section>

      {/* 不同尺寸 */}
      <section className="tw-space-y-4">
        <h2 className="tw-text-xl tw-font-semibold tw-text-gray-800">
          不同尺寸
        </h2>
        <div className="tw-space-x-2">
          <Badge content="默认">
            <div className="tw-size-14 tw-rounded-lg tw-bg-[#eee]" />
          </Badge>
          <Badge
            content="大号"
            className="-tw-right-2.5 -tw-top-2.5 tw-text-sm"
          >
            <div className="tw-size-14 tw-rounded-lg tw-bg-[#eee]" />
          </Badge>
        </div>
      </section>

      {/* 圆点模式 */}
      <section className="tw-space-y-4">
        <h2 className="tw-text-xl tw-font-semibold tw-text-gray-800">
          圆点模式
        </h2>
        <div className="tw-flex tw-items-center tw-space-x-4">
          <Badge isDot className="tw-text-sm">
            <div className="tw-size-14 tw-rounded-lg tw-bg-[#eee]" />
          </Badge>
          <Badge isDot>
            <button className="tw-rounded tw-bg-blue-500 tw-px-4 tw-py-2 tw-text-white">
              消息
            </button>
          </Badge>
        </div>
        <div className="tw-flex tw-items-center tw-space-x-6">
          <div className="tw-flex tw-items-center">
            <Badge
              isDot
              className="-tw-left-[14px] tw-top-[6px] tw-bg-green-500"
            >
              <span>在线</span>
            </Badge>
          </div>
          <div className="tw-flex tw-items-center">
            <Badge isDot className="-tw-left-[14px] tw-top-[6px]">
              <span>离线</span>
            </Badge>
          </div>
          <div className="tw-flex tw-items-center">
            <Badge
              isDot
              className="-tw-left-[14px] tw-top-[6px] tw-bg-yellow-500"
            >
              <span>忙碌</span>
            </Badge>
          </div>
        </div>
      </section>

      {/* 独立模式 */}
      <section className="tw-space-y-4">
        <h2 className="tw-text-xl tw-font-semibold tw-text-gray-800">
          独立使用
        </h2>
        <div className="tw-space-x-2">
          <Badge content="默认" />
          <Badge
            className="tw-bg-purple-100 tw-text-purple-800"
            content="自定义颜色"
          />
          <Badge
            className="tw-border tw-border-blue-300 tw-bg-transparent tw-text-blue-600"
            content="边框样式"
          />
          <Badge
            className="tw-bg-gradient-to-r tw-from-purple-400 tw-to-pink-400 tw-text-white"
            content="渐变徽标"
          />
        </div>
      </section>
    </div>
  );
};

export default BadgeDemo;
