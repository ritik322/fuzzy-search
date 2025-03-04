import React, { useEffect, useState } from "react";
import "./Login.css"; // Import the custom login styles
import { useNavigate, useOutletContext } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS file for styling

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useOutletContext();

  useEffect(() => {
    if (isLogin) {
      navigate("/home");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username && password) {
      // Pass the username to the login function in App
      const res = await axios
        .post(
          "https://fuzzy-search-backend.vercel.app/api/v1/user/login-user",
          {
            username,
            password,
          },
          { withCredentials: true }
        )
        .then((res) => res.data).catch(err => err)
      console.log(res);
      if (res.isLogin) {
        toast.success("Logged in successfully!");
        localStorage.setItem("isLogin",true)
        setIsLogin(true);
        navigate("/home",{state: {userData: res.data}});
      } else {
        toast.error("Either password or username is incorrect");
      }
    } else {
      setError("Please enter both username and password");
    }
  };

  return (
    <div className="login-container max-h-[805px] section-container">
      <div className="login-box">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
