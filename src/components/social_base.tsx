import { Lista } from "./lista";
import { Perfil } from "./perfil";
import { Red_social } from "./red_social";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "./authContext";

/**
 * Vista principal de la red social.
 * 
 * Estructura:
 * - Perfil (izquierda)
 * - Feed (centro)
 * - Lista de reproducción (derecha)
 * 
 * Requiere autenticación.
 * 
 * @component
 * @returns {JSX.Element}
 */
export const Social_main = () => {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();
  const [refreshAudios, setRefreshAudios] = useState(0);

  useEffect(() => {
    const proteccion = async () => {
      if (!await checkAuth()) {
        navigate("/Login")
      }
    }
    proteccion()
  }, [])

  return (
    <>
      {/*Main del html - Flexbox, justificado al centro, paddin arriba y abajo de 1 rem (16px)*/}
      <main className="flex justify-center pt-4 pb-4 flex-1 bg-blue-50">
        {/* Seccion 1: Un tercio del ancho del main y todo su alto para el perfil de usuario */}
        <section className="hidden md:w-4/15 md:flex">
          {/* Perfil del usuario */}
          <Perfil triggerRefresh={() => setRefreshAudios(prev => prev + 1)} />
        </section>
        {/* Seccion 2: Dos tercios del ancho del main y todo su alto para el buffer de la red social */}
        <section className="w-full md:w-6/15">
          {/* Red social */}
          <Red_social />
        </section>
        {/* Seccion 3: Un tercio del ancho del main y todo su alto para la lista de reproduccion */}
        <section className="hidden md:w-5/15 md:flex">
          {/* Lista de reproduccion */}
          <Lista refresh={refreshAudios} />
        </section>
      </main>
    </>
  );
}