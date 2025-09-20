import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  
  const perfisDisponiveis = ['Administrador', 'Supervisor', 'Analista'];

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Você não está autenticado. Redirecionando...');
      }

      const response = await axios.get('http://localhost:5000/api/usuarios', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setUsers(response.data.users);
      
    } catch (err) {
      console.error('Erro ao buscar usuários:', err);
      if (err.response && err.response.status === 403) {
        setError('Acesso negado. Você não tem permissão para visualizar esta página.');
      } else {
        setError('Erro ao carregar os usuários.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdatePerfil = async (userId, novoPerfil) => {
    try {
      setMessage('');
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Token de acesso não encontrado.');
      }

      const response = await axios.put(`http://localhost:5000/api/usuarios/${userId}/update-profile`, 
        { perfil_nome: novoPerfil }, // Alterado para 'perfil_nome'
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessage(response.data.message);
      fetchUsers(); // Atualiza a lista após a mudança
      
    } catch (error) {
      console.error('Erro ao atualizar o perfil:', error);
      setMessage(error.response?.data?.message || 'Erro ao atualizar o perfil.');
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger mt-5 text-center">{error}</div>;
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Painel de Administração</h2>
        <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
          Voltar para o Painel de Produtos
        </button>
      </div>
      
      {message && <div className={`alert ${message.includes('sucesso') ? 'alert-success' : 'alert-danger'}`}>{message}</div>}

      <div className="table-responsive">
        <table className="table table-hover table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Perfil Atual</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.nome}</td>
                <td>{user.email}</td>
                <td>{user.perfil}</td>
                <td>
                  <select
                    className="form-select form-select-sm"
                    value={user.perfil}
                    onChange={(e) => handleUpdatePerfil(user.id, e.target.value)}
                  >
                    {perfisDisponiveis.map(perfil => (
                      <option key={perfil} value={perfil}>{perfil}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;