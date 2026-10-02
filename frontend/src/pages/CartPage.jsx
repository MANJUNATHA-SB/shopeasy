import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import QuantityControl from '../components/QuantityControl.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import './CartPage.css';

export default function CartPage() {
  const { cart, updateItem, removeItem } = useCart();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [busyItemId, setBusyItemId] = useState(null);

  async function handleQuantityChange(itemId, quantity) {
    setBusyItemId(itemId);
    setError(null);
    try {
      await updateItem(itemId, quantity);
    } catch (err) {
      setError(err);
    } finally {
      setBusyItemId(null);
    }
  }

  async function handleRemove(itemId) {
    setBusyItemId(itemId);
    setError(null);
    try {
      await removeItem(itemId);
    } catch (err) {
      setError(err);
    } finally {
      setBusyItemId(null);
    }
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="empty-state">
        <p>Your cart is empty.</p>
        <Link to="/" className="btn btn-primary">Browse products</Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="section-title">Your Cart</h1>
      <ErrorMessage error={error} />

      {cart.items.map((item) => (
        <div className="cart-item" key={item.id}>
          <img src={item.productImageUrl || 'https://placehold.co/100x100?text=No+Image'} alt={item.productName} />
          <div className="cart-item-info">
            <Link to={`/products/${item.productId}`}><strong>{item.productName}</strong></Link>
            <p style={{ margin: '4px 0', color: 'var(--color-muted)' }}>₹{item.price} each</p>
            <QuantityControl
              quantity={item.quantity}
              onChange={(qty) => handleQuantityChange(item.id, qty)}
            />
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontWeight: 700 }}>₹{item.subtotal}</p>
            <button
              type="button"
              className="btn btn-danger"
              disabled={busyItemId === item.id}
              onClick={() => handleRemove(item.id)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <div className="cart-summary">
        <span>Total</span>
        <span>₹{cart.totalPrice}</span>
      </div>

      <button type="button" className="btn btn-primary btn-block" onClick={() => navigate('/checkout')}>
        Proceed to Checkout
      </button>
    </div>
  );
}
