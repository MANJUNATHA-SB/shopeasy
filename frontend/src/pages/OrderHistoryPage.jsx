import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../services/orderService.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    orderService
      .getMyOrders()
      .then(setOrders)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner label="Loading orders..." />;
  if (error) return <ErrorMessage error={error} />;

  if (orders.length === 0) {
    return (
      <div className="empty-state">
        <p>You haven't placed any orders yet.</p>
        <Link to="/" className="btn btn-primary">Start shopping</Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="section-title">Your Orders</h1>
      <table className="data-table">
        <thead>
          <tr>
            <th>Order #</th>
            <th>Date</th>
            <th>Items</th>
            <th>Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>#{order.id}</td>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              <td>{order.items.length}</td>
              <td>₹{order.totalPrice}</td>
              <td><Link to={`/orders/${order.id}`}>View</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
