import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import "./index.css";

/**
 * Base del SPA.
 * 
 * @remarks
 * - Aqui se maneja el RouterProvider para el manejo del SPA
 * 
 * @returns {JSX.Element} Componente visual de la base del SPA
 */
ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);