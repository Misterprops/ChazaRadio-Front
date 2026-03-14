import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
const API = import.meta.env.VITE_APP_API;

type props = {
    user?: string;
    password?: string;
    mail: string;
    code?: string;
    id: string;
};

const registrar = async (data: props) => {
    console.log("registra: " + data.user + "-" + data.password + "-" + data.mail + "-" + data.id)
    try {
        const res = await fetch(`${API}/api/registro`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: data.mail,
                password: data.password,
                id: data.id,
                user: data.user
            })
        });
        console.log(res.json())
    } catch (error) {
        console.error("Error:", error);
    }

};

const validar = async (data: props) => {
    try {
        const res = await fetch(`${API}/api/verificar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: data.id,
                codigo: data.code
            })
        });
        console.log(res.json())
        if (res.ok) {
            return true
        } else {
            return false
        }

    } catch (error) {
        console.error("Error:", error);
    }
}

export const Register = () => {
    const [user, setUser] = useState("");
    const [id, setId] = useState("");
    const [password, setpassword] = useState("");
    const [mail, setmail] = useState("");
    const [code, setCode] = useState("");
    const navigate = useNavigate();
    return (
        <div className='flex flex-col w-1/1 h-1/1 items-center'>
            <h1 className='h-1/10 font-bold'>Register</h1>

            <form className='flex flex-col w-1/1 items-center' onSubmit={(e) => {
                e.preventDefault();
                const data = { user: user, password: password, mail: mail, id: id }
                registrar(data)
            }}>
                <label htmlFor="user">Usuario</label>
                <input type="text" id='user' value={user} onChange={(e) => setUser(e.target.value)} required className="bg-fuchsia-300 w-1/6 h-8 pb-1 mb-4" />
                <label htmlFor="password">Contraseña</label>
                <input type="text" id='password' value={password} onChange={(e) => setpassword(e.target.value)} required className="bg-fuchsia-300 w-1/6 h-8 pb-1 mb-4" />
                <label htmlFor="mail">Correo</label>
                <input type="text" id='mail' value={mail} onChange={(e) => setmail(e.target.value)} required className="bg-fuchsia-300 w-1/6 h-8 pb-1 mb-4" />
                <label htmlFor="id">Codigo Universitario</label>
                <input type="text" id='id' value={id} onChange={(e) => setId(e.target.value)} required className="bg-fuchsia-300 w-1/6 h-8 pb-1 mb-4" />
                <button type='submit' className="bg-blue-500 hover:cursor-pointer border h-10 w-1/6 mb-4 text-white border-black rounded">Registrar</button>
            </form>

            <form className='flex flex-col items-center w-1/1' onSubmit={async (e) => {
                e.preventDefault();
                const data = { code: code, mail: mail, id: id }
                await validar(data) ? navigate("/login") : setCode("");
            }}>
                <label htmlFor="code">Codigo</label>
                <input type="text" id='code' value={code} onChange={(e) => setCode(e.target.value)} required className="bg-fuchsia-300 w-1/6 h-8 pb-1" />
                <button type='submit' className="bg-blue-500 hover:cursor-pointer border h-10 w-1/6 mt-4 text-white border-black rounded">Verificar</button>
            </form>

            <button className='h-10 mt-2'>
                <Link to={"/"} className='text-fuchsia-800'>
                    Entrar como invitado
                </Link>
            </button>
        </div>
    );
}