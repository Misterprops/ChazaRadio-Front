import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Input } from '../elements/input';
import { Button } from '../elements/button';
import { Header } from './header';
import { Footer } from './footer';
const API = import.meta.env.VITE_APP_API;

type props = {
    user?: string;
    password?: string;
    mail: string;
    code?: string;
    id: string;
};

const registrar = async (data: props) => {
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
        <>
            <Header nav={[["/login", "Login"], ["/Emisora", "Emisora"]]} />
            <main className='flex justify-center pt-4 pb-4 h-4/5 bg-blue-50'>
                <div className='flex flex-col w-1/6 h-1/1 items-center'>
                    <h1 className='h-1/10 font-bold'>Register</h1>

                    <form className='flex flex-col w-1/1 items-center' onSubmit={(e) => {
                        e.preventDefault();
                        const data = { user: user, password: password, mail: mail, id: id }
                        registrar(data)
                    }}>
                        <label htmlFor="user">Usuario</label>
                        <Input type="text" id='user' value={user} change={setUser} required />
                        <label htmlFor="password">Contraseña</label>
                        <Input type="password" id='password' value={password} change={setpassword} required />
                        <label htmlFor="mail">Correo</label>
                        <Input type="email" id='mail' value={mail} change={setmail} required />
                        <label htmlFor="id">Codigo Universitario</label>
                        <Input type="text" id='id' value={id} change={setId} required />
                        <Button>Registrar</Button>
                    </form>

                    <form className='flex flex-col items-center w-1/1' onSubmit={async (e) => {
                        e.preventDefault();
                        const data = { code: code, mail: mail, id: id }
                        await validar(data) ? navigate("/login") : setCode("");
                    }}>
                        <label htmlFor="code">Codigo</label>
                        <Input type="text" id='code' value={code} change={setCode} required />
                        <Button>Verificar</Button>
                    </form>

                    <Button>
                        <Link to={"/Emisora"} className='text-fuchsia-800 bg-white h-1/1 w-1/1 content-center'>
                            Entrar como invitado
                        </Link>
                    </Button>
                </div>
            </main>
            <Footer />
        </>
    );
}