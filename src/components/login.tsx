import { useState } from 'react';
import { Link } from 'react-router';
import { useNavigate } from "react-router";
const API = import.meta.env.VITE_APP_API;

export const Log = () => {
    const [user, setUser] = useState("");
    const [password, setpassword] = useState("");
    const navigate = useNavigate();

    const login = async (user: string, password: string) => {
        try {
            const res = await fetch(`${API}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user: user,
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
                navigate("/")
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    return (
        <div className='flex flex-col w-1/1 h-1/1'>
            <h1 className='h-1/10 font-bold'>Login</h1>

            <form className='flex flex-col h-4/5'>
                <div>
                    <label htmlFor="user">Usuario</label>
                    <input type="text" id='user' value={user} onChange={(e) => setUser(e.target.value)} className='bg-white' />
                </div>
                <div>
                    <label htmlFor="password">Contraseña</label>
                    <input type="text" id='password' value={password} onChange={(e) => setpassword(e.target.value)} className='bg-white' />
                </div>
                <button onClick={(e) => {
                    e.preventDefault();
                    login(user, password)
                }} className='border-2'>Login</button>
            </form>

            <button className='h-1/10'>
                <Link to='../Login' state={{ tipo: true }}>
                    Registrarse
                </Link>
            </button>
        </div>
    );
}