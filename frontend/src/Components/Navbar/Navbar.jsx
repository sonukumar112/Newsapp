import React, { useState } from 'react';
import logo from '../../assets/newsmania.png';
import { IoIosMenu } from 'react-icons/io';
import { IoMdClose } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { useNews } from '../NewsContext';

function Navbar() {
  const { setSearchQuery } = useNews();
  const [isVisible, setIsVisible] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
  };

  const handleClick = () => {
    setIsVisible(!isVisible);
  };

  return (
    <nav className="p-3 flex bg-gray-800 justify-between items-center text-white">
      <Link to="/">
        <img src={logo} alt="Logo" className="object-cover w-56 h-14 rounded-sm" />
      </Link>

      <form className="flex items-center justify-center gap-2 h-12" onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="Search Newspaper.."
          className="md:w-[350px] h-8 rounded-md text-gray-900"
          value={searchInput}
          onChange={handleSearchChange}
        />
        <button type="submit" className="md:border rounded-md p-0.5 bg-red-700 w-20">
          Search
        </button>
      </form>

      <div className="hidden md:flex gap-5 justify-center items-center">
        <ul className="flex gap-12">
          <li>
            <Link to="/" className="hover:text-red-500 font-semibold">Home</Link>
          </li>
          <li>
            <Link to="/saved" className="hover:text-red-500 font-semibold">Saved</Link>
          </li>
          <li>
            <Link to="/notes" className="hover:text-red-500 font-semibold">Notes</Link>
          </li>
          <li>
            <Link to="/feedback" className="hover:text-red-500 font-semibold">Feedback</Link>
          </li>
        </ul>
        {localStorage.getItem("auth-token") ? <Link to="/loginsignup" className="border rounded-lg p-1 text-lg hover" onClick={()=>{localStorage.removeItem("auth-token");window.location.replace("/")}}>Logout</Link>:<Link to="/loginsignup" className="border rounded-lg p-1 text-lg hover">Login</Link>}
      </div>

      <button className="p-2 md:hidden" onClick={handleClick}>
        <IoIosMenu />
      </button>

      {isVisible && (
        <div className="fixed bg-gray-800 inset-0 p-3 z-50 backdrop-blur-sm">
          <div className="flex justify-between">
            <Link to="/">
              <img src={logo} alt="Logo" className="object-cover w-24 h-14 rounded-sm" />
            </Link>
            <button className="p-2" onClick={handleClick}>
              <IoMdClose />
            </button>
          </div>
          <div className="mt-6">
            <Link to="/" className="font-medium m-3 p-3 hover:bg-gray-600 block rounded" onClick={handleClick}>Home</Link>
            <Link to="/saved" className="font-medium m-3 p-3 hover:bg-gray-600 block rounded" onClick={handleClick}>Saved</Link>
            <Link to="/notes" className="font-medium m-3 p-3 hover:bg-gray-600 block rounded" onClick={handleClick}>Notes</Link>
            <Link to="/feedback" className="font-medium m-3 p-3 hover:bg-gray-600 block rounded" onClick={handleClick}>Feedback</Link>
            {localStorage.getItem("auth-token") ? <Link to="/loginsignup" className="font-medium m-3 p-3 hover:bg-gray-600 block rounded" onClick={()=>{localStorage.removeItem("auth-token");window.location.replace("/")}}>Logout</Link>:<Link to="/loginsignup" className="font-medium m-3 p-3 hover:bg-gray-600 block rounded" onClick={handleClick}>Login</Link>}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
