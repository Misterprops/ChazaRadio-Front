import { useAuth } from "./authContext";

const API = import.meta.env.VITE_APP_API;

export const SwaggerDocs = () => {

  const { user, token } = useAuth();
  console.log(token)
  
  return (
    user?.rol === "admin" && (
      <a
        href={`${API}/api/docs`}
        target="_blank"
      >
        📄 Swagger Admin
      </a>
    )
  );
}