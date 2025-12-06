import { Social_main } from "../components/social_base";
import { Header } from "../components/header";
import { Footer } from "../components/footer";

export default function Home() {
  //Formacion de la pagina inicial - Header envia por props los elementos de navegacion, El cuerpo del documento y el footer
  return [<Header nav={[["/Login","Login"], ["/Emisora", "Emisora"]]} />, <Social_main />, <Footer />]
}
