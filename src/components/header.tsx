import { Link } from "react-router-dom";
import logo from "/logo.svg"

type props = {
  nav: [string, string][]; // [ruta, texto]
};

//Estructura del header - recibe los elementos de navegacion
export const Header = ({ nav }: props) => {
  return (
    /* Header de la pagina - Flexbox, items centrados, background amarillo, altura de 10% */
    <header className="flex items-center bg-yellow-300 h-1/10">
      {/* Logo de la pagina - 10% de ancho y alto del header*/}
      <img src={logo} className="h-1/1 w-1/10" />
      {/* Navegador de la pagina - Flexbox, items centrados, sin estilos en la letra, separacion entre elementos*/}
      <nav className="flex items-center style-none justify-around w-9/10">
        {//Lista los elementos de navegacion
          nav.map(([ruta, texto], idx) => (
            <Link key={idx} to={ruta}>
              {texto}
            </Link>
          ))}
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