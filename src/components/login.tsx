import { useState } from 'react';
import { Link } from 'react-router';
import { useNavigate } from "react-router";
import { Button } from '../elements/button';
import { Input } from '../elements/input';
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
                <Input type="text" id='user' required value={user} change={setUser} />
                <label htmlFor="password">Contraseña</label>
                <Input type="password" id='password' required value={password} change={setPassword} />
                <Button>Ingresar</Button>
            </form>

            <Button>
                <Link to='../Login' state={{ tipo: true }} className='h-1/1 w-1/1 flex items-center justify-center'>
                    Registrarse
                </Link>
            </Button>

            <Button>
                <Link to={"/Emisora"} className='text-fuchsia-800 bg-white h-1/1 w-1/1'>
                    Entrar como invitado
                </Link>
            </Button>
        </div>
    );
}