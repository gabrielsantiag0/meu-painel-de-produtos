import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Register = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await axios.post('http://localhost:5000/api/usuarios/register', {
        nome,
        email,
        senha
      });

      setMessage(response.data.message);
      
      // Redireciona para a página de login após 2 segundos
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (error) {
      console.error('Erro de registro:', error);
      if (error.response) {
        setMessage(error.response.data.message || 'Erro no servidor, tente novamente.');
      } else {
        setMessage('Erro de conexão. Verifique se o servidor está rodando.');
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card p-4 shadow-sm" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="card-title text-center mb-4">Criar uma Conta</h2>
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label htmlFor="nome" className="form-label">Nome</label>
            <input
              type="text"
              className="form-control"
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="senha" className="form-label">Senha</label>
            <input
              type="password"
              className="form-control"
              id="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 mb-3">
            Registrar
          </button>
        </form>
        {message && (
          <div className={`alert ${message.includes('sucesso') ? 'alert-success' : 'alert-danger'} mt-3`} role="alert">
            {message}
          </div>
        )}
        <p className="text-center mt-3">
          Já tem uma conta? <Link to="/">Faça login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;