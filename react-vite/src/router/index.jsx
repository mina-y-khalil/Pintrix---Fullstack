import { createBrowserRouter } from 'react-router-dom';

//Auth routes
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';

//Layout wrapper
import Layout from './Layout';

//Pin-related components
import PinsGrid from '../components/Pins/PinsGrid';
import CreatePinForm from '../components/Pins/CreatePinForm';
import EditPinForm from "../components/Pins/EditPinForm";
import PinDetail from "../components/Pins/PinDetail";

//Favorites
import FavoritesList from '../components/Favorites/FavoritesList';

//Board-related components
import BoardsList from '../components/BoardsList';
import BoardDetail from '../components/BoardDetail';
import ManageBoards from '../components/ManageBoards/ManageBoards';
import BoardCreateModal from '../components/BoardCreateModal/BoardCreateModal';
import ManagePinsInBoard from '../components/ManagePinsInBoard/ManagePinsInBoard';

//Route config
export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      //Homepage shows all pins
      {
        path: "/",
        element: <PinsGrid />,
      },
      //Auth routes
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
      //User favorites
      {
        path: "favorites",
        element: <FavoritesList />,
      },
      // Board routes
      {
        path: "boards",
        element: <BoardsList />,
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
        path: "boards/:boardId",
        element: <BoardDetail />,
      },
      {
        path: "boards/:boardId/manage-pins",
        element: <ManagePinsInBoard />,
      },
      //Pin routes
      {
        path: "pins",
        element: <PinsGrid />,
      },
      {
        path: "pins/new",
        element: <CreatePinForm />,
      },
      {
        path: "pins/:id",
        element: <PinDetail />,
      },
      {
        path: "pins/:id/edit",
        element: <EditPinForm />,
      },
    ],
  },
]);