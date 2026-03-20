import { useEffect, useState } from "react";
import { Lista } from "./lista";
import { Perfil } from "./perfil";
import { Red_social } from "./red_social";
import { useNavigate } from "react-router";
const API = import.meta.env.VITE_APP_API;

interface UserData {
  nombre: string;
  correo: string;
}

//Estructura del main de la red social
export const Social_main = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const user = async () => {
      try {
        const res = await fetch(`${API}/api/user_data`, {
          method: 'post',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
          }
        });
        const data = await res.json()
        setUserData(data);
      } catch (error) {
        console.error("Error:", error);
      }
    }
    user()
  }, []);
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token")

      if (!token) {
        navigate("/login")
        return
      }

      try {
        const res = await fetch(`${API}/api/verify`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (!res.ok) {
          localStorage.removeItem("token")
          navigate("/login")
        }

      } catch (error) {
        navigate("/login")
      }
    }

    checkAuth()
  }, [])

  return (
    //Main del html - Flexbox, justificado al centro, paddin arriba y abajo de 1 rem (16px)
    <main className="flex justify-center pt-4 pb-4 h-4/5 bg-blue-50">
      {/* Seccion 1: Un tercio del ancho del main y todo su alto para el perfil de usuario */}
      <section className="w-1/3">
        {/* Perfil del usuario */}
        <Perfil user={userData ? userData.nombre : 'Cargando'} mail={userData ? userData.correo : 'Cargando'} />
      </section>
      {/* Seccion 2: Dos tercios del ancho del main y todo su alto para el buffer de la red social */}
      <section className="w-2/5">
        {/* Red social */}
        <Red_social user={userData ? userData.nombre : 'Cargando'} />
      </section>
      {/* Seccion 3: Un tercio del ancho del main y todo su alto para la lista de reproduccion */}
      <section className="w-1/3">
        {/* Lista de reproduccion */}
        <Lista />
      </section>
    </main>
  );
}