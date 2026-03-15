import PDFViewer from '@/components/core/components/pdf-viewer';

const PdfViewerDemo = () => {
  return (
    <div className="space-y-8 p-6">
      <h1 className="text-3xl font-bold text-gray-900">PDFViewer 控件演示</h1>

      <div className="space-y-8">
        {/* 基础 */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">基础</h2>
          <PDFViewer
            url="https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf"
            /*url="https://snippet.embedpdf.com/ebook.pdf"*/
            className="h-[400px]"
            toolBar
          />
        </div>
      </div>
    </div>
  );
};

export default PdfViewerDemo;
