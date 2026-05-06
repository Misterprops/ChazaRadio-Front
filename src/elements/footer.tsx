import { Button } from "./button";
import { Link } from "react-router-dom";

//Estructura del footer
export const Footer = () => {
  return (
    //Footer - Flexbox, items centrados, horientado a columna, background rojo, altura del 10%
    <footer className="flex items-center flex-col bg-red-600">
      <nav className="fixed bottom-0 w-full flex md:hidden">
        <Button><Link to={"/Emisora"}>Radio</Link></Button>
        <Button><Link to={"/Lista"}>Lista</Link></Button>
        <Button><Link to={"/"}>Social</Link></Button>
        <Button><Link to={"/Perfil"}>Perfil</Link></Button>
      </nav>
      <span className="text-sm md:text-lg">Elaborado por: Andres y Alejandro</span>
      <span className="text-sm md:text-lg">Idea de Marlon</span>
      <span className="text-sm md:text-lg">Desarrollado para la UD</span>
    </footer>
  );
}