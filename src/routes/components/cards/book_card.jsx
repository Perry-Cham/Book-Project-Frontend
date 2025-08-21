import {Link} from 'react-router-dom';
function Book_Card({book, dsynopsis}){
  
  return(
    <div className="text-capitalize my-4 px-4">
      <img className="w-[150px]" src={book.cover} alt={book.title +  " cover image"}/>
        <p>{book.title}</p>
        <p>{book.author}</p>
        <p>{book.genre}</p>
        <p>{book.pageCount}</p>
        <button  className="box-border inline-block h-[2rem] bg-blue-900 text-white px-4 "><Link to={`/download/${book._id}`}>Save Book</Link></button>
    </div>
    )
}
export default Book_Card;