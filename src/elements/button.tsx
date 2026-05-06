import type React from "react";

export const Button = ({children}: {children: React.ReactNode}) => {
    return (
        
        <button type="submit" className="bg-blue-500 hover:cursor-pointer border text-lg h-10 w-full text-wrap mb-1 mt-1 text-white border-black rounded flex justify-center items-center">
            {children}
        </button>
    );
}