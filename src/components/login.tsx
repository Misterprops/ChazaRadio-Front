import { useState } from 'react';
import { Link } from 'react-router';
import { useNavigate } from "react-router";
const API = import.meta.env.VITE_APP_API;

export const Log = () => {
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const login = async () => {
        try {
            const res = await fetch(`${API}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: user,
                    password: password
                })
            });
            const data = await res.json();
            console.log(data);
            if (!res.ok) {
                if (res.status === 400) {
                    alert("Contraseña erronea");
                } else {
                    alert(res.status)
                }
            } else {
                localStorage.setItem("token", data)
                navigate("/")
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    return (
        <div className='flex flex-col items-center w-1/1 h-1/1'>
            <h1 className='h-1/10 font-bold'>Login</h1>

            <form className='flex flex-col w-1/1 items-center' onSubmit={(e) => {
                e.preventDefault();
                login()
            }}>
                <label htmlFor="user">Usuario</label>
                <input type="text" id='user' value={user} required onChange={(e) => setUser(e.target.value)} className="bg-fuchsia-300 w-1/6 h-8 pb-1 mb-4" />
                <label htmlFor="password">Contraseña</label>
                <input type="password" id='password' value={password} required onChange={(e) => setPassword(e.target.value)} className='bg-fuchsia-300 w-1/6 h-8 pb-1 mb-4' />
                <button type='submit' className="bg-blue-500 hover:cursor-pointer border h-10 w-1/6 mb-2 text-white border-black rounded">Ingresar</button>
            </form>

            <button className="bg-blue-500 hover:cursor-pointer border h-10 w-1/6 mt-4 text-white border-black rounded">
                <Link to='../Login' state={{ tipo: true }}>
                    Registrarse
                </Link>
            </button>

            <button className='h-10 mt-2'>
                <Link to={"/Emisora"} className='text-fuchsia-800'>
                    Entrar como invitado
                </Link>
            </button>
        </div>
    );
}