import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../stores/auth_store'
import axios from 'axios'
import Book_Card from '../components/cards/book_card'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
function Home() {
  const api = import.meta.env.VITE_API
  console.log(api, typeof api)
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [active, setActive] = useState("All");
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)
  const navigate = useNavigate();
  console.log(user)
  useEffect(() => {
    async function fetchData() {
      try {
        let response = await axios.get(`${api}/allbooks`, { withCredentials: true })
        setBooks(response.data)
      }
      catch (err) {
        console.error(err)
      }
    }
    fetchData();
  }, [])
  useEffect(() => {
    setGenres(() => makeGenres(books))
  }, [books])
  function makeGenres(data) {
    const Data = data
    const genres = []
    for (let Book of data) {
      const genre = genres.find(b => b === Book.genre)
      if (!genre) {
        genres.push(Book.genre)
      }
    }
    genres.unshift('All')
    console.log(genres)
    return genres
  }
  function filterBooks() {
    const filtered = books.filter(book => book.genre == active)
    return filtered;
  }
  return (
    <section className="bg-theme">
      <h2 className="text-center pt-4 font-bold mb-2 text-lg">Welcome, {user.name && user.name}</h2>

      <Swiper
        spaceBetween={20}
       slidesPerView={window.innerWidth < 640 ? 2 : 4}
        className="pb-4 px-5"
      >
        {genres.length > 0 && genres.map(genre => (<SwiperSlide><div onClick={() => setActive(genre)} className={`border-2 rounded-lg transition-color duration-100 ${active == genre ? "bg-blue-500 border-blue-500 text-white font-bold" : "bg-white"}`}>
          <p className="text-center">{genre}</p>
        </div></SwiperSlide>))}
      </Swiper>
      <div className="grid grid-cols-2 md:grid-cols-3 px-1 gap-1 md:gap-3">
        {(books && active === "All") && books.map((book) => {
          return (
            <Book_Card key={book.id}
              book={book}
              type={"homeBook"}
            />)
        })}
      </div>
   {active !== 'All' &&  <div className="grid grid-cols-2 md:grid-cols-[repeat(auto-fill, minmax(200px, 1fr))] px-1 gap-1 min-h-[100vh]">
        {(books && active !== "All") && filterBooks().map(book => (<Book_Card key={book.id}
          book={book}
          type={"homeBook"}
        />))}
      </div>}
    </section>
  )
}

export default Home;