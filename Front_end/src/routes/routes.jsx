import { Routes, Route, useLocation } from 'react-router-dom';

import Cadastrar from '../pages/Cadastrar.jsx';
import Home from '../pages/Home.jsx';
import Login from '../pages/Login.jsx';

export default function Rootas(){

  const location = useLocation();

  return(
    <>
    <Routes location={location} key={location.pathname}>
      <Route path="/Cadastrar" element={<Cadastrar/>} />
      <Route path="/" element={<Home/>} />
      <Route path="/Login" element={<Login/>} />
    </Routes>
    
    </>
)}