import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [pendingChanges, setPendingChanges] = useState({}); // Novo estado para mudanças pendentes
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

  // Lida com a mudança no dropdown, mas não chama a API
  const handlePerfilChange = (userId, novoPerfil) => {
    setPendingChanges(prevChanges => ({
      ...prevChanges,
      [userId]: novoPerfil
    }));
  };

  const handleUpdatePerfil = async (userId, novoPerfil) => {
    try {
      setMessage('');
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Token de acesso não encontrado.');
      }

      const response = await axios.put(`http://localhost:5000/api/usuarios/${userId}/update-profile`, 
        { perfil_nome: novoPerfil },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessage(response.data.message);
      // Remove a alteração pendente do estado após o sucesso
      setPendingChanges(prevChanges => {
        const newChanges = { ...prevChanges };
        delete newChanges[userId];
        return newChanges;
      });

      fetchUsers(); // Atualiza a lista após a mudança
      
    } catch (error) {
      console.error('Erro ao atualizar o perfil:', error);
      setMessage(error.response?.data?.message || 'Erro ao atualizar o perfil.');
    }
  };

  // Cancela a alteração pendente
  const handleCancelChange = (userId) => {
    setPendingChanges(prevChanges => {
      const newChanges = { ...prevChanges };
      delete newChanges[userId];
      return newChanges;
    });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
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
        <h2 className="fw-bold text-primary">Painel de Administração</h2>
        <button onClick={() => navigate('/dashboard')} className="btn btn-outline-secondary">
          Voltar
        </button>
      </div>
      
      <div className="card shadow-sm p-4">
        {message && (
          <div className={`alert ${message.includes('sucesso') ? 'alert-success' : 'alert-danger'} fade show`} role="alert">
            {message}
          </div>
        )}

        <h4 className="card-title mb-3">Gerenciamento de Usuários</h4>
        
        <div className="table-responsive">
          <table className="table table-hover table-striped">
            <thead className="table-light">
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
                  <td>
                    <span className={`badge ${
                      (pendingChanges[user.id] || user.perfil) === 'Administrador' ? 'bg-danger' : 
                      (pendingChanges[user.id] || user.perfil) === 'Supervisor' ? 'bg-info' : 
                      'bg-secondary'
                    }`}>
                      {/* Exibe a alteração pendente ou o perfil original */}
                      {pendingChanges[user.id] ? `${user.perfil} -> ${pendingChanges[user.id]}` : user.perfil}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <select
                        className="form-select form-select-sm me-2"
                        value={pendingChanges[user.id] || user.perfil} // Usa o valor pendente se existir
                        onChange={(e) => handlePerfilChange(user.id, e.target.value)}
                      >
                        {perfisDisponiveis.map(perfil => (
                          <option key={perfil} value={perfil}>{perfil}</option>
                        ))}
                      </select>
                      
                      {/* Botões de confirmação/cancelamento aparecem se houver uma mudança pendente */}
                      {pendingChanges[user.id] && (
                        <>
                          <button
                            className="btn btn-success btn-sm me-2"
                            onClick={() => handleUpdatePerfil(user.id, pendingChanges[user.id])}
                          >
                            Confirmar
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleCancelChange(user.id)}
                          >
                            Cancelar
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;