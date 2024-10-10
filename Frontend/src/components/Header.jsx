import React from "react";
import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <div className="flex w-full justify-between py-6 bg-zinc-900 text-white items-center section-container ">
      <div className="">
        
      </div>

      <ul className="flex space-x-6 md:space-x-12">
        <NavLink
          to="/"
          style={({ isActive }) => ({
            color: isActive ? "blue" : "white",
          })}
        >
          Home
        </NavLink>
        <NavLink
          to="/import"
          style={({ isActive }) => ({
            color: isActive ? "blue" : "white",
          })}
        >
          Import
        </NavLink>
        <NavLink
          to="/users"
          style={({ isActive }) => ({
            color: isActive ? "blue" : "white",
          })}
        >
          Users
        </NavLink>
      </ul>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="space-x-3">
          <button className="bg-red-600 px-3 py-1 rounded-lg">Logout</button>
          <button className="bg-blue-600 px-3 py-1 rounded-lg">Login</button>
        </div>
        <div className="flex items-center w-32 gap-2">
          <img
            src="https://img.icons8.com/ios-filled/50/ffffff/user-male-circle.png"
            className="w-8"
            alt=""
          />
          <p>Ritik Mehta</p>
        </div>
      </div>
    </div>
  );
};

export default Header;
