import type React from "react";

export const Button = ({children}: {children: React.ReactNode}) => {
    return (
        
        <button type="submit" className="bg-blue-500 hover:cursor-pointer border h-10 w-1/6 mb-1 mt-1 text-white border-black rounded flex justify-center items-center">
            {children}
        </button>
    );
}