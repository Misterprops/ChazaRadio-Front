import { useState } from 'react';
import { Link } from 'react-router';
import { useNavigate } from "react-router";
import { Button } from '../elements/button';
import { Input } from '../elements/input';
import { api_codigo, api_login, api_validar } from '../functions/api_calls';
import { useAuth } from './authContext';
import { Label } from '../elements/label';

/**
 * Vista de autenticación de usuario.
 * 
 * Flujo:
 * 1. Usuario ingresa credenciales
 * 2. Se envía a /api/login
 * 3. Si no está verificado → muestra validación por código
 * 4. Se valida con /api/verificar
 * 5. Si es correcto → se almacena token y redirige
 * 
 * @component
 * @returns {JSX.Element}
 */
export const Login = () => {
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [valida, setValida] = useState("");
    const [validado, setValidado] = useState(true);
    const navigate = useNavigate();
    const { logToken } = useAuth();

    /**
     * Ejecuta login contra backend.
     * 
     * @async
     * @function login
     * @returns {Promise<void>}
     */
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
                    alert(data.error)
                    console.log(data.detalles)
                }
            } else {
                logToken(data)
                navigate("/")
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    /**
     * Valida código de verificación del usuario.
     * 
     * @async
     * @function validar
     * @returns {Promise<void>}
     */
    const validar = async () => {
        try {
            const res = await api_validar(user, valida)
            if (res.ok) {
                login();
            } else {
                alert("Codigo erroneo")
                console.log(res.json())
            }

        } catch (error) {
            console.error("Error:", error);
        }
    }

    /**
     * Solicita envío de código de verificación.
     * 
     * @async
     * @function codigo
     * @returns {Promise<void>}
     */
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
        <main className='flex justify-center pt-4 pb-4 flex-1 items-center bg-blue-50 w-full'>
            <div className='flex flex-col items-center w-full md:w-1/6 h-1/1 ml-2 mr-2'>
                <h1 className='font-bold text-lg'>Login</h1>

                {validado ? (
                    <>
                        <form className='flex flex-col w-1/1 items-center' onSubmit={(e) => {
                            e.preventDefault();
                            login()
                        }}>
                            <Label htmlFor="id">Codigo</Label>
                            <Input type="text" id='id' required value={user} change={setUser} />
                            <Label htmlFor="password">Contraseña</Label>
                            <Input type="password" id='password' required value={password} change={setPassword} />
                            <Button>Ingresar</Button>
                        </form>
                        <Button>
                            <Link to='../Registro' className='h-1/1 w-1/1 flex items-center justify-center'>
                                Registrarse
                            </Link>
                        </Button>
                    </>
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