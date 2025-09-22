import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard = () => {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [userProfile, setUserProfile] = useState(null); 
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/');
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        alert('Você não está autenticado.');
        return;
      }

      const confirmDelete = window.confirm('Tem certeza que deseja excluir este produto?');
      if (confirmDelete) {
        await axios.delete(`http://localhost:5000/api/produtos/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setProdutos(produtos.filter(produto => produto.id !== id));
        alert('Produto excluído com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      alert('Erro ao excluir o produto. Verifique suas permissões.');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserProfile(decoded.perfil);
      } catch (e) {
        console.error("Falha ao decodificar o token:", e);
        handleLogout();
      }
    }

    const fetchProdutos = async () => {
      try {
        if (!token) {
          throw new Error('Token de acesso não encontrado.');
        }

        const params = searchQuery ? { nome: searchQuery } : {};

        const response = await axios.get('http://localhost:5000/api/produtos', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: params
        });

        setProdutos(response.data.products);
      } catch (err) {
        setError('Erro ao carregar os produtos.');
        console.error('Erro ao buscar produtos:', err);
      } finally {
        setLoading(false);
      }
    };

    const debounceSearch = setTimeout(() => {
      fetchProdutos();
    }, 500);

    return () => clearTimeout(debounceSearch);
  }, [searchQuery]);

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
    return <div className="alert alert-danger mt-5">{error}</div>;
  }

  return (
     <div className="container mt-5">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
                <h2 className="mb-3 mb-md-0">Painel de Produtos</h2>
                
                <div className="d-flex flex-column flex-md-row gap-2">
                    <input
                        type="text"
                        className="form-control form-control-sm flex-grow-1"
                        placeholder="Buscar produto..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    
                    {userProfile === 'Administrador' && (
                        <button onClick={() => navigate('/admin-dashboard')} className="btn btn-dark btn-sm">
                            Gerenciar Usuários
                        </button>
                    )}
                    
                    <button onClick={() => navigate('/add-product')} className="btn btn-primary btn-sm">
                        Adicionar Produto
                    </button>
                    
                    <button onClick={handleLogout} className="btn btn-danger btn-sm">
                        LogOut
                    </button>
                </div>
            </div>

            {produtos && Array.isArray(produtos) && produtos.length > 0 ? (
                <div className="table-responsive">
                    <table className="table table-hover table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nome</th>
                                <th>Descrição</th>
                                <th>Preço</th>
                                <th>Quantidade</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {produtos.map(produto => (
                                <tr key={produto.id}>
                                    <td>{produto.id}</td>
                                    <td>{produto.nome}</td>
                                    <td>{produto.descricao}</td>
                                    <td>R$ {produto.preco?.toFixed(2) ?? 'N/A'}</td>
                                    <td>{produto.quantidade}</td>
                                    <td>
                                        {userProfile === 'Supervisor' && (
                                            <>
                                                <button
                                                    className="btn btn-warning btn-sm me-2"
                                                    onClick={() => navigate(`/edit-product/${produto.id}`)}>
                                                    Editar
                                                </button>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleDelete(produto.id)}>
                                                    Excluir
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="alert alert-info text-center mt-4">
                    Nenhum produto encontrado.
                </div>
            )}
        </div>
  );
};

export default Dashboard;