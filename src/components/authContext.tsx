import { createContext, useContext, useEffect, useState } from "react";
import { api_checkAuth, api_reloadAuth } from "../functions/api_calls";

type User = {
    id: string;
    correo: string;
    nombre: string;
    rol: string;
};

type AuthContextType = {
    user: User | null;
    token: string | null;
    logToken: (token: string) => void;
    logout: () => void;
    loading: boolean;
    reloadToken: () => void;
    checkAuth: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | null>(null);

// 🔹 Decodificar JWT
const decodeToken = (token: string): User | null => {
    try {
        const payload = token.split(".")[1];
        const decoded = JSON.parse(atob(payload));

        // 🔥 validar expiración
        if (!decoded.exp || (decoded.exp * 1000) <= Date.now()) {
            return null;
        }

        return decoded;
    } catch {
        return null;
    }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // 🔹 Al cargar la app
    useEffect(() => {
        checkAuth();
    }, []);

    // 🔹 Login
    const logToken = (newToken: string) => {
        localStorage.setItem("token", newToken);

        const decoded = decodeToken(newToken);

        setToken(newToken);
        setUser(decoded);
    };

    // 🔹 Logout
    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    };

    const reloadToken = async () => {
        try {
            if (token) {
                const payload = JSON.parse(atob(token.split(".")[1]));
                const now = Date.now() / 1000;

                // renovar si faltan menos de 5 minutos
                if (payload.exp - now < 300) {
                    const res = await api_reloadAuth(token)
                    if (!res) throw new Error();
                    logToken(res);
                }
            }
        } catch {
            console.error("Error al decodificar token");
            logout();
        }
    }

    const checkAuth = async () => {
        const storedToken = localStorage.getItem("token");

        if (storedToken && await api_checkAuth(storedToken)) {
            const decoded = decodeToken(storedToken);

            if (!decoded) {
                localStorage.removeItem("token");
                setToken(null);
                setUser(null);
                return false
            } else {
                setToken(storedToken);
                setUser(decoded);
                setLoading(false);
                return true
            }
        } else {
            return false
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, logToken, logout, loading, reloadToken, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

// 🔹 Hook limpio
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
    return context;
};