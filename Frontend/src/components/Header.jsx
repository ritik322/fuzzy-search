import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import { toast } from "react-toastify";

const Header = ({ isLogin, setIsLogin }) => {
  const [loggedUserData, setLoggedUserData] = useState(null);

  const location = useLocation();
  useEffect(()=>{
    setLoggedUserData(location.state?.userData)
  },[])
  const navigate = useNavigate();
  const handleLogout = async (e) => {
    const data = await axios
      .get("http://localhost:3000/api/v1/user/logout", {
        withCredentials: true,
      })
      .then((res) => res.data).catch( e => e.response.data)
    if (data.success) {
      toast.success("Logout Successfully");
      localStorage.setItem("isLogin", false);
      setIsLogin(false);
      navigate("/");
    }
    else{
      toast.error("Login first")
      localStorage.setItem("isLogin",false)
      setIsLogin(false)
      navigate("/")
    }
  };


  return (
    <div className="flex w-full justify-between py-6 bg-zinc-900 text-white items-center section-container ">
      <div className="">SMART NAME RECOGNITION</div>

      <ul className="flex space-x-6 md:space-x-12">
        {isLogin ? (
          <>
            <NavLink
              to="/home"
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
            <NavLink
              to="/dashboard"
              style={({ isActive }) => ({
                color: isActive ? "blue" : "white",
              })}
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/feedback"
              style={({ isActive }) => ({
                color: isActive ? "blue" : "white",
              })}
            >
              Feedback
            </NavLink>
            <NavLink
              to="/review"
              style={({ isActive }) => ({
                color: isActive ? "blue" : "white",
              })}
            >
              Review
            </NavLink>
          </>
        ) : (
          ""
        )}
      </ul>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="space-x-3">
          {isLogin ? (
            <button
              onClick={handleLogout}
              className="bg-red-600 px-3 py-1 rounded-lg"
            >
              Logout
            </button>
          ) : (
            ""
          )}
        </div>
        <div className="flex items-center w-32 gap-2">
          {isLogin ? (
            <>
              <img
                src={loggedUserData?.avatar}
                className="w-8 rounded-full"
                alt=""
              />
              <p>{loggedUserData?.username}</p>{" "}
            </>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
