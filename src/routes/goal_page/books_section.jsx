import {useState} from 'react'
function Book_Section(params) {
  const [sbooks, setSbooks] = useState();
  const [cbooks, setCbooks] = useState();
  const [currBook, setCurrBook] = useState({});


  function setPage(pageCount, type, currBook2) {
    setModalState(() => ({ ...modalState, open: false }));

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
      if (response.status == 200) {
        if (modalState.type === "setMax") {
          alert(`Congratulations you've just started ${response.data.name}`);
        } else {
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
      if (response.status == 200) {
        response.data.length !== 0 ? setCbooks(response.data.currentBooks) : setCbooks(undefined);
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
  {modalState.open && <Modal modalState={modalState} />}
        <h2>Currently Reading</h2>
        {cbooks ? cbooks.map((book) =>
          <div key={book._id}>
            <img className="w-[150px]" src={book.cover} alt={book.title + " cover image"} />
            <p>{book.title}</p>
            <p>{book.author}</p>
            <p>{book.pageCount}</p>
            <button onClick={() => openModal(book, "setCurrent", setPage)} className="btn-primary">Set Current Page</button>
            <button className="btn-secondary" onClick={() => handleDelete(book._id, false)}>Delete Book</button>
          </div>) :
          <div>
            <p>You haven't started reading anything yet, books you read will appear here</p>
          </div>}
      </section>

      <section>
        <h2>Saved Books</h2>
        {sbooks ? sbooks.map((book) =>
          <div key={book._id}>
            <img className="w-[150px]" src={book.cover} alt={book.title + " cover image"} />
            <p>{book.title}</p>
            <p>{book.author}</p>
            <p>{book.pageCount}</p>
            <button className="btn-primary" onClick={() => openModal(book, "setMax", setPage)}>Start Reading</button>
            <button className="btn-secondary" onClick={() => handleDelete(book._id, true)}>Delete Book</button>
          </div>) :
          <div>
            <p>You haven't saved anything yet, books you save will appear here</p>
          </div>}
      </section>
</>
  
  );
}

export default Book_Section;