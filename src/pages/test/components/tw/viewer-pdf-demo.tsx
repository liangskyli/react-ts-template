import ViewerPdf from '@/components/core/components/viewer-pdf';

const ViewerPdfDemo = () => {
  return (
    <div className="tw-space-y-8 tw-p-6">
      <h1 className="tw-text-3xl tw-font-bold tw-text-gray-900">
        ViewerPdf 控件演示
      </h1>

      <div className="tw-space-y-8">
        {/* 基础 */}
        <div>
          <h2 className="tw-mb-4 tw-text-lg tw-font-semibold">基础</h2>
          <ViewerPdf
            file="https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf"
            toolBar
            className="tw-h-[400px]"
          />
        </div>
      </div>
    </div>
  );
};

export default ViewerPdfDemo;
