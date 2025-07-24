import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import Layout from './Layout';
<<<<<<< HEAD
import FavoritesList from '../components/FavoritesList/FavoritesList';
=======
import FavoritesList from '../components/Favorites/FavoritesList';
import PinsGrid from '../components/Pins/PinsGrid';
import EditPinForm from "../components/Pins/EditPinForm";
import PinDetail from "../components/Pins/PinDetail";


import BoardsList from '../components/BoardsList';
import BoardDetail from '../components/BoardDetail';
import ManagePinsInBoard from '../components/ManagePinsInBoard/ManagePinsInBoard';
import ManageBoards from '../components/ManageBoards/ManageBoards';
import BoardCreateModal from '../components/BoardCreateModal/BoardCreateModal';
import CreatePinForm from "../components/Pins/CreatePinForm";
>>>>>>> dev

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
      {
        path: "pins",
        element: <PinsGrid />,
      },
      {
        path: "pins/:id/edit",
        element: <EditPinForm />,
      },
      {
       path: "pins/:id",
       element: <PinDetail />,
      },
       { path: "pins/new", 
        element: <CreatePinForm /> 
      },


    ],
  },
]);
