import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { Logger } from "../components/logger";

// renders after the loader is done
export default function Component() {
  //Formacion de acceso - Header envia por props los elementos de navegacion, El cuerpo del documento y el footer
  return [<Header nav={[["/","Inicio"], ["/Emisora", "Emisora"]]}/>,<Logger/>,<Footer/>]
}