import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import "./index.css"
import {
  createBrowserRouter,
  RouterProvider,
  Navigate
} from "react-router-dom";
import UserTable from './components/UserTable.jsx';
import Login from './Login/Login.jsx';
import Home from './pages/Home.jsx';
import ImportPage from './pages/ImportPage/ImportPage.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx';
import Feedback from './components/Feedback/Feedback.jsx';
import Review from './pages/Review/Review.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Navigate to="/login" />

      },
      {
        path: "/home",
        element: <Home />

      },
      {
        path: "/users",
        element: <UserTable/>
      }, 
      {
        path: "/login",
        element: <Login/>
      },
      {
        path: "/import",
        element: <ImportPage />
      },
      {
        path: "/dashboard",
        element: <Dashboard/>
      },
      {
        path: "/feedback",
        element: <Feedback/>
      },
      {
        path: "/review",
        element: <Review/>
      },
    ]
  },
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
