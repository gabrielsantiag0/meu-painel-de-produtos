import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const EditProduct = () => {
  const { id } = useParams(); // Pega o ID da URL
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          setMessage('Você não está autenticado.');
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/produtos/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const product = response.data.product;
        setNome(product.nome);
        setDescricao(product.descricao);
        setPreco(product.preco);
        setQuantidade(product.quantidade);
        setLoading(false);

      } catch (error) {
        console.error('Erro ao carregar o produto:', error);
        setMessage('Erro ao carregar os dados do produto.');
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setMessage('Você não está autenticado. Por favor, faça login.');
        return;
      }

      const updatedProduct = {
        nome,
        descricao,
        preco: parseFloat(preco),
        quantidade: parseInt(quantidade)
      };

      const response = await axios.put(`http://localhost:5000/api/produtos/${id}`, updatedProduct, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setMessage(response.data.message);
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      if (error.response) {
        setMessage(error.response.data.message || 'Erro ao atualizar o produto.');
      } else {
        setMessage('Erro de conexão. Verifique se o servidor está rodando.');
      }
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

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card p-4 shadow-sm" style={{ maxWidth: '600px', width: '100%' }}>
        <h2 className="card-title text-center mb-4">Editar Produto</h2>
        <form onSubmit={handleUpdateProduct}>
          <div className="mb-3">
            <label htmlFor="nome" className="form-label">Nome</label>
            <input type="text" className="form-control" id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label htmlFor="descricao" className="form-label">Descrição</label>
            <textarea className="form-control" id="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} rows="3" />
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="preco" className="form-label">Preço</label>
              <input type="number" step="0.01" className="form-control" id="preco" value={preco} onChange={(e) => setPreco(e.target.value)} required />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="quantidade" className="form-label">Quantidade</label>
              <input type="number" className="form-control" id="quantidade" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} required />
            </div>
          </div>
          <button type="submit" className="btn btn-warning w-100 mb-3">
            Salvar Alterações
          </button>
        </form>
        {message && (
          <div className={`alert ${message.includes('sucesso') ? 'alert-success' : 'alert-danger'} mt-3`} role="alert">
            {message}
          </div>
        )}
        <button onClick={() => navigate('/dashboard')} className="btn btn-secondary w-100 mt-2">
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default EditProduct;