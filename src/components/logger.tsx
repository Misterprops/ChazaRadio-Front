import { Log } from "./login";
import { Register } from "./register";
import { useLocation } from 'react-router';

export const Logger = () => {
    let register;
    const location = useLocation();
    try {
        register = location.state.tipo;
    } catch (e) {
        register = false;
    }
    return (
        //Main del html - Flexbox, justificado al centro, paddin arriba y abajo de 1 rem (16px)
        <main className="flex justify-center pt-4 pb-4 h-4/5 bg-amber-100">
            {register ? (
                /* Llama el registro del usuario */
                <Register />
            )
            :
            (
                /* Llama el login del usuario */
                <Log />
            )}
        </main>

    );

}