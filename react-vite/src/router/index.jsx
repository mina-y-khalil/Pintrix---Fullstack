import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import Layout from './Layout';
import FavoritesList from '../components/Favorites/FavoritesList';
import BoardsList from '../components/BoardsList';
import BoardDetail from '../components/BoardDetail';
import ManagePinsInBoard from '../components/ManagePinsInBoard/ManagePinsInBoard';
import ManageBoards from '../components/ManageBoards/ManageBoards';
import BoardCreateModal from '../components/BoardCreateModal/BoardCreateModal';


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
        element: <BoardsList />,
      },
      {
        path: "boards/:boardId",
        element: <BoardDetail />,
      },
      {
        path: "boards/create",
        element: <BoardCreateModal />,
      },
      {
        path: "boards/manage",
        element: <ManageBoards />,
      },
      {
        path: "boards/:boardId/manage-pins",
        element: <ManagePinsInBoard />,
      },
    ],
  },
]);