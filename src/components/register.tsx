import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Input } from '../elements/input';
import { Button } from '../elements/button';
import { api_codigo, api_registrar, api_validar } from '../functions/api_calls';
import { Label } from '../elements/label';

/**
 * Vista de registro de usuario.
 * 
 * @remarks
 * Depende de servicios backend para:
 * - Registro de usuario
 * - Verificacion del usuario
 * Funcionalidades:
 * - Registra un usuario ante el backend
 * - Solicita código de verificación
 * - Valida el código
 * 
 * @returns {JSX.Element} Componente visual del registro
 */
export const Register = () => {
    //Nombre del usuario
    const [user, setUser] = useState("");
    //Codigo universitario del usuario
    const [id, setId] = useState("");
    //Contraseña del usuario
    const [password, setpassword] = useState("");
    //Correo del usuario
    const [mail, setmail] = useState("");
    //Codigo de confirmación
    const [code, setCode] = useState("");
    //Hook de redirección
    const navigate = useNavigate();
    //Tipo de formulario
    const [formulario, setFormulario] = useState(true)

    /**
     * Envía datos de registro al backend.
     * 
     * @remarks
     * Solicita el registro del usuario al backEnd
     * @internal
     * @returns {Promise<void>}
     */
    const registrar = async () => {
        try {
            //Registra el usuario
            const res = await api_registrar(user, password, mail, id)
            const data = await res.json()
            //Verifica si hay errores en el back
            if (!res.ok) {
                alert(data.error || "Error al registrar usuario");
            } else {
                alert(data.msg || "Usuario registrado");
                //Modifica el formulario para solicitar el codigo
                setFormulario(false)
            }
        } catch (error) {
            alert("Error al registrar el usuario");
        }

    };

    /**
     * Verifica código ingresado por el usuario.
     * 
     * @remarks
     * Verifica el codigo desde el back
     * @internal
     * @returns {Promise<boolean>}
     */
    const validar = async () => {
        try {
            //Valida el codigo con el API
            const res = await api_validar(id, code)
            const data = await res.json()
            //Verifica si hay errores en el back
            if (!res.ok) {
                alert(data.error || "Error al verificar el usuario");
                return false
            } else {
                alert(data.msg || "Usuario verificado");
                return true
            }
        } catch (error) {
            alert("Error al verificar el usuario");
            return false
        }
    }

    /**
     * Solicita reenvío de código de verificación.
     * 
     * @remarks
     * - Verifica que el codigo no se ha enviado recientemente
     * - Envia otro codigo
     * @internal
     * @returns {Promise<void>}
     */
    const codigo = async () => {
        try {
            //Verifica y envia otro codigo
            const res = await api_codigo(id)
            const data = await res.json()
            //Verifica si hay errores en el back
            if (!res.ok) {
                alert(data.error || "Error al verificar el usuario");
            }else{
                alert(data.msg || "Codigo reenviado");
            }
        } catch (error) {
            console.error("Error al verificar el usuario");
        }
    }

    //Interfaz del registro
    return (
        <main className='flex justify-center pt-4 pb-4 bg-blue-50 flex-1 items-center'>
            <div className='flex flex-col h-1/1 items-center w-full md:w-1/6 ml-2 mr-2'>
                <h1 className='font-bold text-lg'>Register</h1>
                {/*Valida el estado del formulario*/}
                {formulario ?
                    //Formulario de registro de usuario
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
                    //Formulario de verificación de usuario
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
                {/*Boton para ingresar como invitado*/}
                <Button>
                    <Link to={"/Emisora"} className='text-fuchsia-800 bg-white h-1/1 w-1/1 content-center'>
                        Entrar como invitado
                    </Link>
                </Button>
            </div>
        </main>
    );
}