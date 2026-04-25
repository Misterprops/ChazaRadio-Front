import { useState } from 'react';
import { Link } from 'react-router';
import { useNavigate } from "react-router";
import { Button } from '../elements/button';
import { Input } from '../elements/input';
import { api_codigo, api_login, api_validar } from '../functions/api_calls';
import { useAuth } from './authContext';


export const Login = () => {
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [valida, setValida] = useState("");
    const [validado, setValidado] = useState(true);
    const navigate = useNavigate();
    const { logToken } = useAuth();

    const login = async () => {
        try {
            const res = await api_login(user, password)
            const data = await res.json();
            if (!res.ok) {
                if (res.status === 400) {
                    alert("Contraseña erronea");
                } else if (res.status === 401) {
                    setValidado(false);
                } else {
                    alert(res.status)
                }
            } else {
                logToken(data)
                navigate("/")
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    const validar = async () => {
        try {
            const res = await api_validar(user, valida)
            if (res.ok) {
                login();
            } else {
                alert("Codigo erroneo")
            }

        } catch (error) {
            console.error("Error:", error);
        }
    }

    const codigo = async () => {
        try {
            const res = await api_codigo(user)
            if (!res.ok) {
                alert("Reenvio en cd")
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    return (
        <main className='flex justify-center pt-4 pb-4 h-4/5 bg-blue-50'>
            <div className='flex flex-col items-center w-1/6 h-1/1'>
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

                {validado ? (
                    <Button>
                        <Link to='../Registro' className='h-1/1 w-1/1 flex items-center justify-center'>
                            Registrarse
                        </Link>
                    </Button>
                ) : (
                    <>
                        <form className='w-1/1' onSubmit={(e) => { e.preventDefault(); validar() }}>
                            <label htmlFor="validar">Codigo de verificacion</label>
                            <Input type="text" id='validar' required value={valida} change={setValida} />
                            <Button>Validar Usuario</Button>
                        </form>
                        <form className='w-1/1' onSubmit={(e) => { e.preventDefault(); codigo() }}>
                            <Button>Generar codigo</Button>
                        </form>
                    </>
                )}


                <Button>
                    <Link to={"/Emisora"} className='text-fuchsia-800 bg-white h-1/1 w-1/1 content-center'>
                        Entrar como invitado
                    </Link>
                </Button>
            </div>
        </main>
    );
}