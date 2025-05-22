import classConfig from '@/components/loading/class-config.ts';
import Mask from '@/components/mask';
import { cn } from '@/utils/styles.ts';
import { DefaultLoadingIcon } from './icons.tsx';

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
    <Mask visible={visible} className={cn(classConfig.mask, className)}>
      <div className={classConfig.position}>
        <div className={cn(classConfig.body, bodyClassName)}>
          <DefaultLoadingIcon className={loadingIconClassName} />
          <div
            data-testid="text"
            className={cn(classConfig.text, textClassName)}
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
