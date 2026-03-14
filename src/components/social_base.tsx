import { useEffect, useState } from "react";
import { Lista } from "./lista";
import { Perfil } from "./perfil";
import { Red_social } from "./red_social";
const API = import.meta.env.VITE_APP_API;

interface UserData {
  nombre: string;
  correo: string;
}

//Estructura del main de la red social
export const Social_main = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  useEffect(() => {
    const user = async () => {
      try {
        const res = await fetch(`${API}/api/user_data`, {
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id: '20232678012' })
        });
        setUserData(await res.json());
      } catch (error) {
        console.error("Error:", error);
      }
    }
    user()
  }, []);

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
        <Red_social user={userData ? userData.nombre : 'Cargando'}/>
      </section>
      {/* Seccion 3: Un tercio del ancho del main y todo su alto para la lista de reproduccion */}
      <section className="w-1/3">
        {/* Lista de reproduccion */}
        <Lista />
      </section>
    </main>
  );
}