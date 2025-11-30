import { Link } from 'react-router-dom';
import api from '../../utilities/api'
import Modal from '../../components/modal'
function Book_Card({ book, type, functions }) {

  return (
    <div className={`text-capitalize my-4 px-3 py-4 ${type === "homeBook" && "min-h-[100px] bg-white rounded-md py-2 px-1"}`}>
      <div className="h-250px">
      <img className="h-[250px] w-full object-cover" src={book.cover || null} alt={book.title + " cover image"} />
      </div>
      <p>{book.title}</p>
      <p>{book.author}</p>
      <p>{book.genre}</p>
      <p>{book.pageCount}</p>
      {type == "currentBook" &&
        <>
          {book.fileType == "pdf" && <p>Current Page: {book.page}</p>}
          <input type="range" value={book.progress || 0.1} max={100} />
          <p>{book.progress || 0.1}%</p>
        </>
      }

      {type == "homeBook" &&
        <button className="box-border inline-block h-[2rem] bg-blue-900 text-white px-4 mt-2 rounded-xl">
          <Link to={`/download/${book._id}`}>Save Book</Link>
        </button>}

      {type == "currentBook"
        && <>
          <button onClick={() => functions.openModal(book, "setCurrent", functions.setPage)} className="btn-primary">Set Current Page</button>
          <button className="btn-secondary ml-2" onClick={async () => {
            // If synced, call authenticated download stream; otherwise open standardebooks
            try {
              if (book.synced && book._id) {
                // request the current file from the server (authenticated)
                const response = await api.get(`/download/current/file/${book._id}`, { responseType: 'blob', withCredentials: true });
                const blob = new Blob([response.data], { type: response.headers['content-type'] || 'application/octet-stream' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                // Prefer filename from Content-Disposition header
                let filename = 'download';
                try {
                  const disp = response.headers['content-disposition'] || response.headers['Content-Disposition'];
                  if (disp) {
                    const m = disp.match(/filename\*?=([^;]+)/i);
                    if (m) {
                      filename = m[1].trim().replace(/^(?:UTF-8''|"?)(.*)"?$/i, '$1');
                      try { filename = decodeURIComponent(filename); } catch (e) { /* ignore */ }
                    }
                  }
                } catch (e) { /* ignore */ }
                a.download = filename || (book.title || 'download');
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
              } else {
                const query = encodeURIComponent(book.title || book.name || '');
                window.open(`https://standardebooks.org/ebooks?query=${query}&sort=default&view=grid&per-page=12`, '_blank')
              }
            } catch (err) {
              console.error('Download failed', err)
              alert('Download failed')
            }
          }}>Download</button>
          <button className="btn-secondary" onClick={() => functions.handleDelete(book._id, false)}>Delete Book</button>
        </>
      }

      {type == "savedBook" &&
        <>
          <button className="btn-primary mr-2" onClick={async () => {
            try {
              if (book.synced || (book.file && book.file.provider === 'GridFs')) {
                // public endpoint for book collection file
                const response = await api.get(`/download/file/${book._id}`, { responseType: 'blob' });
                const blob = new Blob([response.data], { type: response.headers['content-type'] || 'application/octet-stream' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                let filename = 'download';
                try {
                  const disp = response.headers['content-disposition'] || response.headers['Content-Disposition'];
                  if (disp) {
                    const m = disp.match(/filename\*?=([^;]+)/i);
                    if (m) {
                      filename = m[1].trim().replace(/^(?:UTF-8''|"?)(.*)"?$/i, '$1');
                      try { filename = decodeURIComponent(filename); } catch (e) { /* ignore */ }
                    }
                  }
                } catch (e) { /* ignore */ }
                a.download = filename || (book.title || 'download');
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
              } else {
                const query = encodeURIComponent(book.title || book.name || '');
                window.open(`https://standardebooks.org/ebooks?query=${query}&sort=default&view=grid&per-page=12`, '_blank')
              }
            } catch (err) {
              console.error('Download failed', err)
              alert('Download failed')
            }
          }}>Download</button>
          <button className="btn-primary" onClick={() => functions.openModal(book, "setMax", functions.setPage)}>Start Reading</button>
          <button className="btn-secondary" onClick={() => functions.handleDelete(book._id, true)}>Delete Book</button>
        </>
      }
    </div>
  )
}
export default Book_Card;