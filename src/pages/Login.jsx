import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [message, setMessage] = useState(null); // Usamos um único estado para a mensagem
  const [isSuccess, setIsSuccess] = useState(false); // E um estado para saber se é sucesso ou erro
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null); // Limpa a mensagem anterior
    setIsSuccess(false);

    try {
      const response = await axios.post('http://localhost:5000/api/usuarios/login', {
        email,
        senha,
      });

      if (response.data && response.data.token) {
        localStorage.setItem('accessToken', response.data.token);
        setMessage('Login realizado com sucesso!');
        setIsSuccess(true);
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000); 
      }
    } catch (err) {
      console.error('Erro de login:', err.response?.data || err.message);
      setMessage('Credenciais inválidas. Tente novamente.');
        setIsSuccess(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow p-4">
            <h2 className="card-title text-center text-primary mb-4">Acesso ao Sistema</h2>
            <form onSubmit={handleSubmit}>
              {/* Alerta para exibir a mensagem */}
              {message && (
                <div 
                  className={`alert ${isSuccess ? 'alert-success' : 'alert-danger'} text-center`}
                  role="alert"
                >
                  {message}
                </div>
              )}

              <div className="mb-3">
                <label htmlFor="emailInput" className="form-label">E-mail</label>
                <input
                  type="email"
                  className="form-control"
                  id="emailInput"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="senhaInput" className="form-label">Senha</label>
                <input
                  type="password"
                  className="form-control"
                  id="senhaInput"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
              </div>
              <div className="d-grid gap-2 mt-4">
                <button type="submit" className="btn btn-primary btn-lg">
                  Entrar
                </button>
              </div>

<p className="text-center mt-3">
  Ainda não tem uma conta? <Link to="/register">Crie uma aqui</Link>
</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;