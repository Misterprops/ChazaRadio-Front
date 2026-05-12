import { Link } from "react-router-dom";
import logo from "/logo.png"
import ud_logo from "/ud_logo.png"
import { useNavigate } from "react-router";
import { useAuth } from "../functions/authContext";
import { useEffect, useState } from "react";

/**
 * Tipo que define el formato recepción de props
 * @typedef {Object} props
 * @property {[string, string][]} nav - Array de tuplas (Dirección, Nombre)
 */
type props = {
  nav: [string, string][]; // [ruta, texto]
};

/**
 * Vista principal del header.
 * 
 * @remarks
 * - Recibe los elementos de navegacion
 * - Valida el estado del usuario para renovar su token
 * - Maneja el cierre de sesión voluntario del usuario
 * 
 * @param {props} nav - Array de tuplas (Dirección, Nombre)
 * @returns {JSX.Element} Componente visual del header
 */
export const Header = ({ nav }: props) => {
  //Credenciales de usuario del authContext
  const { user, logout, reloadToken } = useAuth();
  //Estado de usuario activo
  const [userActivo, setUserActivo] = useState(false)
  //Hook de redirección
  const navigate = useNavigate();

  /**
   * Hook que se ejecuta al montar el componente y cuando user cambia de estado
   * Permite mostrar y ocultar dinamicamente el boton de cerrar sesión
   */
  useEffect(() => {
    user ? setUserActivo(true) : setUserActivo(false)
  }, [user])

  /**
   * Cierra la sesión del usuario
   * 
   * @internal
   * @returns {void}
   */
  const handleLogout = () => {
    //Cierra la sesión
    logout();
    //Redirecciona al login
    navigate("/Login");
  };

  //Interfaz del header
  return (
    <header className="flex items-center bg-yellow-300">
      {/* Navegador de la pagina */}
      <nav className="flex items-center style-none justify-around w-9/10">
        {/* Logo de la pagina */}
        <img src={logo} className="w-1/4 md:w-1/10" />
        {//Lista los elementos de navegacion
          nav.map(([ruta, texto], idx) => (
            //Link a la ruta
            <Link key={idx} to={ruta} className="text-sm md:text-lg" onClick={reloadToken}>
              {texto}
            </Link>
          ))}
        {/*Logo de la universidad*/}
        <img src={ud_logo} className="w-1/8 md:w-1/20" />
        {/*Boton para cerrar sesión*/}
        {userActivo && <button className="bg-red-400 hover:cursor-pointer border pl-2 pr-2 md:h-20 md:w-1/10 md:text-lg" onClick={handleLogout}>Salir</button>}
      </nav>
    </header>
  );
}