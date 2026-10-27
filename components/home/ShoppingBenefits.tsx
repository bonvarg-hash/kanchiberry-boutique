const ITEMS = [
  { n: "01", title: "Craft Worth Keeping", text: "A considered selection of sarees chosen for their design and textile character." },
  { n: "02", title: "Detailed Product Information", text: "Clear descriptions, fabric details, measurements, and care instructions for every saree." },
  { n: "03", title: "Personal Assistance", text: "Help with choosing a saree or questions about a purchase. Contact channel to be confirmed before launch." },
];

export function ShoppingBenefits() {
  return (
    <section aria-labelledby="benefits-title" className="wrap border-t border-sand py-20">
      <h2 id="benefits-title" className="eyebrow mb-12">
        A Thoughtful Purchase
      </h2>
      <ul className="grid gap-12 md:grid-cols-3">
        {ITEMS.map((i) => (
          <li key={i.n}>
            <span className="serif text-[15px] italic text-berry">{i.n}</span>
            <h3 className="serif mt-2 text-[28px] leading-tight">{i.title}</h3>
            <p className="mt-3 max-w-[34ch] text-[16px] text-ink-soft">{i.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
