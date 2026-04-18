import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { Login } from "../components/login";

// renders after the loader is done
export default function Component() {
  //Formacion de acceso - Header envia por props los elementos de navegacion, El cuerpo del documento y el footer
  return [<Header nav={[["/Registro","Registrarme"], ["/Emisora", "Emisora"]]}/>,<Login/>,<Footer/>]
}