import {Link} from 'react-router-dom';
function Navigation_Bar(){
  return(
    <nav className="py-4 pl-4 border-2 flex justify-between items-center">
      <h2 className="text-lg border-2">P'S BOOKS</h2>
      <ul className="border-2 flex md:justify-center md:items-center">
        <li className="px-4"><Link to="/home">Home</Link></li>
        <li className="px-4"><Link to="/goal">Goals</Link></li>
        <li className="px-4"><Link to="/study">Study</Link></li>
      </ul>
    </nav>
    )
}

export default Navigation_Bar;