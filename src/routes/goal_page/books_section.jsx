import { useState, useEffect } from 'react'
import axios from 'axios'
import Book_Card from '../../components/cards/book_card'
import Modal from '../../components/modal'

function Book_Section({ props, bookProps }) {
  const { openModal, api, modalState, setModalState } = props;
  const { sbooks, setSbooks, cbooks, setCbooks } = bookProps;
  const [currBook, setCurrBook] = useState({});

  useEffect(() => {
    getSavedBooks()
    getCurrentBooks()
  }, [])

  function setPage(Data, type, currBook2) {
    setModalState((prev) => ({ ...prev, open: false }));

    let data;

    if (type === 'setMax') {
      data = {
        title: currBook2.title,
        cover: currBook2.cover,
        pageCount: Data.pageCount || currBook2.pageCount,
        page: 1,
        mainBook: currBook2._id,
        history: []
      };
    } else {
      data = {
        id: currBook2._id,
        title: currBook2.title,
        pageCount: Data.pageCount
      };
    }
    handleRead(data, type);
  }

  async function handleRead(data, type) {
    const endpoint = type == "setMax" ? "setcurrentbook" : "setcurrentpage";
    try {
      const response = await axios.post(`${api}/${endpoint}`, data, {
        withCredentials: true
      });
      if (response.status == 200) {
        if (type === "setMax") {
          alert(`Congratulations you've just started ${data.title}`);
        } else {
          alert(`Congratulations you're now on page ${data.pageCount} in ${data.title}`);
        }
        getCurrentBooks();
        getSavedBooks();
      } else {
        alert('Error adding book');
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function getCurrentBooks() {
    try {
      const response = await axios.get(`${api}/getcurrentbooks`, {
        withCredentials: true
      });
      if (response.status == 200) {
        response.data.currentBooks.length > 0 ? setCbooks(response.data.currentBooks) : setCbooks(undefined);
      } else {
        alert('Error fetching books');
      }
    } catch (err) {
      console.error(err);
      alert('Error fetching books');
    }
  }

  async function getSavedBooks() {
    try {
      const response = await axios.get(`${api}/getsavedbooks`, { withCredentials: true });
      if (response.status == 200) {
        response.data.length !== 0 ? setSbooks(response.data) : setSbooks(undefined);
      } else {
        alert('Error fetching books');
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDelete(id, saved) {
    const isSaved = saved;
    if (isSaved) {
      try {
        const response = await axios.delete(`${api}/deletesaved/${id}`, {
          withCredentials: true
        });
        if (response.status == 200) {
          alert("You have deleted the book successfully");
          getSavedBooks();
        } else {
          alert("Server side error");
        }
      } catch (err) {
        console.error(err);
        alert("Server side error");
      }
    } else {
      try {
        const response = await axios.delete(`${api}/deletecurrent/${id}`, {
          withCredentials: true
        });
        if (response.status == 200) {
          alert("You have deleted the book successfully");
          getCurrentBooks();
        } else {
          alert("Server side error current");
        }
      } catch (err) {
        console.error(err);
        alert("Server side error current");
      }
    }
  }
  async function handleAddCustom(data) {
      try{
     const response = await axios.post(`${api}/addcustombook`,data, {
        withCredentials:true})
        console.log(response)
        if (response.status == 200) {
             alert(`Congratulations you've just started ${data.title}`);
           getCurrentBooks();
           getSavedBooks();
         } else {
           alert('Error adding book');
         }
    }catch(err){
         console.error(err)
       }
  }
  return (
    <>
      <section>
        {modalState.open && <Modal setModalState={setModalState} modalState={modalState} />}
        <h2>Currently Reading</h2>
        <button onClick={() => openModal("", "addCustomBook", handleAddCustom)} className="btn-secondary">Add Your Own Book</button>
        {cbooks ? cbooks.map((book) =>
          <Book_Card book={book} type={"currentBook"} functions={{ openModal, setPage, handleDelete }} />) :
          <div>
            <p>You haven't started reading anything yet, books you read will appear here</p>
          </div>}
      </section>

      <section>
        <h2>Saved Books</h2>
        {sbooks ? sbooks.map((book) =>
          <Book_Card book={book} type={"savedBook"} functions={{ openModal, setPage, handleDelete }} />
        ) :
          <div>
            <p>You haven't saved anything yet, books you save will appear here</p>
          </div>}
      </section>
    </>
  );
}

export default Book_Section;