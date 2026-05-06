import { Link } from "react-router-dom";
import logo from "/logo.png"
import ud_logo from "/ud_logo.png"
import { useNavigate } from "react-router";
import { useAuth } from "../components/authContext";

type props = {
  nav: [string, string][]; // [ruta, texto]
};

//Estructura del header - recibe los elementos de navegacion
export const Header = ({ nav }: props) => {

  const { user, logout, reloadToken } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/Login");
  };

  return (
    /* Header de la pagina - Flexbox, items centrados, background amarillo, altura de 10% */
    <header className="flex items-center bg-yellow-300">
      {/* Logo de la pagina - 10% de ancho y alto del header*/}

      {/* Navegador de la pagina - Flexbox, items centrados, sin estilos en la letra, separacion entre elementos*/}
      <nav className="flex items-center style-none justify-around w-9/10">
        <img src={logo} className="w-1/4 md:w-1/10" />
        {//Lista los elementos de navegacion
          nav.map(([ruta, texto], idx) => (
            <Link key={idx} to={ruta} className="text-sm md:text-lg" onClick={reloadToken}>
              {texto}
            </Link>
          ))}
        <img src={ud_logo} className="w-1/8 md:w-1/20" />
        {user && <button className="bg-red-400 hover:cursor-pointer border pl-2 pr-2 md:h-20 md:w-1/10 md:text-lg" onClick={handleLogout}>Salir</button>}
      </nav>
    </header>
  );
}