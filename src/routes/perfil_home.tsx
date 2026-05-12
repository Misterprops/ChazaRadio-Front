
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../functions/authContext";
import { Perfil } from "../components/perfil";
import { Header } from "../elements/header";
import { Footer } from "../elements/footer";

/**
 * Vista base del perfil.
 * 
 * @remarks 
 * - Reutiliza la vista del componente Perfil
 * - Requiere autenticación
 * 
 * @returns {JSX.Element} Componente visual de la base del perfil
 */
export const PerfilHome = () => {
    //Hook de redirección
    const navigate = useNavigate();
    //Credenciales del usuario
    const { checkAuth } = useAuth();

    /**
     * Hook que se ejecuta al montar el componente
     * Llama a proteccion para revisar el estado del usuario
     */
    useEffect(() => {
        /**
         * Obtiene el estado del usuario
         * 
         * @internal
         * @returns {Promise<void>}
         */
        const proteccion = async () => {
            //Valida si el estado del usuario es inválido
            if (!await checkAuth()) {
                //Redirecciona al login
                navigate("/Login")
            }
        }
        proteccion()
    }, [])

    //Interfaz de la base del perfil
    return (
        <div className="min-h-screen flex flex-col">
            {/*Header*/}
            <Header nav={[]} />
            {/*Contenido del perfil*/}
            <main className="flex justify-center pt-4 pb-4 flex-1 bg-blue-50">
                <section className="w-full">
                    {/* Perfil del usuario */}
                    <Perfil />
                </section>
            </main>
            {/*Pie de pagina*/}
            <Footer />
        </div>
    );
}