import classConfig from '@/components/core/components/loading/class-config.ts';
import Mask from '@/components/core/components/mask';
import { DefaultLoadingIcon } from './icons.tsx';

const classConfigData = classConfig();

export type Props = {
  /** 是否显示 */
  visible: boolean;
  /** 遮罩层自定义类名 */
  className?: string;
  /** 内容区域自定义类名 */
  bodyClassName?: string;
  /** 文本区域自定义类名 */
  textClassName?: string;
  /** loading图标自定义类名 */
  loadingIconClassName?: string;
};
const Loading = (props: Props) => {
  const {
    visible,
    className,
    bodyClassName,
    textClassName,
    loadingIconClassName,
  } = props;

  return (
    <Mask visible={visible} className={classConfigData.mask({ className })}>
      <div className={classConfigData.position()}>
        <div className={classConfigData.body({ className: bodyClassName })}>
          <DefaultLoadingIcon className={loadingIconClassName} />
          <div
            data-testid="text"
            className={classConfigData.text({ className: textClassName })}
          >
            加载中...
          </div>
        </div>
      </div>
    </Mask>
  );
};
export default Loading;
export { DefaultLoadingIcon };
