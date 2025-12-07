import { useState, useEffect } from 'react'
import axios from 'axios'
import Book_Card from '../../components/cards/book_card'
import Modal from '../../components/modal'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import api from '../../utilities/api'

function Book_Section({ props, bookProps }) {
  const { openModal, modalState, setModalState } = props;
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
      const response = await api.post(`/${endpoint}`, data);
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
      const response = await api.get(`/getcurrentbooks`);
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
      const response = await api.get(`/getsavedbooks`, { withCredentials: true });
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
        const response = await api.delete(`/deletesaved/${id}`, {
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
        const response = await api.delete(`/deletecurrent/${id}`, {
          withCredentials: true
        });
        if (response.status == 200) {
          alert("You have deleted the book successfully");
          getCurrentBooks();
        } else {
          alert("Server side error");
        }
      } catch (err) {
        console.error(err);
        alert("Server side error");
      }
    }
  }
  async function handleAddCustom(data) {
    try {
      const response = await axios.post(`${api}/addcustombook`, data, {
        withCredentials: true
      })
      console.log(response)
      if (response.status == 200) {
        alert(`Congratulations you've just started ${data.title}`);
        getCurrentBooks();
        getSavedBooks();
      } else {
        alert('Error adding book');
      }
    } catch (err) {
      console.error(err)
    }
  }
  return (
    <>
      <section className="py-4 my-2 mx-1 bg-white rounded-sm">
        <h2 className="text-center font-medium text-lg">Currently Reading</h2>
      
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={50}
          slidesPerView={window.innerWidth < 640 ? 1 : 3}
          navigation
          pagination={{ clickable: true }}
          className="pb-4 px-11"
        >
          {cbooks ? cbooks.map((book) =>
            <SwiperSlide><Book_Card book={book} type={"currentBook"} functions={{ openModal, setPage, handleDelete }} /></SwiperSlide>) :
            <SwiperSlide><div>
              <p>You haven't started reading anything yet, books you read will appear here</p>
            </div></SwiperSlide>}

        </Swiper>
      </section>
      <section className="pt-4 my-2 mx-1 bg-white rounded-sm">
        <h2 className="text-center font-medium text-lg">Saved Books</h2>
                <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={50}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          className="pb-4 px-2"
        >
          {sbooks ? sbooks.map((book) =>
            <SwiperSlide><Book_Card book={book} type={"savedBook"} functions={{ openModal, setPage, handleDelete }} /></SwiperSlide>) :
            <SwiperSlide><div>
              <p>You haven't started reading anything yet, books you read will appear here</p>
            </div></SwiperSlide>}

        </Swiper>
        {/*sbooks ? sbooks.map((book) =>
          <Book_Card book={book} type={"savedBook"} functions={{ openModal, setPage, handleDelete }} />
        ) :
          <div>
            <p>You haven't saved anything yet, books you save will appear here</p>
          </div>*/}
      </section>
    </>
  );
}

export default Book_Section;