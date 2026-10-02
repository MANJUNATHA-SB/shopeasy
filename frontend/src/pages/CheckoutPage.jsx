import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { orderService } from '../services/orderService.js';
import { useCart } from '../context/CartContext.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import './CartPage.css';

export default function CheckoutPage() {
  const { cart, refreshCart } = useCart();
  const navigate = useNavigate();
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState(null);

  if (!cart || cart.items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  async function handlePlaceOrder(e) {
    e.preventDefault();
    setPlacing(true);
    setError(null);
    try {
      const order = await orderService.createOrder({ shippingAddress, paymentMethod });
      await refreshCart();
      navigate(`/orders/${order.id}`);
    } catch (err) {
      setError(err);
    } finally {
      setPlacing(false);
    }
  }

  return (
    <div>
      <h1 className="section-title">Checkout</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 380px) 1fr', gap: 32 }}>
        <form className="form" onSubmit={handlePlaceOrder}>
          <ErrorMessage error={error} />

          <div className="form-group">
            <label htmlFor="shippingAddress">Shipping address</label>
            <textarea
              id="shippingAddress"
              rows={4}
              required
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              placeholder="House no, street, city, state, PIN code"
            />
          </div>

          <div className="form-group">
            <label htmlFor="paymentMethod">Payment method</label>
            <select id="paymentMethod" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <option value="COD">Cash on Delivery</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={placing}>
            {placing ? 'Placing order...' : `Place Order — ₹${cart.totalPrice}`}
          </button>
        </form>

        <div>
          <h2 className="section-title">Order Summary</h2>
          {cart.items.map((item) => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
              <span>{item.productName} × {item.quantity}</span>
              <span>₹{item.subtotal}</span>
            </div>
          ))}
          <div className="cart-summary">
            <span>Total</span>
            <span>₹{cart.totalPrice}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
