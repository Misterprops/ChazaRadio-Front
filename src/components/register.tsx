import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Input } from '../elements/input';
import { Button } from '../elements/button';
import { api_codigo, api_registrar, api_validar } from '../functions/api_calls';
import { Label } from '../elements/label';

/**
 * Vista de registro de usuario.
 * 
 * Flujo:
 * 1. Usuario ingresa datos
 * 2. Se registra en backend
 * 3. Solicita código de verificación
 * 4. Valida código
 * 5. Redirige a login
 * 
 * @component
 * @returns {JSX.Element}
 */
export const Register = () => {
    const [user, setUser] = useState("");
    const [id, setId] = useState("");
    const [password, setpassword] = useState("");
    const [mail, setmail] = useState("");
    const [code, setCode] = useState("");
    const navigate = useNavigate();
    const [formulario, setFormulario] = useState(true)

    /**
     * Envía datos de registro al backend.
     * 
     * @async
     * @function registrar
     * @returns {Promise<void>}
     */
    const registrar = async () => {
        try {
            const res = await api_registrar(user, password, mail, id)
            if (!res.ok) {
                alert("Error de registro")
            }else{
                setFormulario(false)
            }
        } catch (error) {
            console.error("Error:", error);
        }

    };

    /**
     * Verifica código ingresado por el usuario.
     * 
     * @async
     * @function validar
     * @returns {Promise<boolean>}
     */
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

    /**
     * Solicita reenvío de código de verificación.
     * 
     * @async
     * @function codigo
     * @returns {Promise<void>}
     */
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
        <main className='flex justify-center pt-4 pb-4 bg-blue-50 flex-1 items-center'>
            <div className='flex flex-col h-1/1 items-center w-full md:w-1/6 ml-2 mr-2'>
                <h1 className='font-bold text-lg'>Register</h1>

                {formulario ?
                    <form className='flex flex-col w-1/1 items-center' onSubmit={(e) => {
                        e.preventDefault();
                        registrar()
                    }}>
                        <Label htmlFor="user">Usuario</Label>
                        <Input type="text" id='user' value={user} change={setUser} required />
                        <Label htmlFor="password">Contraseña</Label>
                        <Input type="password" id='password' value={password} change={setpassword} required />
                        <Label htmlFor="mail">Correo</Label>
                        <Input type="email" id='mail' value={mail} change={setmail} required />
                        <Label htmlFor="id">Codigo Universitario</Label>
                        <Input type="text" id='id' value={id} change={setId} required />
                        <Button>Registrar</Button>
                    </form> :
                    <>
                        <form className='flex flex-col items-center w-1/1' onSubmit={async (e) => {
                            e.preventDefault();
                            await validar() ? navigate("/login") : setCode("");
                        }}>
                            <Label htmlFor="code">Codigo</Label>
                            <Input type="text" id='code' value={code} change={setCode} required />
                            <Button>Verificar</Button>
                        </form>
                        <form className='flex flex-col items-center w-1/1' onSubmit={async (e) => {
                            e.preventDefault();
                            codigo();
                        }}>
                            <Button>Reenviar codigo</Button>
                        </form>
                    </>
                }
                <Button>
                    <Link to={"/Emisora"} className='text-fuchsia-800 bg-white h-1/1 w-1/1 content-center'>
                        Entrar como invitado
                    </Link>
                </Button>
            </div>
        </main>
    );
}