import { createBrowserRouter } from 'react-router-dom';

// Auth routes
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';

// Layout wrapper
import Layout from './Layout';

// Favorites
import FavoritesList from '../components/FavoritesList';

// Pin-related components
import PinsGrid from '../components/Pins/PinsGrid';
import PinsGridPersonal from '../components/Pins/PinsGridPersonal';
import CreatePinForm from '../components/Pins/CreatePinForm';
import EditPinForm from "../components/Pins/EditPinForm";
import PinDetail from "../components/Pins/PinDetail";

// Board-related components
import BoardsList from '../components/BoardsList';
import BoardDetail from '../components/BoardDetail';
import BoardCreateForm from '../components/BoardCreateForm'; 
import ManagePinsInBoard from '../components/ManagePinsInBoard';


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
        element: <PinsGridPersonal />,
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
