import { openDB } from 'idb';
import { useState, useEffect, useRef } from 'react';
import { ReactReader } from 'react-reader';
import { Dialog } from '@headlessui/react'
import PdfReader from '../components/PDFreader/index.jsx'
import useNavStore from '../stores/nav_state_store.js';
import axios, { all } from 'axios'

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
  const navIsOpen = useNavStore(state => state.isOpen)
  const setNavIsOpen = useNavStore(state => state.setIsOpen)

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
    await renditionRef.current.book.locations.generate(1000)
  }

  async function getImage(title) {
    // Check if browser is online
    if (!navigator.onLine) {
      console.log('Browser is offline, skipping cover image fetch');
      return null;
    }

    try {
      // Fetch book data from Open Library API
      const query = `title:${encodeURIComponent(title)}`;
      const response = await axios.get(`https://openlibrary.org/search.json?q=${query}&limit=1&fields=title,cover_i`);
      console.log(response.data)
      const docs = response.data.docs;

      let coverUrl = null;
      if (docs.length > 0 && docs[0].cover_i) {
        coverUrl = `https://covers.openlibrary.org/b/id/${docs[0].cover_i}-M.jpg`;
        return coverUrl;
      } else {
        return null;
      }
    } catch (err) {
      console.error('Error fetching cover image:', err);
      return null;
    }
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
        
        // Get filename without extension for image search
        const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
        
        // Try to fetch cover image
        
        const entry = {
          name: null,
          filename: file.name,
          page: 1,
          totalPages: undefined,
          filePath: `books/${file.name}`,
          progress: 0,
          epubcfi: null,
          cover: null // Add cover URL to the entry
        };
        await db.put('Books', entry);
      }
      setModalState(prev => ({ open: true, message: `The ${files.length > 1 ? 'books' : 'book'} has been added successfully`, title: "success" }))
      
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
      const fileHandle = await booksDir.getFileHandle(book.filename);
      const file = await fileHandle.getFile();
      const fileType = book.filename.split('.').pop().toLowerCase();
      setBookToRead({ file, type: fileType, id: book.id, lastPage: book.page});
      setLocation(book.epubcfi || 0);
      setPageNumber(book.page)
      setNavIsOpen(false)
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
      const file = await booksDir.getFileHandle(book.filename)
      console.log(file)
      await file.remove()
      await db.delete('Books', id)
      listAllBooks()
      setModalState(prev => ({ open: true, message: "The book has been deleted successfully", title: "success" }))
    } catch (err) {
      console.error(err)
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

    if (bookToRead.type === 'pdf') {
      try {
        // Try to use pdfjs if available on window, otherwise dynamic import
        let pdfjsLib = window['pdfjs-dist/build/pdf']
        if (!pdfjsLib) {
          const imported = await import('pdfjs-dist/build/pdf')
          // some bundlers put the lib on default, others export directly
          pdfjsLib = imported.default || imported
        }

        const loadingTask = pdfjsLib.getDocument(url)
        const pdf = await loadingTask.promise
        const metadata = await pdf.getMetadata()

        // Prefer the info Title, then XMP metadata dc:title, then filename
        const titleFromInfo = metadata?.info?.Title
        const titleFromXmp = metadata?.metadata && typeof metadata.metadata.get === 'function'
          ? metadata.metadata.get('dc:title')
          : null
        const title = titleFromInfo || titleFromXmp || book.filename

        book.name = title
        book.totalPages = numPages || pdf.numPages
        book.page = pageNumber
        book.progress = (pageNumber / (book.totalPages || 1)) * 100
        
      } catch (err) {
        console.error('Error reading PDF metadata:', err)
        // Fallback: save what we have
        book.totalPages = numPages
        book.page = pageNumber
        book.progress = (pageNumber / (numPages || 1)) * 100
      }
    } else {
      book.progress = renditionRef.current?.book.locations?.percentageFromCfi(location) * 100;
      book.epubcfi = location;
      book.name = renditionRef.current?.book?.packaging.metadata?.title
    }

    await db.put("Books", book)
    setBookToRead(null);
    setUrl("");
    setNavIsOpen(true)
  }

  async function syncBook() {
    // Implementation for syncBook function
  }

  return bookToRead ? (
    <section className='h-[100vh] relative'>
      <button className="absolute z-50 right-[2rem] top-[2.5rem] bg-red-500 rounded-md px-2 py-1 text-white" onClick={() => {
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
              if(!(/\.xhtml$/i.test(loc))) {
                console.log(loc)
                const currentLocation = renditionRef.current?.book.locations?.percentageFromCfi(loc);
                console.log("Current location percentage:", currentLocation);
              }
            }}
            getRendition={(rendition) => handleRendition(rendition)}
            epubOptions={{
              allowScriptedContent: true,
              allowPopups: true,
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
      <div className='md:grid md:grid-cols-4'>
        {books.length > 0 ? (
          books.map((book) => (
            <div className="px-2 py-1 w-[300px] mt-2 shadow-lg" key={book.id}>
              {book.cover ? (
                <img src={book.cover} alt={`Cover of ${book.name || book.filename}`} className="w-full h-48 object-cover" />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <span>No Cover</span>
                </div>
              )}
              <p>{book.name || book.filename}</p>
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