import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import Layout from './Layout';
import FavoritesList from '../components/FavoritesList/FavoritesList';

import BoardsList from '../components/BoardList'; // ✅ Add these
import BoardDetail from '../components/BoardDetail';
import BoardCreateModal from '../components/BoardCreateModal';
import ManageBoards from '../components/ManageBoards';
import ManagePinsInBoard from '../components/ManagePinsInBoard';

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
        path: "signup",
        element: <SignupFormPage />,
      },
      {
        path: "favorites",
        element: <FavoritesList />,
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
