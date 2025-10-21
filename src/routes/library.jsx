import { openDB } from 'idb';
import { useState, useEffect, useRef } from 'react';
import { ReactReader } from 'react-reader';
import { Dialog } from '@headlessui/react'
import PdfReader from '../components/PDFreader/index.jsx'
import EpubReader from '../components/Epubreader/index.jsx'


function LibraryPage() {
  const [bookToRead, setBookToRead] = useState(null);
  const [books, setBooks] = useState([]);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [location, setLocation] = useState(0)
  const tocRef = useRef(null)
  const renditionRef = useRef(location)
  const [url, setUrl] = useState("")
  const [modalState, setModalState] = useState({ open: false, message: "", title: "" })

  useEffect(() => {
    listAllBooks();
  }, []);

  async function handleRendition(rendition) {
    console.log("Rendition ready", rendition);
    renditionRef.current = rendition;
    //get current and total pages
    await rendition.book.rendered
    await rendition.book.ready
    console.log("Rendered")

    console.log(rendition.currentLocation)
    const displayed = rendition.currentLocation;
    const currentPage = displayed().start.displayed.page;
    const totalPages = displayed().start.displayed.total;
  }
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
      setModalState(prev => ({ open: true, message: "The book has been added successfully", title: "success" }))
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
      setBookToRead({ file, type: fileType, id: book.id, lastPage: book.page });
      setPageNumber(book.page)
      if (fileType === 'pdf') {
        const fileUrl = URL.createObjectURL(file);
        console.log(fileUrl)
        setUrl(fileUrl);
      } else if (fileType === 'epub') {
        const arrayBuffer = await file.arrayBuffer();
        const blob = new Blob([arrayBuffer], { type: 'application/epub+zip' });
        const fileUrl = URL.createObjectURL(blob);
        setUrl(fileUrl);
      }

    } catch (err) {
      console.error('Error getting book:', err);
      alert('Failed to open book');
    }
  }
  async function deleteBook(id) {
    try {
      const db = await openDB('App', 1)
      const book = await db.get("Books", id)
      const root = await navigator.storage.getDirectory()
      const booksDir = await root.getDirectoryHandle('books')
      const file = await booksDir.getFileHandle(book.name)
      console.log(file)
      await file.remove()
      await db.delete('Books', id)
      listAllBooks()
      setModalState(prev => ({ open: true, message: "The book has been deleted successfully", title: "success" }))
    } catch (err) {
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
  async function closeBook() {
    const db = await openDB('App', 1)
    const book = await db.get('Books', bookToRead.id)
    book.totalPages = numPages;
    book.page = pageNumber
    await db.put("Books", book)
    setBookToRead(null);
    setUrl("");
  }

  return bookToRead ? (
    <section style={{ height: '100vh' }}>
      <button className="absolute z-50 right-[2rem] bg-red-500 rounded-md px-2 py-1 text-white" onClick={() => {
        closeBook()

      }}>Back to Library</button>
      {bookToRead.type === 'epub' ? (
        <>
          <ReactReader
            url={bookToRead.file}
            location={location}
            tocChanged={(_toc) => (tocRef.current = _toc)}
            locationChanged={(loc) => {
              setLocation(loc)
              if (renditionRef.current && tocRef.current) {
                const { displayed, href } = renditionRef.current.location.start
                const chapter = tocRef.current.find((item) => item.href === href)
                console.log(chapter, href, tocRef.current
                  `Page ${displayed.page} of ${displayed.total} in  ${chapter ? chapter.label : 'n/a'
                  }`
                )
              }
            }}
            getRendition={(rendition) => handleRendition(rendition)}
            epubOptions={{
              openAs: 'epub'
            }}
          />
        </>
      ) : bookToRead.type === 'pdf' && (
        <div>
          <>
            <PdfReader pdfFilePath={url} pageNumber={bookToRead.lastPage} setPageNumber={setPageNumber} setNumPages={setNumPages} />
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
            <div className="px-2 py-1 w-[300px] mt-2 shadow-lg" key={book.id}>
              <div>Placeholder Img</div>
              <p>{book.name}</p>
              <button className="btn-primary" onClick={() => getBook(book.id)}>Read Book</button>
              <button className="btn-red ml-3" onClick={() => deleteBook(book.id)}>Delete Book</button>
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