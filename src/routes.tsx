import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./routes/home";
import Emisora from "./routes/emisora";
import Access from "./routes/access";
import { Register } from "./components/register";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Access /> },
      { path: "emisora", element: <Emisora /> },
      { path: "registro", element: <Register /> }
    ],
  },
]);