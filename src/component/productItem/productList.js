import React, { useState, useEffect } from 'react';
import './productList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const productsPerPage = 10;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://fakestoreapi.com/products');
        const data = await response.json();
        setProducts(data);
        setDisplayedProducts(data.slice(0, productsPerPage));
      } catch (error) {
        setError('Error fetching products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const loadMoreProducts = () => {
    const start = currentPage * productsPerPage;
    const end = start + productsPerPage;
    setDisplayedProducts(displayedProducts.concat(products.slice(start, end)));
    setCurrentPage(currentPage + 1);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    const filteredProducts = products.filter(product =>
      product.title.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setDisplayedProducts(filteredProducts.slice(0, currentPage * productsPerPage));
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="product-main">
      <header>
        <h1>Product List</h1>
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </header>
      <main>
        <div className="products-container">
          {displayedProducts.map(product => (
            <div className="product-card" key={product.id}>
              <img src={product.image} alt={product.title} width='50' height='50'/>
              <h2>{product.title}</h2>
              <p className='product-price'>${product.price.toFixed(2)}</p>
              <p className='product-des'>{product.description}</p>
            </div>
          ))}
        </div>
        {displayedProducts.length < products.length && (
          <button className='load-more' onClick={loadMoreProducts}>Load More</button>
        )}
      </main>
    </div>
  );
};

export default ProductList;