import { Link } from "react-router-dom";
import api from "../../utilities/api";
import Modal from "../../components/modal";
import { local } from "d3";
function Book_Card({ book, type, functions }) {
  return (
    <div
      className={`text-capitalize my-4 px-3 py-4 max-w-[300px] ${
        type === "homeBook" ? "min-h-[100px] bg-white rounded-md py-2 px-1" : ""
      }`}
    >
      <div className="h-250px">
        <img
          className="h-[250px] w-[180px] object-cover rounded-md"
          src={book.cover || null}
          alt={book.title + " cover image"}
        />
      </div>
      <p>{book.title}</p>
      <p>{book.author}</p>
      <p>{book.genre}</p>
      <p>{book.pageCount}</p>

      {type == "homeBook" && (
        <button className="box-border inline-block h-[2rem] bg-blue-900 text-white px-4 mt-2 rounded-xl">
          <Link to={`/download/${book._id}`}>Save Book</Link>
        </button>
      )}

      {type == "currentBook" && (
        <>

        <>
          {book.fileType == "pdf" && <p>Current Page: {book.page}</p>}
          <input type="range" value={book.progress || 0.1} max={100} />
          <p>{book.progress || 0.1}%</p>
        </>

          <button
            onClick={() =>
              functions.openModal(book, "setCurrent", functions.setPage)
            }
            className="btn-primary block"
          >
            Set Current Page
          </button>
          <button
            className="btn-secondary my-3 block"
            onClick={async () => {
              // If synced, call authenticated download stream; otherwise open standardebooks
              try {
                if (book.synced && book._id) {
                  // request the current file from the server (authenticated)
               /*   const response = await api.get(
                    `/download/current/file/${book._id}`
                  );*/
                  const token = localStorage.getItem("token");
                  window.location.href = `${import.meta.env.VITE_API}/download/current/file/${book._id}?token=${token}`;
                  
                } else {
                  const query = encodeURIComponent(
                    book.title || book.name || ""
                  );
                  window.open(
                    `https://standardebooks.org/ebooks?query=${query}&sort=default&view=grid&per-page=12`,
                    "_blank"
                  );
                                  }
              } catch (err) {
                console.error("Download failed", err);
                alert("Download failed");
              }
            }}
          >
            Download
          </button>
          <button
            className="btn-red"
            onClick={() => functions.handleDelete(book._id, false)}
          >
            Delete Book
          </button>
        </>
      )}

      {type == "savedBook" && (
        <>
          <button
            className="btn-primary mr-2"
            onClick={async () => {
              const query = encodeURIComponent(book.title || book.name || "");
              window.open(
                `https://standardebooks.org/ebooks?query=${query}&sort=default&view=grid&per-page=12`,
                "_blank"
              );
            }}
          >
            Download
          </button>
          <button
            className="btn-primary"
            onClick={() =>
              functions.openModal(book, "setMax", functions.setPage)
            }
          >
            Start Reading
          </button>
          <button
            className="btn-secondary"
            onClick={() => functions.handleDelete(book._id, true)}
          >
            Delete Book
          </button>
        </>
      )}
    </div>
  );
}
export default Book_Card;
