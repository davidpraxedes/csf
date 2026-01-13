export default function Logo({ size = 'md' }) {
  const sizes = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16'
  };

  const height = sizes[size] || sizes.md;

  return (
    <div className={`${height} flex items-center`}>
      <img
        src="/images/logo-carrefour.png"
        alt="Carrefour Soluções Financeiras"
        className="h-full w-auto object-contain"
      />
    </div>
  );
}
