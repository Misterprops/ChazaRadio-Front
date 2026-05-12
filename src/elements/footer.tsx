import { Button } from "./button";
import { Link } from "react-router-dom";

/**
 * Vista principal del footer.
 * 
 * @remarks
 * - Tiene control para dispositivos moviles
 * - Usado en todas las paginas
 * @returns {JSX.Element} Componente visual del footer
 */
export const Footer = () => {
  return (
    //Footer con los creditos de elaboracion
    <footer className="flex items-center flex-col bg-red-600">
      {/*Barra de navegación para moviles*/}
      <nav className="fixed bottom-0 w-full flex md:hidden">
        <Button><Link to={"/Emisora"}>Radio</Link></Button>
        <Button><Link to={"/Lista"}>Lista</Link></Button>
        <Button><Link to={"/"}>Social</Link></Button>
        <Button><Link to={"/Perfil"}>Perfil</Link></Button>
      </nav>
      {/*Creditos */}
      <span className="text-sm md:text-lg">Proyecto en construccion por Andres Rodriguez y Alejandro Suarez</span>
      <span className="text-sm md:text-lg">Idea original del grupo SPARK</span>
      <span className="text-sm md:text-lg">Desarrollado para la Universidad Distrital</span>
      <span className="text-sm md:text-lg">Disclaimer: Este es un proyecto avalado y desarrollado para la Universidad Distrital</span>
    </footer>
  );
}