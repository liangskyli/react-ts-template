import Badge from '@/components/core/components/badge';

const BadgeDemo = () => {
  return (
    <div className="space-y-8 p-8">
      <h1 className="text-3xl font-bold text-gray-900">Badge 组件示例</h1>

      {/* 基础用法 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">基础用法</h2>
        <div className="space-x-2">
          <Badge content="默认">
            <div className="size-14 rounded-lg bg-[#eee]" />
          </Badge>
          <Badge content="5">
            <div className="size-14 rounded-lg bg-[#eee]" />
          </Badge>
          <Badge content="99+">
            <div className="size-14 rounded-lg bg-[#eee]" />
          </Badge>
        </div>
      </section>

      {/* 不显示 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">不显示</h2>
        <div className="space-x-2">
          <Badge content="">
            <div className="size-14 rounded-lg bg-[#eee]" />
          </Badge>
        </div>
      </section>

      {/* 不同颜色 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">不同颜色</h2>
        <div className="space-x-2">
          <Badge content="蓝色" className="bg-blue-500">
            <div className="size-14 rounded-lg bg-[#eee]" />
          </Badge>
          <Badge content="绿色" className="bg-green-500">
            <div className="size-14 rounded-lg bg-[#eee]" />
          </Badge>
        </div>
      </section>

      {/* 不同尺寸 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">不同尺寸</h2>
        <div className="space-x-2">
          <Badge content="默认">
            <div className="size-14 rounded-lg bg-[#eee]" />
          </Badge>
          <Badge content="大号" className="-right-2.5 -top-2.5 text-sm">
            <div className="size-14 rounded-lg bg-[#eee]" />
          </Badge>
        </div>
      </section>

      {/* 圆点模式 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">圆点模式</h2>
        <div className="flex items-center space-x-4">
          <Badge isDot className="text-sm">
            <div className="size-14 rounded-lg bg-[#eee]" />
          </Badge>
          <Badge isDot>
            <button className="rounded bg-blue-500 px-4 py-2 text-white">
              消息
            </button>
          </Badge>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center">
            <Badge isDot className="-left-[14px] top-[6px] bg-green-500">
              <span>在线</span>
            </Badge>
          </div>
          <div className="flex items-center">
            <Badge isDot className="-left-[14px] top-[6px]">
              <span>离线</span>
            </Badge>
          </div>
          <div className="flex items-center">
            <Badge isDot className="-left-[14px] top-[6px] bg-yellow-500">
              <span>忙碌</span>
            </Badge>
          </div>
        </div>
      </section>

      {/* 独立模式 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">独立使用</h2>
        <div className="space-x-2">
          <Badge content="默认" />
          <Badge
            className="bg-purple-100 text-purple-800"
            content="自定义颜色"
          />
          <Badge
            className="border border-blue-300 bg-transparent text-blue-600"
            content="边框样式"
          />
          <Badge
            className="bg-gradient-to-r from-purple-400 to-pink-400 text-white"
            content="渐变徽标"
          />
        </div>
      </section>
    </div>
  );
};

export default BadgeDemo;
