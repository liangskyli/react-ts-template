import Loading from '@/router/utils/loading.tsx';

export type Props = {
  visible: boolean;
};
const AjaxLoading = (props: Props) => {
  const { visible } = props;

  return (
    <div>
      {visible && (
        <div className="fixed inset-0 z-mask bg-white/0">
          <Loading />
        </div>
      )}
    </div>
  );
};
export default AjaxLoading;
