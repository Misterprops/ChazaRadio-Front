import { Header } from "../elements/header";
import { Footer } from "../elements/footer";
import { Register } from "../components/register";

/**
 * Vista base del registro
 * 
 * @returns {JSX.Element} Componente visual de la base del registro
 */
export default function RegAccess() {
  //Interfaz de la base del registro
  return (
    <div className="min-h-screen flex flex-col">
      {/*Header*/}
      <Header nav={[["/Login", "Login"], ["/Emisora", "Emisora"]]} />
      {/*Contenido del registro*/}
      <Register />
      {/*Pie de pagina*/}
      <Footer />
    </div>
  );
}