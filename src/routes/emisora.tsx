import { Emisora_main } from "../components/emisora_main";
import { Header } from "../components/header";
import { Footer } from "../components/footer";

export default function Home() {
  //Formacion de la pagina inicial - Header envia por props los elementos de navegacion, El cuerpo del documento y el footer
  return [<Header nav={[["/","Inicio"], ["/Login", "Login"]]}/>, <Emisora_main />, <Footer />]
}
