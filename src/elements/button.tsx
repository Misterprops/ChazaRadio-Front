import type React from "react";

/**
 * Vista principal de los botones.
 * 
 * @remarks
 * - Botones de type submit
 * - No todos los botones son de esta interfaz (Excepción: Botones de like)
 * - Incluye el boton para ingresar como invitado
 * @param {React.ReactNode} Children - Componente html que esta dentro del boton
 * @returns {JSX.Element} Componente visual de un boton
 */
export const Button = ({children}: {children: React.ReactNode}) => {
    return (
        //Boton submit que permite tener nodos internos
        <button type="submit" className="bg-blue-500 hover:cursor-pointer border text-lg h-10 w-full text-wrap mb-1 mt-1 text-white border-black rounded flex justify-center items-center">
            {children}
        </button>
    );
}