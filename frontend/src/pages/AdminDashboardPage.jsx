import { useEffect, useState } from 'react';
import { productService } from '../services/productService.js';
import { categoryService } from '../services/categoryService.js';
import { orderService } from '../services/orderService.js';
import api from '../services/api.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

const EMPTY_PRODUCT_FORM = {
  id: null,
  name: '',
  description: '',
  price: '',
  stockQuantity: '',
  imageUrl: '',
  categoryId: '',
};

export default function AdminDashboardPage() {
  const [tab, setTab] = useState('products');

  return (
    <div>
      <h1 className="section-title">Admin Dashboard</h1>

      <div className="admin-tabs">
        {['products', 'categories', 'orders', 'users'].map((t) => (
          <button
            key={t}
            type="button"
            className={`admin-tab ${tab === t ? 'active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === 'products' && <ProductsTab />}
      {tab === 'categories' && <CategoriesTab />}
      {tab === 'orders' && <OrdersTab />}
      {tab === 'users' && <UsersTab />}
    </div>
  );
}

function ProductsTab() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(EMPTY_PRODUCT_FORM);
  const [saving, setSaving] = useState(false);

  function loadProducts() {
    setLoading(true);
    productService
      .getProducts({ page: 0, size: 100, sortBy: 'createdAt', direction: 'desc' })
      .then((data) => setProducts(data.content))
      .catch(setError)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadProducts();
    categoryService.getCategories().then(setCategories).catch(() => {});
  }, []);

  function startEdit(product) {
    setForm({
      id: product.id,
      name: product.name,
      description: product.description || '',
      price: product.price,
      stockQuantity: product.stockQuantity,
      imageUrl: product.imageUrl || '',
      categoryId: product.categoryId,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      stockQuantity: Number(form.stockQuantity),
      imageUrl: form.imageUrl,
      categoryId: Number(form.categoryId),
    };
    try {
      if (form.id) {
        await productService.updateProduct(form.id, payload);
      } else {
        await productService.createProduct(payload);
      }
      setForm(EMPTY_PRODUCT_FORM);
      loadProducts();
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this product?')) return;
    try {
      await productService.deleteProduct(id);
      loadProducts();
    } catch (err) {
      setError(err);
    }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 320px) 1fr', gap: 32 }}>
      <form className="form" onSubmit={handleSubmit}>
        <h2 className="section-title">{form.id ? 'Edit Product' : 'Add Product'}</h2>
        <ErrorMessage error={error} />

        <div className="form-group">
          <label>Name</label>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Price</label>
          <input
            type="number"
            step="0.01"
            min="0"
            required
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Stock quantity</label>
          <input
            type="number"
            min="0"
            required
            value={form.stockQuantity}
            onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Image URL</label>
          <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select
            required
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          >
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : form.id ? 'Update Product' : 'Add Product'}
          </button>
          {form.id && (
            <button type="button" className="btn btn-outline" onClick={() => setForm(EMPTY_PRODUCT_FORM)}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div>
        <h2 className="section-title">All Products</h2>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.categoryName}</td>
                  <td>₹{p.price}</td>
                  <td>{p.stockQuantity}</td>
                  <td style={{ display: 'flex', gap: 10 }}>
                    <button type="button" className="btn btn-outline" onClick={() => startEdit(p)}>Edit</button>
                    <button type="button" className="btn btn-danger" onClick={() => handleDelete(p.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function CategoriesTab() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  function loadCategories() {
    setLoading(true);
    categoryService.getCategories().then(setCategories).catch(setError).finally(() => setLoading(false));
  }

  useEffect(loadCategories, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await categoryService.createCategory({ name, description });
      setName('');
      setDescription('');
      loadCategories();
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 320px) 1fr', gap: 32 }}>
      <form className="form" onSubmit={handleSubmit}>
        <h2 className="section-title">Add Category</h2>
        <ErrorMessage error={error} />

        <div className="form-group">
          <label>Name</label>
          <input required value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Description</label>
          <input value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving...' : 'Add Category'}
        </button>
      </form>

      <div>
        <h2 className="section-title">All Categories</h2>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <table className="data-table">
            <thead>
              <tr><th>Name</th><th>Description</th></tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}><td>{c.name}</td><td>{c.description}</td></tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function OrdersTab() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    orderService.getAllOrdersAdmin().then(setOrders).catch(setError).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      <h2 className="section-title">All Orders</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>Order #</th>
            <th>Date</th>
            <th>Items</th>
            <th>Total</th>
            <th>Shipping Address</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>#{order.id}</td>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              <td>{order.items.length}</td>
              <td>₹{order.totalPrice}</td>
              <td>{order.shippingAddress}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/admin/users').then((res) => setUsers(res.data)).catch(setError).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      <h2 className="section-title">All Users</h2>
      <table className="data-table">
        <thead>
          <tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{new Date(u.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
