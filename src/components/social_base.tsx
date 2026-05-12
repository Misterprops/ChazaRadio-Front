import { Lista } from "./lista";
import { Perfil } from "./perfil";
import { Red_social } from "./red_social";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../functions/authContext";

/**
 * Vista principal de la red social.
 * 
 * @remarks
 * - Valida autenticación del usuario
 * - Estructura para movil
 *   - Red social
 * - Estructura otros dispositivos:
 *   - Perfil (izquierda)
 *   - Feed (centro)
 *   - Lista de reproducción (derecha)
 * 
 * @returns {JSX.Element} Componente base de la red social
 */
export const Social_main = () => {
  //Hook de redirección
  const navigate = useNavigate();
  //Credenciales de usuario del authContext
  const { checkAuth } = useAuth();
  //Hook para actualizar la lista desde el perfil
  const [refreshAudios, setRefreshAudios] = useState(0);

  /**
   * Hook que se ejecuta al montar el componente
   * Llama a proteccion para validar la sesión del usuario
   */
  useEffect(() => {
    /**
     * Valida la sesión del usuario
     * 
     * @internal
     * @returns {void}
     */
    const proteccion = async () => {
      //Si el usuario no es valido, lo regresa al login
      if (!await checkAuth()) {
        navigate("/Login")
      }
    }
    //Llama la funcion proteccion
    proteccion()
  }, [])

  //Interfaz de la base de la red social
  return (
    <>
      <main className="flex justify-center pt-4 pb-4 flex-1 bg-blue-50">
        {/* Seccion 1: Contiene el perfil del usuario (Oculto en dispositivos moviles) */}
        <section className="hidden md:w-4/15 md:flex">
          {/* Perfil del usuario con el estado para actualizar la lista */}
          <Perfil triggerRefresh={() => setRefreshAudios(prev => prev + 1)} />
        </section>
        {/* Seccion 2: Contiene la red social (Ocupa todo el dispositivo movil) */}
        <section className="w-full md:w-6/15">
          {/* Red social */}
          <Red_social />
        </section>
        {/* Seccion 3: Contiene la lista de audios (Oculto en dispositivos moviles) */}
        <section className="hidden md:w-5/15 md:flex">
          {/* Lista de reproduccion con el estado para refrezcar la lista */}
          <Lista refresh={refreshAudios} />
        </section>
      </main>
    </>
  );
}