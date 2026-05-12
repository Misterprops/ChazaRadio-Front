import { useState } from 'react';
import { Link } from 'react-router';
import { useNavigate } from "react-router";
import { Button } from '../elements/button';
import { Input } from '../elements/input';
import { api_codigo, api_login, api_validar } from '../functions/api_calls';
import { useAuth } from '../functions/authContext';
import { Label } from '../elements/label';

/**
 * Vista de autenticación de usuario.
 * 
 * @remarks
 * - Usuario ingresa credenciales
 * - Se envian datos al api
 * - Si no está verificado, muestra validación por código
 * - Se valida con la api
 * - Si es correcto, se almacena token y redirige
 * 
 * @returns {JSX.Element} Componente visual del login
 */
export const Login = () => {
    //Id del usuario
    const [user, setUser] = useState("");
    //Contraseña
    const [password, setPassword] = useState("");
    //Codigo de validación
    const [valida, setValida] = useState("");
    //Estado de verificado del usuario
    const [validado, setValidado] = useState(true);
    //Hook de navegacion
    const navigate = useNavigate();
    //Generador de JWT
    const { logToken } = useAuth();

    /**
     * Ejecuta login apoyado en backend.
     * 
     * @returns {Promise<void>}
     * @internal
     */
    const login = async () => {
        try {
            //Hace la autenticacion de usuario con la API
            const res = await api_login(user, password)
            console.log(res)
            const data = await res.json();
            console.log(data)
            //Verifica si hay errores en el back
            if (res.ok) {
                //Si la respuesta es buena, genera el JWT del usuario
                logToken(data)
                //Navega a la red social
                navigate("/")
            } else {
                //Si no es buena la respuesta, avisa al usuario
                alert(data.error || "Error al iniciar sesión");
                if (res.status === 401) {
                    setValidado(false);
                }
            }
        } catch (error) {
            alert("Error al iniciar sesión");
        }
    }

    /**
     * Valida código de verificación del usuario.
     * 
     * @returns {Promise<void>}
     * @internal
     */
    const validar = async () => {
        try {
            //Valida el codigo del usuario
            const res = await api_validar(user, valida)
            const data = await res.json();
            //Verifica si hay errores en el back
            if (res.ok) {
                //Si esta bien, llama al proseso de login
                login();
            } else {
                //Avisa al usuario del error
                alert(data.error || "Error al validar al usuario");
            }
        } catch (error) {
            alert("Error al validar al usuario");
        }
    }

    /**
     * Solicita envío de código de verificación.
     * 
     * @returns {Promise<void>}
     * @internal
     */
    const codigo = async () => {
        try {
            //Solicita el codigo de verificacion al API
            const res = await api_codigo(user)
            const data = await res.json();
            //Verifica si hay errores en el back
            if (!res.ok) {
                alert(data.error || "Error al generar el codigo");
            }
        } catch (error) {
            alert("Error al generar el codigo");
        }
    }

    //Interfaz del login
    return (
        <main className='flex justify-center pt-4 pb-4 flex-1 items-center bg-blue-50 w-full'>
            <div className='flex flex-col items-center w-full md:w-1/6 h-1/1 ml-2 mr-2'>
                <h1 className='font-bold text-lg'>Login</h1>
                {/*Valida que el usuario este verificado*/}
                {validado ? (
                    <>
                        {/*Si el usuario esta verificado o no ha iniciado sesión, ve el formulario de ingreso*/}
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
                        {/*Boton para registrarse*/}
                        <Button>
                            <Link to='../Registro' className='h-1/1 w-1/1 flex items-center justify-center'>
                                Registrarse
                            </Link>
                        </Button>
                    </>
                ) : (
                    <>
                        {/*Si el usuario no esta verificado ve el formulario de codigo de verificación*/}
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

                {/*Boton para entrar como invitado*/}
                <Button>
                    <Link to={"/Emisora"} className='text-fuchsia-800 bg-white h-1/1 w-1/1 content-center'>
                        Entrar como invitado
                    </Link>
                </Button>
            </div>
        </main>
    );
}