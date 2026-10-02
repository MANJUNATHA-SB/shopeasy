import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService } from '../services/productService.js';
import { categoryService } from '../services/categoryService.js';
import ProductCard from '../components/ProductCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [productPage, setProductPage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const keyword = searchParams.get('keyword') || '';
  const categoryId = searchParams.get('categoryId') || '';
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const direction = searchParams.get('direction') || 'desc';
  const page = Number(searchParams.get('page') || 0);

  useEffect(() => {
    categoryService.getCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    productService
      .getProducts({ keyword, categoryId: categoryId || undefined, sortBy, direction, page, size: 12 })
      .then(setProductPage)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [keyword, categoryId, sortBy, direction, page]);

  function updateParam(key, value) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.set('page', '0');
    setSearchParams(next);
  }

  function goToPage(nextPage) {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(nextPage));
    setSearchParams(next);
  }

  return (
    <div>
      <div className="filters-bar">
        <select value={categoryId} onChange={(e) => updateParam('categoryId', e.target.value)}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select
          value={`${sortBy}-${direction}`}
          onChange={(e) => {
            const [nextSortBy, nextDirection] = e.target.value.split('-');
            const next = new URLSearchParams(searchParams);
            next.set('sortBy', nextSortBy);
            next.set('direction', nextDirection);
            next.set('page', '0');
            setSearchParams(next);
          }}
        >
          <option value="createdAt-desc">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A to Z</option>
        </select>

        {keyword && <span className="alert alert-info">Results for "{keyword}"</span>}
      </div>

      <ErrorMessage error={error} />

      {loading && <LoadingSpinner label="Loading products..." />}

      {!loading && !error && productPage && productPage.content.length === 0 && (
        <p className="empty-state">No products found. Try a different search or filter.</p>
      )}

      {!loading && !error && productPage && productPage.content.length > 0 && (
        <>
          <div className="product-grid">
            {productPage.content.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {productPage.totalPages > 1 && (
            <div className="filters-bar" style={{ marginTop: 24, justifyContent: 'center' }}>
              <button
                type="button"
                className="btn btn-outline"
                disabled={page === 0}
                onClick={() => goToPage(page - 1)}
              >
                Previous
              </button>
              <span>Page {page + 1} of {productPage.totalPages}</span>
              <button
                type="button"
                className="btn btn-outline"
                disabled={page + 1 >= productPage.totalPages}
                onClick={() => goToPage(page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
