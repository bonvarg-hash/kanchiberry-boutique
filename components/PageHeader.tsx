/**
 * The standard page header for Shop, Search, Wishlist and Shopping Bag: a title
 * and a one-line description set close beneath it. On phones the description is
 * held to a single line.
 */
export function PageHeader({ title, description, className = "" }: { title: string; description: string; className?: string }) {
  return (
    <header className={className}>
      <h1 className="font-sans text-[clamp(3rem,7vw,6rem)] font-normal leading-[0.9] max-md:text-[42px]">{title}</h1>
      <p className="page-header-desc">{description}</p>
    </header>
  );
}
