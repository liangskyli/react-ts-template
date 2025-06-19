import { useState } from 'react';
import Steps from '@/components/core/components/steps';
import type { StepItem } from '@/components/core/components/steps';

const StepsDemo = () => {
  const [current, setCurrent] = useState(1);
  const [verticalCurrent, setVerticalCurrent] = useState(0);

  const basicItems: StepItem[] = [
    {
      title: '填写信息',
      description: '请填写基本信息',
    },
    {
      title: '确认信息',
      description: '请确认填写的信息',
    },
    {
      title: '完成',
      description: '信息提交成功',
    },
  ];

  const statusItems: StepItem[] = [
    {
      title: '成功步骤',
      description: '这一步已完成',
      status: 'finish',
    },
    {
      title: '当前步骤',
      description: '正在进行中',
      status: 'process',
    },
    {
      title: '错误步骤',
      description: '这一步出现了错误',
      status: 'error',
    },
    {
      title: '等待步骤',
      description: '等待执行',
      status: 'wait',
    },
  ];

  const customIconItems: StepItem[] = [
    {
      title: '登录',
      description: '用户登录',
      icon: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      title: '验证',
      description: '身份验证',
      icon: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      title: '完成',
      description: '操作完成',
      icon: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ];

  const disabledItems: StepItem[] = [
    {
      title: '步骤一',
      description: '可以点击',
    },
    {
      title: '步骤二',
      description: '当前步骤',
    },
    {
      title: '步骤三',
      description: '禁用状态',
      disabled: true,
    },
  ];

  return (
    <div className="space-y-8 p-4">
      <h1 className="text-3xl font-bold text-gray-900">Steps 步骤条组件示例</h1>

      {/* 基础用法 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">基础用法</h2>
        <div className="rounded-lg border bg-white p-6">
          <Steps items={basicItems} current={current} />
          <div className="mt-6 space-x-2">
            <button
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              onClick={() => setCurrent(Math.max(0, current - 1))}
              disabled={current === 0}
            >
              上一步
            </button>
            <button
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              onClick={() =>
                setCurrent(Math.min(basicItems.length - 1, current + 1))
              }
              disabled={current === basicItems.length - 1}
            >
              下一步
            </button>
          </div>
        </div>
      </section>

      {/* 垂直步骤条 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">垂直步骤条</h2>
        <div className="rounded-lg border bg-white p-6">
          <div className="flex">
            <div className="flex-1">
              <Steps
                items={basicItems}
                current={verticalCurrent}
                direction="vertical"
              />
            </div>
            <div className="ml-8 space-y-2">
              <button
                className="block rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                onClick={() =>
                  setVerticalCurrent(Math.max(0, verticalCurrent - 1))
                }
                disabled={verticalCurrent === 0}
              >
                上一步
              </button>
              <button
                className="block rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                onClick={() =>
                  setVerticalCurrent(
                    Math.min(basicItems.length - 1, verticalCurrent + 1),
                  )
                }
                disabled={verticalCurrent === basicItems.length - 1}
              >
                下一步
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 可点击的步骤条 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">可点击的步骤条</h2>
        <div className="rounded-lg border bg-white p-6">
          <Steps
            items={basicItems}
            current={current}
            clickable
            onChange={setCurrent}
          />
          <p className="mt-4 text-gray-600">点击步骤可以直接跳转</p>
        </div>
      </section>

      {/* 自定义状态 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">自定义状态</h2>
        <div className="rounded-lg border bg-white p-6">
          <Steps items={statusItems} />
        </div>
      </section>

      {/* 自定义图标 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">自定义图标</h2>
        <div className="rounded-lg border bg-white p-6">
          <Steps items={customIconItems} current={1} />
        </div>
      </section>

      {/* 禁用某些步骤 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">禁用某些步骤</h2>
        <div className="rounded-lg border bg-white p-6">
          <Steps
            items={disabledItems}
            current={1}
            clickable
            onChange={(current) => console.log('切换到步骤:', current)}
          />
          <p className="mt-4 text-gray-600">第三步被禁用，无法点击</p>
        </div>
      </section>

      {/* 简化版本 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          简化版本（仅标题）
        </h2>
        <div className="rounded-lg border bg-white p-6">
          <Steps
            items={[{ title: '开始' }, { title: '进行中' }, { title: '结束' }]}
            current={1}
          />
        </div>
      </section>

      {/* 垂直方向自定义图标 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          垂直方向自定义图标
        </h2>
        <div className="rounded-lg border bg-white p-6">
          <Steps items={customIconItems} current={1} direction="vertical" />
        </div>
      </section>
    </div>
  );
};

export default StepsDemo;
