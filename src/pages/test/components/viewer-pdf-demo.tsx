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
            file="https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf"
            toolBar
            className="h-[400px]"
          />
        </div>
      </div>
    </div>
  );
};

export default ViewerPdfDemo;
