import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  const outOfStock = product.stockQuantity === 0;

  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <img src={product.imageUrl || 'https://placehold.co/400x300?text=No+Image'} alt={product.name} />
      <div className="product-card-body">
        <span className="product-card-name">{product.name}</span>
        <span className="product-card-price">₹{product.price}</span>
        {outOfStock && <span className="stock-out">Out of stock</span>}
      </div>
    </Link>
  );
}
