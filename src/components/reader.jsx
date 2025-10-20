import { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';

// Set the worker source for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const PdfViewer = ({ pdfUrl,setPage,page }) => {
  console.log(pdfUrl)
  const link = URL.createObjectURL(pdfUrl)
  const canvasRef = useRef(null);
  const [pageNum, setPageNum] = useState(1); // Track current page
  const [pdf, setPdf] = useState(null); // Store PDF document

  // Load the PDF document
  useEffect(() => {
    const loadPdf = async () => {
      try {
        const loadedPdf = await pdfjsLib.getDocument(link).promise;
        setPdf(loadedPdf);
      } catch (error) {
        console.error('Error loading PDF:', error);
      }
    };
    loadPdf();
  }, [pdfUrl]);

  // Render the current page
  useEffect(() => {
    if (pdf) {
      const renderPage = async () => {
        try {
          const page = await pdf.getPage(pageNum);
          const canvas = canvasRef.current;
          const context = canvas.getContext('2d');
          const viewport = page.getViewport({ scale: 1.0 });

          canvas.height = viewport.height;
          canvas.width = viewport.width;

          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          };
          await page.render(renderContext).promise;
        } catch (error) {
          console.error('Error rendering page:', error);
        }
      };
      renderPage();
    }
  }, [pdf, pageNum]);

  // Navigation functions
  const nextPage = () => {
    if (pdf && pageNum < pdf.numPages) {
      setPageNum(pageNum + 1);
    }
  };

  const prevPage = () => {
    if (pageNum > 1) {
      setPageNum(pageNum - 1);
    }
  };

  return (
    <div>
      <canvas ref={canvasRef} />
      <div>
        <button onClick={prevPage} disabled={pageNum <= 1}>
          Previous
        </button>
        <button onClick={nextPage} disabled={pdf && pageNum >= pdf.numPages}>
          Next
        </button>
        {/* Display the current page */}
        <p>
          Current Page: {pageNum} of {pdf ? pdf.numPages : 1}
        </p>
      </div>
    </div>
  );
};

export default PdfViewer;