//Front_end/src/routes/routes.jsx


import { Routes, Route, useLocation } from 'react-router-dom';
import PrivateRoute from './privateRoutes.jsx';

import Cadastrar from '../pages/Cadastrar.jsx';
import Home from '../pages/Home.jsx';
import Login from '../pages/Login.jsx';
import Admin from '../pages/administração.jsx';
import PaginaProduto from '../pages/paginaProduto.jsx';
import Carrinho from '../pages/carrinho.jsx';
import Pagamento from '../pages/pagamento.jsx';
import PrivateAdminRoutes from './privateRoutes.jsx'; 
import PrivateUserRoute from './PrivateRoutesUsers.jsx';
import Pix from '../pages/pix.jsx';
import Confirmacao from '../pages/Confirmação.jsx';

export default function Rotas() {

  const location = useLocation();

  return (
    <>
      <Routes location={location} key={location.pathname}>
        <Route path="/Cadastrar" element={<Cadastrar />} />
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />

        <Route path='/Confirmacao' element={<PrivateUserRoute> <Confirmacao/> </PrivateUserRoute>} />

        <Route path='/pix' element={<PrivateUserRoute> <Pix/> </PrivateUserRoute>} />
        <Route path='/Pagamento' element={<PrivateUserRoute> <Pagamento/> </PrivateUserRoute>} />
        <Route path='/carrinho' element={<PrivateUserRoute> <Carrinho /> </PrivateUserRoute>} />
        <Route path="/produto/:id" element={<PaginaProduto />}/>
        <Route path='/admin' element={<PrivateAdminRoutes>< Admin /></PrivateAdminRoutes>} />
      </Routes>

    </>
  )
}


