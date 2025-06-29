import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { verificarUsuarioLogado } from "../services/authService";

const PrivateUserRoute = ({ children }) => {
    const [autorizado, setAutorizado] = useState(null);
    const [erro, setErro] = useState(null);

    useEffect(() => {
        verificarUsuarioLogado()
            .then(() => setAutorizado(true))
            .catch((err) => {
                console.error("Erro ao verificar usuário logado:", err); 
                setErro(err?.response?.data?.error || "Erro desconhecido");
                setAutorizado(false);
            });
    }, []);

    if (autorizado === null) return <div>Carregando verificação do usuário...</div>;

    if (!autorizado) {
        return <Navigate to="/login" replace />; 
    }

    return children;
};

export default PrivateUserRoute;



