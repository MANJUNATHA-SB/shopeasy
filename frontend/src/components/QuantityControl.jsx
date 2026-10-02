import './QuantityControl.css';

export default function QuantityControl({ quantity, onChange, max }) {
  function decrease() {
    if (quantity > 1) onChange(quantity - 1);
  }

  function increase() {
    if (!max || quantity < max) onChange(quantity + 1);
  }

  return (
    <div className="qty-control">
      <button type="button" onClick={decrease} aria-label="Decrease quantity">−</button>
      <span>{quantity}</span>
      <button type="button" onClick={increase} aria-label="Increase quantity">+</button>
    </div>
  );
}
