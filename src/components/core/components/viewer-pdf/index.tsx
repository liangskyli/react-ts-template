import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import type { DocumentProps } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// 设置 worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export type ViewerPdfProps = {
  url: string;
  errText?: string;
};

const ViewerPdf = (props: ViewerPdfProps) => {
  const { url, errText = '加载 PDF 失败' } = props;
  const [numPages, setNumPages] = useState<number>(0);

  const onDocumentLoadSuccess: Required<DocumentProps>['onLoadSuccess'] = (
    document,
  ) => {
    const { numPages } = document;
    setNumPages(numPages);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('Error loading PDF:', error);
  };

  return (
    <div className="bg-[#f5f5f5] p-5">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          backgroundColor: '#fff',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          padding: '20px',
        }}
      >
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                padding: '20px',
              }}
            >
              加载中...
            </div>
          }
          error={
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                padding: '20px',
                color: '#666',
              }}
            >
              {errText}
            </div>
          }
        >
          {Array.from(new Array(numPages), (_, index) => (
            <div
              key={`page_${index + 1}`}
              style={{
                marginBottom: index < numPages - 1 ? '20px' : 0,
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Page
                pageNumber={index + 1}
                width={400}
                renderAnnotationLayer={true}
                renderTextLayer={true}
                loading={
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      minHeight: '500px',
                      padding: '20px',
                    }}
                  >
                    加载中...
                  </div>
                }
              />
            </div>
          ))}
        </Document>
      </div>
    </div>
  );
};

export default ViewerPdf;
