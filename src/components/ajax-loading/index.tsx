export type Props = {
  visible: boolean;
};
const AjaxLoading = (props: Props) => {
  const { visible } = props;

  return (
    <div>
      {visible && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '200px',
            height: '100px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ marginTop: '9px', fontSize: '12px' }}>
              加载中...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
export default AjaxLoading;
