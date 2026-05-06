import { Social_main } from "../components/social_base";
import { Header } from "../elements/header";
import { Footer } from "../elements/footer";

export default function Home() {
  //Formacion de la pagina inicial - Header envia por props los elementos de navegacion, El cuerpo del documento y el footer
  return (
    <div className="min-h-screen flex flex-col">
      <Header nav={[["/Emisora", "Emisora"]]} />
      <Social_main />
      <Footer />
    </div>
  );
}
