type props = {
    type: string,
    id: string,
    required: boolean,
    value: string,
    change: (value: string) => void
};

export const Input = ({ type, id, required, value, change }: props) => {
    return (
        <input type={type} id={id} value={value} required={required} onChange={(e) => change(e.target.value)} className="bg-fuchsia-300 w-1/6 h-8 pb-1 mb-4" />
    );
}