import React, { useState, useEffect } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

const PublicProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/produtos-publico');
        setProducts(response.data.products);
      } catch (err) {
        console.error("Erro ao buscar os produtos:", err);
        setError("Não foi possível carregar os produtos. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
    return (
      <div className="container mt-5 text-center text-danger">
        <h4>{error}</h4>
      </div>
    );
  }
  
  return (
    <>
      {/* Hero Section */}
      <div className="bg-light text-dark p-5 rounded-3 mb-5">
        <div className="container-fluid py-5 text-center">
          <h1 className="display-5 fw-bold">Bem-vindo(a) ao Catálogo de Produtos!</h1>
          <p className="fs-4">Descubra nossa variedade de produtos incríveis.</p>
        </div>
      </div>
      
      <div className="container my-5">
        <h2 className="text-center mb-4">Explore nossos Produtos</h2>
        
        {products.length > 0 ? (
          <div className="row justify-content-center">
            {products.map(product => (
              <div key={product.id} className="col-md-4 mb-4">
                {/* Card com efeito de sombra e transição */}
                <div className="card h-100 shadow-sm product-card">
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-bold text-primary">{product.nome}</h5>
                    <p className="card-text text-muted flex-grow-1">{product.descricao}</p>
                    <p className="card-text">
                      <span className="badge bg-success p-2">
                        R$ {product.preco.toFixed(2)}
                      </span>
                    </p>
                    <p className="card-text text-end">
                      <small className="text-muted">
                        Em estoque: {product.quantidade}
                      </small>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <p>Nenhum produto encontrado.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default PublicProductList;