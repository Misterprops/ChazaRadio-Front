import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./routes/home";
import Emisora from "./routes/emisora";
import LogAccess from "./routes/log_access";
import RegAccess from "./routes/reg_access";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <LogAccess /> },
      { path: "emisora", element: <Emisora /> },
      { path: "registro", element: <RegAccess /> }
    ],
  },
]);