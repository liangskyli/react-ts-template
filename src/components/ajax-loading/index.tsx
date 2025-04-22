import Mask from '@/components/mask';
import Loading from '@/router/utils/loading.tsx';

export type Props = {
  visible: boolean;
};
const AjaxLoading = (props: Props) => {
  const { visible } = props;

  return (
    <Mask visible={visible} className="bg-mask/0">
      <Loading />
    </Mask>
  );
};
export default AjaxLoading;
