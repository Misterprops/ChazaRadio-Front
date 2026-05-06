/**
 * @file authContext.tsx
 * Contexto global de autenticación.
 * 
 * Gestiona el ciclo de sesión del usuario:
 * - Persistencia del JWT en localStorage
 * - Decodificación del token
 * - Validación contra backend
 * - Renovación automática
 * 
 * @remarks
 * Debe envolver toda la aplicación para habilitar autenticación global.
 * 
 * @author ChazaRadio Team
 * @version 1.0
 */

import { createContext, useContext, useEffect, useState } from "react";
import { api_checkAuth, api_reloadAuth } from "../functions/api_calls";

/**
 * Tipo que representa los datos del usuario decodificados del JWT
 * @typedef {Object} User
 * @property {string} id - Identificador único del usuario
 * @property {string} correo - Email del usuario
 * @property {string} nombre - Nombre del usuario
 * @property {string} rol - Rol del usuario (ej: 'user', 'admin')
 */
type User = {
    id: string;
    correo: string;
    nombre: string;
    rol: string;
};

/**
 * Tipo que define el contexto de autenticación
 * @typedef {Object} AuthContextType
 * @property {User|null} user - Usuario actualmente autenticado (null si no hay sesión)
 * @property {string|null} token - JWT actual almacenado
 * @property {Function} logToken - Guarda un token nuevo y actualiza el usuario
 * @property {Function} logout - Limpia la sesión y el localStorage
 * @property {boolean} loading - Indicador de carga durante validación inicial
 * @property {Function} reloadToken - Renueva el token si falta <5 min para expirar
 * @property {Function} checkAuth - Valida si existe una sesión activa en localStorage
 */
type AuthContextType = {
    user: User | null;
    token: string | null;
    logToken: (token: string) => void;
    logout: () => void;
    loading: boolean;
    reloadToken: () => void;
    checkAuth: () => Promise<boolean>;
};

/** Contexto del token de usuario */
const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Decodifica un JWT para extraer los datos del usuario
 * 
 * @param {string} token - JWT a decodificar
 * @returns {User|null} Datos del usuario si el token es válido y no ha expirado, null si es inválido
 * 
 * @example
 * const user = decodeToken(jwtToken);
 * if (user) {
 *   console.log(`Usuario: ${user.nombre}, Email: ${user.correo}`);
 * }
 * @internal
 */
const decodeToken = (token: string): User | null => {
    try {
        //Obtiene el token
        const payload = token.split(".")[1];
        //Decodifica el token
        const decoded = JSON.parse(atob(payload));

        // Validar expiración del token
        if (!decoded.exp || (decoded.exp * 1000) <= Date.now()) {
            return null;
        }

        return decoded;
    } catch {
        return null;
    }
};

/**
 * AuthProvider - Componente proveedor de contexto de autenticación
 * 
 * @param {Object} props - Props del componente
 * @param {React.ReactNode} props.children - Componentes hijos que tendrán acceso al contexto
 * @returns {JSX.Element} Proveedor de contexto envolviendo los hijos
 * 
 * @example
 * root.render(
 *   <AuthProvider>
 *     <App />
 *   </AuthProvider>
 * )
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    //Token del usuario 
    const [token, setToken] = useState<string | null>(null);
    //Datos del usaurio 
    const [user, setUser] = useState<User | null>(null);
    //Estado de carga 
    const [loading, setLoading] = useState(true);

    /**
     * Hook que se ejecuta al montar el componente
     * Llama a checkAuth para validar la sesión del usuario
     */
    useEffect(() => {
        checkAuth();
    }, []);

    /**
     * Guarda un JWT y actualiza el estado de sesión.
     * 
     * @param {string} newToken - JWT a guardar
     * @returns {void}
     * 
     * @example
     * const { logToken } = useAuth();
     * const response = await api_login(email, password);
     * const data = await response.json();
     * logToken(data.token); // Autentica al usuario
     * @internal
     */
    const logToken = (newToken: string) => {
        try {
            //Agrega el token al localStorage
            localStorage.setItem("token", newToken);
            //Decodifica el token
            const decoded = decodeToken(newToken);
            //Guarda el token
            setToken(newToken);
            //Guarda los datos del usuario
            setUser(decoded);
        } catch (error) {
            console.error("Error de sesión")
        }
    };

    /**
     * Limpia la sesión del usuario: localStorage, estado de token y usuario
     * 
     * @returns {void}
     * 
     * @example
     * const { logout } = useAuth();
     * logout(); // El usuario vuelve al estado de no autenticado
     * @internal
     */
    const logout = () => {
        try {
            //Remueve el token del localStorage
            localStorage.removeItem("token");
            //Elimina el token
            setToken(null);
            //Elimina el usuario
            setUser(null);
        } catch (error) {
            console.error("Error al cerrar sesión")
        }
    };

    /**
     * Renueva el token si está próximo a expirar.
     * 
     * @returns {Promise<void>}
     * 
     * @remarks
     * Ejecuta una petición al backend si faltan menos de 5 minutos.
     * En caso de error, cierra la sesión.
     * 
     * @example
     * // Se llama automáticamente desde otras partes de la app
     * const { reloadToken } = useAuth();
     * await reloadToken(); // Renueva si necesario
     * @internal
     */
    const reloadToken = async () => {
        try {
            //Si existe el token
            if (token) {
                //Obtiene los datos del usuario
                const payload = JSON.parse(atob(token.split(".")[1]));
                //Obtiene la hora actual
                const now = Date.now() / 1000;

                // Renovar si faltan menos de 5 minutos
                if (payload.exp - now < 300) {
                    //Llama al api para renovar el token
                    const res = await api_reloadAuth(token)
                    //Si no devuelve el token genera la alerta
                    if (!res) return alert("Error al generar el token")
                    //Obtiene el nuevo token
                    const data = await res.json()
                    //Crea el nuevo token
                    logToken(data.token);
                }
            }
        } catch {
            //Si ocurre un error, termina la sesión
            alert("Error al decodificar token");
            logout();
        }
    }

    /**
     * Verifica si existe una sesión válida.
     * 
     * @returns {Promise<boolean>} true si la sesión es válida, false en caso contrario
     * 
     * @remarks
     * - Valida el token contra el backend
     * - Restaura el estado global si es correcto
     * 
     * @example
     * const { checkAuth } = useAuth();
     * const isAuthenticated = await checkAuth();
     * if (!isAuthenticated) {
     *   navigate('/login');
     * }
     * @internal
     */
    const checkAuth = async () => {
        try {
            //Obtiene el token
            const storedToken = localStorage.getItem("token");
            //Verifica que el token existe y esta vigente
            if (storedToken && await api_checkAuth(storedToken)) {
                //Decodifica el token
                const decoded = decodeToken(storedToken);
                //Si no existe el token
                if (!decoded) {
                    //Remueve el token del storage
                    localStorage.removeItem("token");
                    //Elimina el token
                    setToken(null);
                    //Elimina el usuario
                    setUser(null);
                    return false
                } else {
                    //Si existe el token, lo agrega
                    setToken(storedToken);
                    //Agrega el usuario
                    setUser(decoded);
                    //Desactiva la bandera de carga
                    setLoading(false);
                    return true
                }
            } else {
                return false
            }
        }catch(error){
            console.error("Error al revisar la sesión")
            return false
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, logToken, logout, loading, reloadToken, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * Hook personalizado para acceder al contexto de autenticación
 * 
 * @returns {AuthContextType} Objeto con user, token, logToken, logout, reloadToken, checkAuth
 * 
 * @throws {Error} Si se usa fuera de un AuthProvider
 * 
 * @remarks
 * Debe usarse dentro de cualquier componente que esté envuelto por AuthProvider.
 * Proporciona acceso a:
 * - user: datos del usuario autenticado
 * - token: JWT actual
 * - logToken(): guarda un token nuevo
 * - logout(): cierra sesión
 * - reloadToken(): renueva token si expira pronto
 * - checkAuth(): valida sesión actual
 * 
 * @example
 * const MyComponent = () => {
 *   const { user, token, logout } = useAuth();
 *   
 *   if (!user) return <p>No autenticado</p>;
 *   
 *   return (
 *     <div>
 *       <p>Hola {user.nombre}</p>
 *       <button onClick={logout}>Cerrar Sesión</button>
 *     </div>
 *   );
 * }
 */
export const useAuth = () => {
    //Crea el contexto
    const context = useContext(AuthContext);
    //Si se usa el contexto fuera del AuthProvider, genera error
    if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
    return context;
};