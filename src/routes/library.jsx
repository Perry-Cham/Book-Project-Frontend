import { openDB } from 'idb';
import { useState, useEffect,useRef } from 'react';
import { ReactReader } from 'react-reader';
import { Document, Page, pdfjs } from 'react-pdf';
import { Dialog} from '@headlessui/react'
import PdfReader from '../components/PDFreader/index.jsx'
import EpubReader from  '../components/Epubreader/index.jsx'


function LibraryPage() {
  const [bookToRead, setBookToRead] = useState(null);
  const [books, setBooks] = useState([]);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [url, setUrl] = useState("")
  const [modalState, setModalState] = useState({open:false, message:"", title:""})
const viewerRef = useRef(null);
  useEffect(() => {
    listAllBooks();
  }, []);

  async function storeBook(e) {
    const files = e.target.files;
    if (!files.length) return;
    try {
      const root = await navigator.storage.getDirectory();
      const booksDir = await root.getDirectoryHandle('books', { create: true });
      const db = await openDB('App', 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('Books')) {
            db.createObjectStore('Books', { keyPath: 'id', autoIncrement: true });
          }
        },
      });

      for (const file of files) {
        const fileHandle = await booksDir.getFileHandle(file.name, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(file);
        await writable.close();
        const entry = {
          name: file.name,
          page: 1,
          totalPages: undefined,
          filePath: `books/${file.name}`,
        };
        await db.put('Books', entry);
      }
      setModalState(prev =>({open:true, message:"The book has been added successfully", title:"success"}))
      await listAllBooks(); // Refresh the book list
    } catch (err) {
      console.error('Error storing book:', err);
      alert('Operation failed');
    }
  }

  async function getBook(id) {
    try {
      const db = await openDB('App', 1);
      const book = await db.get('Books', id);
      if (!book) throw new Error('Book not found');

      const root = await navigator.storage.getDirectory();
      const booksDir = await root.getDirectoryHandle('books', { create: false });
      const fileHandle = await booksDir.getFileHandle(book.name);
      const file = await fileHandle.getFile();
      const fileType = book.name.split('.').pop().toLowerCase();
      setBookToRead({ file, type: fileType });
      setUrl(URL.createObjectURL(file))
    } catch (err) {
      console.error('Error getting book:', err);
      alert('Failed to open book');
    }
  }
async function deleteBook(id){
  try{
  const db = await openDB('App',1)
  const book = await db.get("Books",id)
  const root = await  navigator.storage.getDirectory()
  const booksDir = await root.getDirectoryHandle('books')
  const file = await booksDir.getFileHandle(book.name)
  console.log(file)
  await file.remove()
  await db.delete('Books',id)
  listAllBooks()
  setModalState(prev =>({open:true, message:"The book has been deleted successfully", title:"success"}))
  }catch(err){
    console.err(err)
    alert(err)
  }
}
  async function listAllBooks() {
    try {
      const db = await openDB('App', 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('Books')) {
            db.createObjectStore('Books', { keyPath: 'id', autoIncrement: true });
          }
        },
      });
      const allBooks = await db.getAll('Books');
      setBooks(allBooks);
    } catch (err) {
      console.error('Error listing books:', err);
    }
  }

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return bookToRead ? (
    <section style={{ height: '100vh' }}>
      <button onClick={() => setBookToRead(null)}>Back to Library</button>
      {bookToRead.type === 'epub' ? (
      <>
      { /* <ReactReader
          url={bookToRead.file}
          title={bookToRead.name || ''}
          location={'epubcfi(/6/2[cover]!/4/1/10)'}
          locationChanged={(epubcifi) => console.log('EPUB CFI:', epubcifi)}
        />*/}
        <div style={{ position: "relative"
        }}>
    {url && <EpubReader
        url={bookToRead.file}
        VIEWER_TYPE = {'EpubViewer'}
      />}
    </div>
      </>
      ) : bookToRead.type === 'pdf' && (
        <div>
      {/*<Document file={bookToRead.file} onLoadSuccess={onDocumentLoadSuccess}>
            <Page pageNumber={pageNumber} />
          </Document>
          <p>
            Page {pageNumber} of {numPages || 'Loading...'}
            {numPages && (
              <div>
                <button
                  onClick={() => setPageNumber((prev) => Math.max(1, prev - 1))}
                  disabled={pageNumber <= 1}
                >
                  Previous
                </button>
                <button
                  onClick={() => setPageNumber((prev) => Math.min(numPages, prev + 1))}
                  disabled={pageNumber >= numPages}
                >
                  Next
                </button>
              </div>
            )}
          </p>*/}
          <>
          <PdfReader pdfFilePath={url}/>
          </>
        </div>
      )}
    </section>
  ) : (
    <section>
      <p>Hello User</p>
          <Dialog open={modalState.open} onClose={() => setModalState(prev => ({ ...prev, open: false }))} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-4xl rounded bg-white p-6">
            <Dialog.Title className="text-lg font-medium leading-6 text-gray-900 mb-4">
              {modalState.heading}
            </Dialog.Title>
            <Dialog.Description>
              <p>{modalState.message}</p>
            </Dialog.Description>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setModalState((prev) => ({ ...prev, open: false }))}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md"
              >
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
      <input
        type="file"
        accept=".pdf,.epub"
        onChange={storeBook}
        multiple
      />
      <div>
        {books.length > 0 ? (
          books.map((book) => (
            <div key={book.id}>
              <p>Placeholder image</p>
              <p>{book.name}</p>
              <button onClick={() => getBook(book.id)}>Read Book</button>
              <button onClick={() => deleteBook(book.id)}>Delete Book</button>
            </div>
          ))
        ) : (
          <p>Your library is empty. Add some books!</p>
        )}
      </div>
    </section>
  );
}

export default LibraryPage;