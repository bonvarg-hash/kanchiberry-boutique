import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap py-32 text-center">
      <p className="eyebrow">404</p>
      <h1 className="serif mt-4 text-6xl font-light">This thread leads nowhere.</h1>
      <p className="mt-4 text-ink-soft">The page you’re looking for isn’t on the rail.</p>
      <Link href="/" className="btn btn-primary mt-10">
        Back to the boutique
      </Link>
    </div>
  );
}
