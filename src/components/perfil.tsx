import { useState } from "react";
import logo from "/logo.svg"
const API = import.meta.env.VITE_APP_API;

type props = {
  user: string;
  mail: string
};

export function Perfil(props:props) {
  const [url, setUrl] = useState("");
  //const [userData, setUserData] = useState(null);

  const agregar = async (link:string) => {
    try {
      const res = await fetch(`${API}/api/descargar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: link })
      });
      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  /*useEffect(() => {
    const user = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/user_data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ user: 'mister' })
        });
        setUserData(await res.json());
        console.log(data);
      } catch (error) {
        console.error("Error:", error);
      }
    }
    user()
  }, []);*/


  return ([
    <div className="flex w-1/1 h-1/2 border-2">
      <div className="w-1/3">
        <img src={logo} className="w-1/1"></img>
      </div>

      {props ?
        <div className="flex flex-col">
          <span>{props.user}</span>
          <span>{props.mail}</span>
        </div>
        :
        <div className="flex flex-col">
          <span>Name</span>
          <span>E-mail</span>
        </div>
      }

    </div>,
    <div className="flex flex-col w-1/1 h-1/2 border-2">
      <input className='border-2 bg-fuchsia-300 w-1/1 h-1/2' value={url} onChange={(e) => setUrl(e.target.value)} />
      <button className='border-2 bg-amber-300 w-1/1 h-1/2 cursor-pointer' onClick={() => agregar(url)}>download</button>
    </div>
  ]);
}