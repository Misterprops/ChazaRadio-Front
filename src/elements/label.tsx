type props = {
    htmlFor: string,
    children: React.ReactNode
}
export const Label = ({ htmlFor, children }: props) => {
    return (
        <label htmlFor={htmlFor} className="text-lg w-full" >{children}</label>
    );
}