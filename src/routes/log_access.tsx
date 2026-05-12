import { Header } from "../elements/header";
import { Footer } from "../elements/footer";
import { Login } from "../components/login";

/**
 * Vista base del login.
 * 
 * @returns {JSX.Element} Componente visual de la base del login
 */
export default function LogAccess() {
  //Interfaz de la base del login
  return (
    <div className="min-h-screen flex flex-col">
      {/*Header*/}
      <Header nav={[["/Registro", "Registrarme"], ["/Emisora", "Emisora"]]} />
      {/*Contenido del login*/}
      <Login />
      {/*Pie de pagina*/}
      <Footer />
    </div>
  );
}