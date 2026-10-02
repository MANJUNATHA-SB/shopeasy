import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../services/orderService.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    orderService
      .getOrderById(id)
      .then(setOrder)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner label="Loading order..." />;
  if (error) return <ErrorMessage error={error} />;
  if (!order) return null;

  return (
    <div>
      <p><Link to="/orders">← Back to orders</Link></p>
      <h1 className="section-title">Order #{order.id}</h1>
      <p style={{ color: 'var(--color-muted)' }}>
        Placed on {new Date(order.createdAt).toLocaleString()} · Paid via {order.paymentMethod}
      </p>

      <h2 className="section-title" style={{ marginTop: 24 }}>Shipping Address</h2>
      <p>{order.shippingAddress}</p>

      <h2 className="section-title" style={{ marginTop: 24 }}>Items</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item, i) => (
            <tr key={i}>
              <td>{item.productName}</td>
              <td>₹{item.price}</td>
              <td>{item.quantity}</td>
              <td>₹{item.subtotal}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="cart-summary">
        <span>Total</span>
        <span>₹{order.totalPrice}</span>
      </div>
    </div>
  );
}
