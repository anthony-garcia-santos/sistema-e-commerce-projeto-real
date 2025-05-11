//Front_end/src/routes/routes.jsx


import { Routes, Route, useLocation } from 'react-router-dom';
import PrivateRoute from './privateRoutes.jsx';

import Cadastrar from '../pages/Cadastrar.jsx';
import Home from '../pages/Home.jsx';
import Login from '../pages/Login.jsx';
import Admin from '../pages/administração.jsx';

export default function Rotas() {

  const location = useLocation();

  return (
    <>
      <Routes location={location} key={location.pathname}>
        <Route path="/Cadastrar" element={<Cadastrar />} />
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />

        <Route path='/admin' element={<PrivateRoute><Admin /></PrivateRoute>} />
      </Routes>

    </>
  )
}