import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../components/authContext";
import { Lista } from "../components/lista";
import { Footer } from "../elements/footer";
import { Header } from "../elements/header";

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
export const ListaHome = () => {
    const navigate = useNavigate();
    const { checkAuth } = useAuth();

    useEffect(() => {
        const proteccion = async () => {
            if (!await checkAuth()) {
                navigate("/Login")
            }
        }
        proteccion()
    }, [])

    return (
        <div className="min-h-screen flex flex-col">
            <Header nav={[]} />
            {/*Main del html - Flexbox, justificado al centro, paddin arriba y abajo de 1 rem (16px)*/}
            <main className="flex justify-center pt-4 pb-4 flex-1 bg-blue-50">
                {/* Seccion 3: Un tercio del ancho del main y todo su alto para la lista de reproduccion */}
                <section className="w-full">
                    {/* Lista de reproduccion */}
                    <Lista />
                </section>
            </main>
            <Footer />
        </div>
    );
}