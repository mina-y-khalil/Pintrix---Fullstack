import { createBrowserRouter } from 'react-router-dom';

// Auth routes
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';

// Layout wrapper
import Layout from './Layout';

// Favorites
import FavoritesList from '../components/Favorites/FavoritesList';

// Pin-related components
import PinsGrid from '../components/Pins/PinsGrid';
import CreatePinForm from '../components/Pins/CreatePinForm';
import EditPinForm from "../components/Pins/EditPinForm";
import PinDetail from "../components/Pins/PinDetail";

// Board-related components
import BoardsList from '../components/BoardsList';
import BoardDetail from '../components/BoardDetail';
import ManageBoards from '../components/ManageBoards/ManageBoards';
import BoardCreateForm from '../components/BoardCreateForm'; // or BoardCreateModal, not both
// import BoardCreateModal from '../components/BoardCreateModal/BoardCreateModal'; // use if preferred
import ManagePinsInBoard from '../components/ManagePinsInBoard/ManagePinsInBoard';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      // Homepage
      {
        path: "/",
        element: <PinsGrid />,
      },
      // Auth routes
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
      // Favorites
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
        element: <BoardCreateForm />, // or <BoardCreateModal />
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
      // Pin routes
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
