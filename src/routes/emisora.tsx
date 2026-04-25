import { Emisora_main } from "../components/emisora_main";
import { Header } from "../elements/header";
import { Footer } from "../elements/footer";
import { useAuth } from "../components/authContext";

export default function Home() {
  //Formacion de la pagina inicial - Header envia por props los elementos de navegacion, El cuerpo del documento y el footer
  const { token } = useAuth();
  return (
    <>
      {token ? <Header nav={[["/", "Inicio"]]} /> : <Header nav={[["/Login", "Login"]]} />}
      <Emisora_main />
      <Footer />
    </>
  );

}
