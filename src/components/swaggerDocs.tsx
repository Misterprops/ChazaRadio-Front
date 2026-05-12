import { useEffect, useState } from "react";
import { useAuth } from "../functions/authContext";
import { useNavigate } from "react-router";

const API = import.meta.env.VITE_APP_API;

/**
 * Vista de la documentacion.
 * 
 * @remarks
 * - Valida el usuario activo y que sea un administrador
 * - Comparte los enlaces a la documentación
 * 
 * @returns {JSX.Element} Componente visual de la documentación
 */
export const SwaggerDocs = () => {
  //Bandera de autenticación
  const [docs, setDocs] = useState(false)
  //Datos del usuario
  const { user, checkAuth, loading } = useAuth();
  //Hook de redirección
  const navigate = useNavigate();

  /**
   * Hook que se ejecuta al montar el componente y terminar la carga de los datos del usuario
   * Llama a documentacion para obtener el permiso del usuario
   */
  useEffect(() => {
    /**
     * Valida el estado del usuario
     * 
     * @internal
     * @returns {void}
     */
    const documentacion = async () => {
      try {
        //Si el token aun no ha cargado, no continua
        if (loading) return;
        //Valida la sesion del usuario
        if (await checkAuth()) {
          setDocs(true)
        } else {
          //Si el usuario no esta activo, avisa al usuario y lo redirecciona al login
          alert("Sesion caducada");
          setDocs(false)
          navigate("/Login")
        }
      } catch (error) {
        alert("Error al obtener la documentación")
        setDocs(false)
      }
    }
    documentacion()
    //Vuelve a activarse al cambiar el estado de loading
  }, [loading])

  //Interfaz de los enlaces a la documentación
  return (
    //Verifica que el usuario este validado y sea un administrador
    user?.rol === "admin" && docs && (
      //Enlace a la documentación de los endpoints del BackEnd
      <div className="flex flex-col">
        <a
          href={`${API}/api/docs`}
          target="_blank"
        >
          📄 Swagger Admin
        </a>
        {/*Enlace a la documentación del BackEnd*/}
        <a
          href={`${API}/api/JSDoc`}
          target="_blank"
        >
          📄 JSDoc Back
        </a>
        {/*Enlace a la documentación del FrontEnd*/}
        <a
          href={"./docs"}
          target="_blank"
        >
          📄 TypeDoc Front
        </a>
      </div>
    )
  );
}