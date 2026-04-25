import { Header } from "../elements/header";
import { Footer } from "../elements/footer";
import { Login } from "../components/login";

// renders after the loader is done
export default function LogAccess() {
  //Formacion de acceso - Header envia por props los elementos de navegacion, El cuerpo del documento y el footer
  return (
    <>
      <Header nav={[["/Registro", "Registrarme"], ["/Emisora", "Emisora"]]} />
      <Login />
      <Footer />
    </>
  );
}