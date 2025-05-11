//Front_end/pages/administração.jsx

import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const Admin = () => {
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {

        const token = localStorage.getItem('authToken');

        if (token) {
            // Verifique se o token é válido chamando o backend com Axios
            axios
                .get('/admin', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    if (response.status === 200) {
                        setIsAdmin(true);  // Usuário autenticado e com permissão de admin
                    } else {
                        setIsAdmin(false);
                    }
                })
                .catch((error) => {
                    console.error('Erro ao verificar o token:', error);
                    setIsAdmin(false);
                })
                .finally(() => setLoading(false));
        } else {
            setIsAdmin(false);
            setLoading(false);
        }
    }, []);




    if (loading) {
        return <div>Carregando...</div>;
    }

    if (!isAdmin && !loading) {
        return <Navigate to="/" />;
    }


    return (
        <div>
            <h1>Página de Admin</h1>
            <p>Bem-vindo, você tem acesso à área de administrador.</p>
        </div>
    );
};

export default Admin;
