import { useState, useEffect } from 'react'
import axios from 'axios'
import Book_Card from '../../components/cards/book_card'
import Modal from '../../components/modal'
function Book_Section({ openModal, setModalState, modalState, api}) {
  const [sbooks, setSbooks] = useState();
  const [cbooks, setCbooks] = useState();
  const [currBook, setCurrBook] = useState({});

useEffect(() => {
  getSavedBooks()
  getCurrentBooks()
},[])
  function setPage(pageCount, type, currBook2) {
    setModalState((prev) => ({ ...prev, open: false }));

    let data;

    if (type === 'setMax') {
      data = {
        title: currBook2.title,
        cover: currBook2.cover,
        pageCount: pageCount || currBook2.pageCount,
        page: 1,
        mainBook: currBook2._id,
        history: []
      };
    } else {
      data = {
        id: currBook2._id,
        title: currBook2.title,
        pageCount: pageCount
      };
    }
    console.log(modalState, data, currBook);
    handleRead(data, type);
  }

  //Post Requests
  async function handleRead(data, type) {
    const endpoint = type == "setMax" ? "setcurrentbook" : "setcurrentpage";
    try {
      const response = await axios.post(`${api}/${endpoint}`, data, {
        withCredentials: true
      });
      console.log(response)
      if (response.status == 200) {
        if (modalState.type === "setMax") {
          console.log(response)
          alert(`Congratulations you've just started ${response.data.name}`);
        } else {
          console.log(response)
          alert(`Congratulations you're now on page ${response.data.page} in ${response.data.title}`);
        }
        getCurrentBooks();
        getSavedBooks();
      } else {
        alert('Error adding book');
        console.log(response);
      }
    } catch (err) {
      console.error(err);
    }
  }

  //Functions that fetch data from the server
  async function getCurrentBooks() {
    try {
      const response = await axios.get(`${api}/getcurrentbooks`, {
        withCredentials: true
      });
        console.log(response)
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
        console.log(response);
        alert('Error fetching books');
      }
    } catch (err) {
      console.error(err);
    }
  }

  //Functions that delete data from the server
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
          console.log(response);
          alert("Server side error current");
        }
      } catch (err) {
        console.error(err);
        alert("Server side error current");
      }
    }
  }

  // TODO: Replace the following with your actual JSX UI
  return (
    <>
      <section>
        {modalState.open && <Modal setModalState={setModalState} modalState={modalState} />}
        <h2>Currently Reading</h2>
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
    </section >
</>
  
  );
}

export default Book_Section;