/**
 * Tipo que define el formato recepción de props
 * @typedef {Object} props
 * @property {string} htmlFor - Nombre del input al que pertenece
 * @property {React.ReactNode} children - Componente html que esta dentro del label
 */
type props = {
    htmlFor: string,
    children: React.ReactNode
}
/**
 * Vista principal de los label.
 * 
 * @param {React.ReactNode} Children - Componente html que esta dentro del label
 * @param {string} htmlFor - Componente html que esta dentro del label
 * @returns {JSX.Element} Componente visual de un label
 */
export const Label = ({ htmlFor, children }: props) => {
    return (
        <label htmlFor={htmlFor} className="text-lg w-full" >{children}</label>
    );
}