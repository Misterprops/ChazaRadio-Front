import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Input } from '../elements/input';
import { Button } from '../elements/button';
import { api_codigo, api_registrar, api_validar } from '../functions/api_calls';

export const Register = () => {
    const [user, setUser] = useState("");
    const [id, setId] = useState("");
    const [password, setpassword] = useState("");
    const [mail, setmail] = useState("");
    const [code, setCode] = useState("");
    const navigate = useNavigate();

    const registrar = async () => {
        try {
            const res = await api_registrar(user, password, mail, id)
            if (!res.ok) {
                alert("Error de registro")
            }
        } catch (error) {
            console.error("Error:", error);
        }

    };

    const validar = async () => {
        try {
            const res = await api_validar(id, code)
            if (res.ok) {
                return true
            } else {
                alert("Codigo erroneo")
                return false
            }

        } catch (error) {
            console.error("Error:", error);
        }
    }

    const codigo = async () => {
        try {
            const res = await api_codigo(id)
            if (!res.ok) {
                alert("Reenvio en cd")
            }

        } catch (error) {
            console.error("Error:", error);
        }
    }

    return (
        <main className='flex justify-center pt-4 pb-4 h-4/5 bg-blue-50'>
            <div className='flex flex-col w-1/6 h-1/1 items-center'>
                <h1 className='h-1/10 font-bold'>Register</h1>

                <form className='flex flex-col w-1/1 items-center' onSubmit={(e) => {
                    e.preventDefault();
                    registrar()
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
                    await validar() ? navigate("/login") : setCode("");
                }}>
                    <label htmlFor="code">Codigo</label>
                    <Input type="text" id='code' value={code} change={setCode} required />
                    <Button>Verificar</Button>
                </form>

                <form className='flex flex-col items-center w-1/1' onSubmit={async (e) => {
                    e.preventDefault();
                    codigo();
                }}>
                    <Button>Reenviar codigo</Button>
                </form>

                <Button>
                    <Link to={"/Emisora"} className='text-fuchsia-800 bg-white h-1/1 w-1/1 content-center'>
                        Entrar como invitado
                    </Link>
                </Button>
            </div>
        </main>
    );
}