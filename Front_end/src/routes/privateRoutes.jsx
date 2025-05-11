import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    return <Navigate to="/" />;
  }

  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp < currentTime) {
      return <Navigate to="/Login" />;
    }

    // VERIFICAÇÃO DE PAPEL DO USUÁRIO (apenas "admin" pode acessar)
    if (decodedToken.role !== "admin") {
      return <Navigate to="/" />; // ou para uma tela de acesso negado
    }

  } catch (error) {
    return <Navigate to="/Login" />;
  }

  return children;
};

export default PrivateRoute;
