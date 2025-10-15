import { useRef } from 'react';
import { EpubViewer, ReactEpubViewer } from './modules';

const Reader = ({ VIEWER_TYPE = 'ReactViewer', file }) => {
    const ref = useRef(null);
    return (<>
      {VIEWER_TYPE === 'ReactViewer' && (<>
          <ReactEpubViewer url={file} ref={ref}/>
        </>)}
      {VIEWER_TYPE === 'EpubViewer' && (<>
          <EpubViewer url={file} ref={ref}/>
        </>)}
    </>);
};
export default Reader
