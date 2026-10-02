import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../services/productService.js';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import QuantityControl from '../components/QuantityControl.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addError, setAddError] = useState(null);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    setProduct(null);
    setQuantity(1);
    productService
      .getProductById(id)
      .then(setProduct)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  async function handleAddToCart() {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/products/${id}` } } });
      return;
    }
    setAdding(true);
    setAddError(null);
    setAdded(false);
    try {
      await addItem(product.id, quantity);
      setAdded(true);
    } catch (err) {
      setAddError(err);
    } finally {
      setAdding(false);
    }
  }

  if (loading) return <LoadingSpinner label="Loading product..." />;
  if (error) return <ErrorMessage error={error} />;
  if (!product) return null;

  const outOfStock = product.stockQuantity === 0;

  return (
    <div className="product-detail">
      <img src={product.imageUrl || 'https://placehold.co/500x400?text=No+Image'} alt={product.name} />

      <div>
        <h1>{product.name}</h1>
        <p style={{ color: 'var(--color-muted)' }}>{product.categoryName}</p>
        <p className="product-card-price" style={{ fontSize: '1.4rem' }}>₹{product.price}</p>
        <p>{product.description}</p>

        {outOfStock ? (
          <p className="stock-out">Out of stock</p>
        ) : (
          <p style={{ color: 'var(--color-muted)' }}>{product.stockQuantity} in stock</p>
        )}

        <ErrorMessage error={addError} />
        {added && <div className="alert alert-info">Added to cart.</div>}

        {!outOfStock && (
          <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginTop: 12 }}>
            <QuantityControl quantity={quantity} onChange={setQuantity} max={product.stockQuantity} />
            <button type="button" className="btn btn-primary" disabled={adding} onClick={handleAddToCart}>
              {adding ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
