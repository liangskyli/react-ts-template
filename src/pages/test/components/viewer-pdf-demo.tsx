import ViewerPdf from '@/components/core/components/viewer-pdf';

const ViewerPdfDemo = () => {
  return (
    <div className="space-y-8 p-6">
      <h1 className="text-3xl font-bold text-gray-900">ViewerPdf 控件演示</h1>

      <div className="space-y-8">
        {/* 基础 */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">基础</h2>
          <ViewerPdf
            url="https://test-ztcpic.myscrm.cn/3a0b8d13-1f39-5688-907f-9f9b09354626.pdf"
            errText="加载 PDF 失败"
          />
        </div>
      </div>
    </div>
  );
};

export default ViewerPdfDemo;
