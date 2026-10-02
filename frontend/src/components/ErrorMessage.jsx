export default function ErrorMessage({ error }) {
  if (!error) return null;

  const message =
    error?.response?.data?.message ||
    error?.response?.data?.details?.join(', ') ||
    (typeof error === 'string' ? error : 'Something went wrong. Please try again.');

  return <div className="alert alert-error">{message}</div>;
}
