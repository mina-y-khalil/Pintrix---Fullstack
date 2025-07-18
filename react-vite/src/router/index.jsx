import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import BoardList from '../components/BoardList';
import Layout from './Layout';
import FavoritesList from '../components/Favorites/FavoritesList';


export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <h1>Welcome!</h1>,
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "favorites",          // ✅ NEW ROUTE
        element: <FavoritesList />, // ✅ NEW COMPONENT
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
            {
        path: "boards",
        element: <BoardList />,
      },
    ],
  },
]);