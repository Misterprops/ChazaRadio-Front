import { Outlet } from "react-router-dom";
import { AuthProvider } from "./functions/authContext";

/**
 * Base de la pagina.
 * 
 * @remarks
 * - Aqui se maneja el AuthProvider con los datos del usuario
 * 
 * @returns {JSX.Element} Componente visual de la base de la pagina
 */
export default function App() {
  //Interfaz de la base de la emisora
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}