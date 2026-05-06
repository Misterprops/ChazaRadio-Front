import { Header } from "../elements/header";
import { Footer } from "../elements/footer";
import { Register } from "../components/register";

// renders after the loader is done
export default function RegAccess() {
  //Formacion de acceso - Header envia por props los elementos de navegacion, El cuerpo del documento y el footer
  return (
    <div className="min-h-screen flex flex-col">
      <Header nav={[["/Login", "Login"], ["/Emisora", "Emisora"]]} />
      <Register />
      <Footer />
    </div>
  );
}