import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { obterAdminData } from "../services/authService";

const PrivateRoute = ({ children }) => {
  const [autorizado, setAutorizado] = useState(null);

  useEffect(() => {
    obterAdminData()
      .then(() => setAutorizado(true))
      .catch(() => setAutorizado(false));
  }, []);

  if (autorizado === null) return <div>Carregando...</div>;
  return autorizado ? children : <Navigate to="/login" />;
};

export default PrivateRoute;





