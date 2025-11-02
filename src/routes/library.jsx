import { openDB } from 'idb';
import { useState, useEffect, useRef } from 'react';
import { ReactReader } from 'react-reader';
import { Dialog } from '@headlessui/react'
import PdfReader from '../components/PDFreader/index'
import useNavStore from '../stores/nav_state_store';
import useAuthStore from '../stores/auth_store';
import axios from 'axios'
import api from '../utilities/api'

function LibraryPage() {
  const [bookToRead, setBookToRead] = useState(null);
  const [books, setBooks] = useState([]);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [location, setLocation] = useState(0)
  const tocRef = useRef(null)
  const renditionRef = useRef(location)
  const bookRef = useRef(null)
  const [url, setUrl] = useState("")
  const [modalState, setModalState] = useState({ open: false, message: "", title: "" })
  const setNavIsOpen = useNavStore(state => state.setIsOpen)
  const user = useAuthStore(state => state.user)

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
        const fileType = file.name.split('.').pop().toLowerCase();

        const entry = {
          name: null,
          filename: file.name,
          page: 1,
          totalPages: undefined,
          filePath: `books/${file.name}`,
          progress: 0,
          epubcfi: null,
          cover: '', // Add cover URL to the entry
          synced: false,
          fileType: fileType
        };
        //PDF Processing
        if (fileType === 'pdf') {
          try {
            // Try to use pdfjs if available on window, otherwise dynamic import
            let pdfjsLib = window['pdfjs-dist/build/pdf']
            if (!pdfjsLib) {
              const imported = await import('pdfjs-dist/build/pdf')
              // some bundlers put the lib on default, others export directly
              pdfjsLib = imported.default || imported
            }
            const pdfUrl = URL.createObjectURL(file);
            const loadingTask = pdfjsLib.getDocument(pdfUrl)
            const pdf = await loadingTask.promise
            const metadata = await pdf.getMetadata()
            const titleFromInfo = metadata?.info?.Title
            const titleFromXmp = metadata?.metadata && typeof metadata.metadata.get === 'function'
              ? metadata.metadata.get('dc:title')
              : null
            const title = titleFromInfo || titleFromXmp || entry.filename

            entry.name = title
            entry.totalPages = pdf.numPages;
            await db.put('Books', entry);
          } catch (err) {
            console.error('Error loading PDF:', err);
          }
        } else if (fileType === 'epub') {
          const imported = await import('epubjs');
          const epubUrl = URL.createObjectURL(file);
          const book = new imported.Book(file)
          book.ready.then((data) => {
            bookRef.current = data[2]
            entry.name = bookRef.current.title || file.name;
            db.put('Books', entry);
            listAllBooks();
          })
        }
        
        setModalState(prev => ({ open: true, message: `The ${files.length > 1 ? 'books' : 'book'} has been added successfully`, title: "success" }))
        listAllBooks(); // Refresh the book list
      }
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
      setBookToRead({ file, type: fileType, id: book.id, lastPage: book.page });
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
        book.page = pageNumber
        book.progress = (pageNumber / (book.totalPages || 1)) * 100

      } catch (err) {
        book.page = pageNumber
        book.progress = Math.floor((pageNumber / (numPages || 1)) * 100)
      }
    } else {
      book.progress = Math.floor(renditionRef.current?.book.locations?.percentageFromCfi(location) * 100);
      book.epubcfi = location;
      book.name = renditionRef.current?.book?.packaging.metadata?.title
    }

    await db.put("Books", book)
    setBookToRead(null);
    setUrl("");
    setNavIsOpen(true)
  }

  async function syncBooks(id) {
    try {
      const db = await openDB('App', 1)
      const books = await db.getAll('Books')

      const formData = new FormData()
      // Add each file to formData
      for (const book of books) {
        const root = await navigator.storage.getDirectory()
        const booksDir = await root.getDirectoryHandle('books', { create: false })
        const fileHandle = await booksDir.getFileHandle(book.filename, { create: false })
        const file = await fileHandle.getFile()
        formData.append('books', file, book.filename)
      }

      // Add book metadata as JSON string
      formData.append('books', JSON.stringify(books))

      const response = await api.patch(`/syncbooks`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (response.status === 200) {
        console.log('Books synced successfully:', response)
      }
    } catch (error) {
      console.error('Error syncing books:', error)
    }


  }

  async function syncPages() {
    const db = await openDB('App', 1)
    const book = await db.get('Books', bookToRead.id)
    const data = { name: book.name, progress: book.progress }
    bookToRead.type === "epub" ? data.location = location : data.page = bookToRead.lastPage;
    try {
      await axios.patch(`${api}/syncpages`, data, { withCredentials: true })
    } catch (error) {
      console.error('Error syncing pages:', error)
    }
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
              if (!(/\.xhtml$/i.test(loc))) {
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
    <section className="px-2">
      <p>Hello {user.name},</p>
      <Dialog open={modalState.open} onClose={() => setModalState(prev => ({ ...prev, open: false }))} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-4xl rounded bg-white p-6">
            <Dialog.Title className="text-lg font-medium leading-6 text-gray-900 mb-4">
              {modalState.heading}
            </Dialog.Title>
            <Dialog.Description>
              {modalState.message}
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
      <div className='flex justify-between align-center'>
        <label for="files">Add Books <br />
          <input
            type="file"
            name="files"
            accept=".pdf,.epub"
            onChange={storeBook}
            multiple
          />
        </label>

        <button className="btn-primary max-h-[2.25rem]" onClick={() => syncBooks()}>Toggle Syncing</button>
      </div>

      <div className='grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4 md:gap-2 lg:gap-4'>
        {books.length > 0 ? (
          books.map((book) => (
            <div className="px-2 py-1 mt-2 shadow-lg w-[250px] md:w-[auto]" key={book.id}>
              {book.cover ? (
                <img src={book.cover} alt={`Cover of ${book.name || book.filename}`} className="w-full h-48 object-cover" />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <span>No Cover</span>
                </div>
              )}
              <div className="grid grid-row-2 h-[100px] gap-1">
                <p className="line-clamp-2">{book.name || book.filename}</p>
                <div>
                  <button className="btn-primary" onClick={() => getBook(book.id)}>Read Book</button>
                  <button className="btn-red ml-3" onClick={() => deleteBook(book.id)}>Delete Book</button>
                </div>
              </div>



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