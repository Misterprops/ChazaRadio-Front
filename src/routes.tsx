import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./routes/home";
import Emisora from "./routes/emisora";
import LogAccess from "./routes/log_access";
import RegAccess from "./routes/reg_access";
import { SwaggerDocs } from "./components/swaggerDocs";
import { PerfilHome } from "./routes/perfil_home";
import { ListaHome } from "./routes/lista_home";

/**
 * Rutas del SPA.
 * 
 * @remarks
 * - Maneja el listado de direcciones del SPA
 * 
 * @returns {JSX.Element} Componente de las rutas del SPA
 */
export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "perfil", element: <PerfilHome /> },
      { index: true, element: <Home /> },
      { path: "lista", element: <ListaHome /> },
      { path: "login", element: <LogAccess /> },
      { path: "emisora", element: <Emisora /> },
      { path: "registro", element: <RegAccess /> },
      { path: "documentacion", element: <SwaggerDocs /> }
    ],
  },
]);