//Estructura del footer
export const Footer = () => {
  return (
    //Footer - Flexbox, items centrados, horientado a columna, background rojo, altura del 10%
    <footer className="flex items-center flex-col bg-red-600 h-1/10">
        <span>Elaborado por: Andres y Alejandro</span>
        <span>Idea de Marlon</span>
        <span>Desarrollado para la UD</span>
    </footer>
  );
}