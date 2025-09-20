import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddProduct = () => {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setMessage('Você não está autenticado. Por favor, faça login.');
        return;
      }

      const newProduct = {
        nome,
        descricao,
        preco: parseFloat(preco), // Converte o preço para número
        quantidade: parseInt(quantidade) // Converte a quantidade para número inteiro
      };

      const response = await axios.post('http://localhost:5000/api/produtos', newProduct, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setMessage(response.data.message);
      
      // Redireciona para o Dashboard após 2 segundos
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      if (error.response) {
        setMessage(error.response.data.message || 'Erro ao adicionar o produto.');
      } else {
        setMessage('Erro de conexão. Verifique se o servidor está rodando.');
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card p-4 shadow-sm" style={{ maxWidth: '600px', width: '100%' }}>
        <h2 className="card-title text-center mb-4">Adicionar Novo Produto</h2>
        <form onSubmit={handleAddProduct}>
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
          <button type="submit" className="btn btn-success w-100 mb-3">
            Adicionar Produto
          </button>
        </form>
        {message && (
          <div className={`alert ${message.includes('sucesso') ? 'alert-success' : 'alert-danger'} mt-3`} role="alert">
            {message}
          </div>
        )}
        <button onClick={() => navigate('/dashboard')} className="btn btn-secondary w-100 mt-2">
          Voltar para o Painel
        </button>
      </div>
    </div>
  );
};

export default AddProduct;