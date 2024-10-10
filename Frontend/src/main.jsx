import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import "./index.css"
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import UserTable from './components/UserTable.jsx';
import Login from './Login/Login.jsx';
import Home from './pages/Home.jsx';
import ImportPage from './pages/ImportPage/ImportPage.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
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
      }
    ]
  },
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
