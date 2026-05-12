import { Social_main } from "../components/social_base";
import { Header } from "../elements/header";
import { Footer } from "../elements/footer";

/**
 * Vista base de la red social.
 * 
 * @returns {JSX.Element} Componente visual de la base de la red social
 */
export default function Home() {
  //Interfaz de la base de la red social
  return (
    <div className="min-h-screen flex flex-col">
      {/*Header*/}
      <Header nav={[["/Emisora", "Emisora"]]} />
      {/*Contenido de la red social*/}
      <Social_main />
      {/*Pie de pagina*/}
      <Footer />
    </div>
  );
}
