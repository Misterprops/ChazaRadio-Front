import { Link } from "react-router-dom";
import logo from "/logo.png"
import ud_logo from "/ud_logo.png"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const API = import.meta.env.VITE_APP_API;

type props = {
  nav: [string, string][]; // [ruta, texto]
};

//Estructura del header - recibe los elementos de navegacion
export const Header = ({ nav }: props) => {
  const [auth, setAuth] = useState<boolean | null>(null)
  const navigate = useNavigate();
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        setAuth(false)
        return
      }
      try {
        const res = await fetch(`${API}/api/verify`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        if (!res.ok) {
          setAuth(false)
          return
        }
        setAuth(true)
        return
      } catch (error) {
        setAuth(false)
        console.log(error)
      }
    }

    checkAuth()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    /* Header de la pagina - Flexbox, items centrados, background amarillo, altura de 10% */
    <header className="flex items-center bg-yellow-300 h-1/10">
      {/* Logo de la pagina - 10% de ancho y alto del header*/}

      {/* Navegador de la pagina - Flexbox, items centrados, sin estilos en la letra, separacion entre elementos*/}
      <nav className="flex items-center style-none justify-around w-9/10">
        <img src={logo} className="h-1/1 w-1/10" />
        {//Lista los elementos de navegacion
          nav.map(([ruta, texto], idx) => (
            <Link key={idx} to={ruta}>
              {texto}
            </Link>
          ))}
        <img src={ud_logo} className="w-1/20" />
        {auth && <button className="bg-red-400 hover:cursor-pointer border h-10 w-1/10" onClick={handleLogout}>Salir</button>}
      </nav>
    </header>
  );
}
//Funcion que lista el array de navegacion
/*function listar(array) {
  //Mapeo del array
  const elements = array.map(element => <div className="flex"><Link to={element[0]}>{element[1]}</Link></div>)
  return elements
}*/