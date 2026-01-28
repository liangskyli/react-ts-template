import classConfig from '@/components/core/components/loading/class-config.ts';
import Mask from '@/components/core/components/mask';
import { getSemanticClassNames } from '@/components/core/utils/get-semantic-class-names.ts';
import { DefaultLoadingIcon } from './icons.tsx';

const classConfigData = classConfig();

type SemanticClassNames = {
  /** 遮罩层自定义类名 */
  root?: string;
  /** 内容区域自定义类名 */
  body?: string;
  /** 文本区域自定义类名 */
  text?: string;
  /** loading图标自定义类名 */
  loadingIcon?: string;
};
export type Props = {
  /** 是否显示 */
  visible: boolean;
  /** 遮罩层自定义类名 */
  className?: string | SemanticClassNames;
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
  const classNames = getSemanticClassNames<SemanticClassNames>(className);

  return (
    <Mask
      visible={visible}
      className={classConfigData.mask({
        className: classNames?.root,
      })}
    >
      <div className={classConfigData.position()}>
        <div
          className={classConfigData.body({
            className: classNames?.body ?? bodyClassName,
          })}
        >
          <DefaultLoadingIcon
            className={classNames?.loadingIcon ?? loadingIconClassName}
          />
          <div
            data-testid="text"
            className={classConfigData.text({
              className: classNames?.text ?? textClassName,
            })}
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
