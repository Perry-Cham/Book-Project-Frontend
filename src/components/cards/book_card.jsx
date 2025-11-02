import { Link } from 'react-router-dom';
import Modal from '../../components/modal'
function Book_Card({ book, type, functions }) {

  return (
    <div className={`text-capitalize my-4 px-4${type === "homeBook" && "sm:min-h-[100px] bg-white rounded-md py-2 px-1"}`}>
      <img className="w-[150px]" src={book.cover} alt={book.title + " cover image"} />
      <p>{book.title}</p>
      <p>{book.author}</p>
      <p>{book.genre}</p>
      <p>{book.pageCount}</p>
      {type == "currentBook" &&
        <>
          <p>Current Page: {book.page}</p>
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
          <button className="btn-secondary" onClick={() => functions.handleDelete(book._id, false)}>Delete Book</button>
        </>
      }

      {type == "savedBook" &&
        <>
          <button className="btn-primary" onClick={() => functions.openModal(book, "setMax", functions.setPage)}>Start Reading</button>
          <button className="btn-secondary" onClick={() => functions.handleDelete(book._id, true)}>Delete Book</button>
        </>
      }
    </div>
  )
}
export default Book_Card;