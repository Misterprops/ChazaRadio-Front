/**
 * Tipo que define el formato recepción de props
 * @typedef {Object} props
 * @property {string} type - Tipo de input
 * @property {string} id - Id del input
 * @property {boolean} required - Status de requerido
 * @property {string} value - Texto del input
 * @property {Function} change - Funcion de cambio de texto
 */
type props = {
    type: string,
    id: string,
    required: boolean,
    value: string,
    change: (value: string) => void
};
/**
 * Vista principal del input.
 * 
 * @remarks
 * - Recibe los datos del input y el estado para controlar su contenido
 * 
 * @param {props} props - Elementos del input
 * @returns {JSX.Element} Componente visual del input
 */
export const Input = ({ type, id, required, value, change }: props) => {
    return (
        <input type={type} id={id} value={value} required={required} onChange={(e) => change(e.target.value)} className="bg-fuchsia-300 text-wrap w-full text-lg h-8 pb-1 mb-4" />
    );
}