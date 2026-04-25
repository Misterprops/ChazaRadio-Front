import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";   // <-- IMPORTA TU ROUTER
import "./index.css";
import { AuthProvider } from "./components/authContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />  {/* <-- ESTO ES LO QUE FALTABA */}
    </AuthProvider>
  </React.StrictMode>
);