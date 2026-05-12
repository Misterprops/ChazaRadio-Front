import { Emisora_main } from "../components/emisora_main";
import { Header } from "../elements/header";
import { Footer } from "../elements/footer";
import { useAuth } from "../functions/authContext";

/**
 * Vista base de la emisora.
 * 
 * @remarks
 * - Varia su barra de navegación segun el usuario
 *   - Si el usuario es invitado, muestra el login
 *   - Si el usuario esta verificado, muestra la red social
 * 
 * @returns {JSX.Element} Componente visual de la base de la emisora
 */
export default function Emisora() {
  //Obtiene el token del usuario
  const { token } = useAuth();
  //Interfaz de la base de la emisora
  return (
    <div className="min-h-screen flex flex-col">
      {/*Header variable*/}
      {token ? <Header nav={[["/", "Inicio"]]} /> : <Header nav={[["/Login", "Login"]]} />}
      {/*Contenido de la emisora*/}
      <Emisora_main />
      {/*Pie de pagina*/}
      <Footer />
    </div>
  );

}
