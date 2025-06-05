import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <Link to="/" className="font-bold text-lg">Lost & Found</Link>
      <div className="space-x-4">
        <Link to="/signin" className="hover:underline">Sign In</Link>
        <Link to="/signup" className="hover:underline">Sign Up</Link>
        <Link to="/add-item" className="bg-green-500 text-white px-4 py-2 rounded">
  + Add Lost Item
</Link>
      </div>
    </nav>
  );
};

export default Navbar;
