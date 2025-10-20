import { useEffect, useState } from "react";
import { PDFSlick, usePDFSlick } from "@pdfslick/react";
import Toolbar from "./Toolbar";
import Thumbsbar from "./Thumbsbar";



export default function PDFViewerApp({ pdfFilePath,setPageNumber,pageNumber,setNumPages }) {
  const [isThumbsbarOpen, setIsThumbsbarOpen] = useState(false);
  const [loadedPerc, setLoadedPerc] = useState(0);
  const {
    isDocumentLoaded,
    viewerRef,
    thumbsRef,
    usePDFSlickStore,
    PDFSlickViewer,
  } = usePDFSlick(pdfFilePath, {
    getDocumentParams: {
      disableAutoFetch: false, /** pages need to be loaded for printing, otherwise we get `Expected print service to be initialized.` */
      disableFontFace: false,
      disableRange: false,
      disableStream: true,
      verbosity: 0
    },
    onProgress: ({ total, loaded }) => {
      setLoadedPerc((100 * loaded) / total);
    },
  });

  
  const totalPages = usePDFSlickStore(s => s.numPages)
  const currPage = usePDFSlickStore(s => s.pageNumber)
  const pdfslick = usePDFSlickStore(s => s.pdfSlick)
  useEffect(() => {
    if (isDocumentLoaded) {
      setIsThumbsbarOpen(true);
      setNumPages(totalPages)
    }
  }, [isDocumentLoaded]);
 
  useEffect(() => {
   if(pageNumber && pdfslick)pdfslick.gotoPage(pageNumber)
  },[])
  return (
    <>
      <div className="absolute inset-0 bg-slate-200/70 flex flex-col pdfSlick">
        <Toolbar
          {...{ usePDFSlickStore, setIsThumbsbarOpen, isThumbsbarOpen }}
        />
        <div className="flex-1 flex">
          <Thumbsbar {...{ thumbsRef, usePDFSlickStore, isThumbsbarOpen }} />

          <div className="flex-1 relative h-full">
            <PDFSlickViewer {...{ viewerRef, usePDFSlickStore }} />
          </div>
        </div>
      </div>
      {loadedPerc < 100 && (
        <div
          className="fixed top-0 left-0 h-px bg-blue-600 z-50 transition-all duration-150 ease-out"
          style={{ width: `${loadedPerc}%` }}
        ></div>
      )}
    </>
  );
}
