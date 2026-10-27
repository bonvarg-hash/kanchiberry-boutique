import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { craftPhotos } from "@/lib/craft";

/** A photo in a circle with a half-ring arc around it, as on a display plinth. */
function ArcPhoto({ src, alt, tag, flip = false, position = "50% 30%", credit }: { src: string; alt: string; tag: string; flip?: boolean; position?: string; credit?: string }) {
  return (
    <div className="relative mx-auto w-full max-w-[400px]">
      <span className={`absolute top-0 z-10 text-[13px] italic text-ink ${flip ? "right-2" : "left-2"}`} style={{ fontFamily: "var(--font-title)" }}>
        {tag}
      </span>
      <div className="arc-ring relative aspect-square p-5" data-flip={flip || undefined}>
        <div className="size-full overflow-hidden rounded-full bg-sand-soft">
          <img src={src} alt={alt} loading="lazy" className="size-full object-cover" style={{ objectPosition: position }} />
        </div>
      </div>
      {credit && <p className="mt-2 text-center text-[11px] tracking-[0.04em] text-ink-soft">{credit}</p>}
    </div>
  );
}

function Block({
  title,
  body,
  href,
  photo,
  flip = false,
}: {
  title: string;
  body: string[];
  href: string;
  photo: { src: string; alt: string; position?: string; credit?: string };
  flip?: boolean;
}) {
  return (
    <Reveal>
      <div
        className={`grid items-center gap-10 md:grid-cols-2 ${
          flip ? "rounded-bl-[56px] border-b border-l border-ink/70 pb-12 pl-6 md:pl-12" : "rounded-tr-[56px] border-r border-t border-ink/70 pr-6 pt-12 md:pr-12"
        }`}
      >
        <div className={flip ? "md:order-2" : ""}>
          <ArcPhoto src={photo.src} alt={photo.alt} tag="Kanchiberry" flip={flip} position={photo.position} credit={photo.credit} />
        </div>
        <div className={flip ? "md:order-1" : ""}>
          <h3 className="text-[clamp(2rem,3.4vw,2.8rem)] leading-tight" style={{ fontFamily: "var(--font-title)" }}>
            {title}
          </h3>
          {body.map((t) => (
            <p key={t} className="mt-4 max-w-[46ch] text-[16px] leading-relaxed text-ink-soft">
              {t}
            </p>
          ))}
          <Link href={href} className="btn btn-primary mt-8">
            Explore Now <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </Reveal>
  );
}

export function DrapeYourDay() {
  return (
    <section aria-labelledby="drape-title" className="wrap overflow-x-clip py-16 md:py-24 lg:py-32">
      <h2 id="drape-title" className="section-title text-center">
        Drape Your Day with Kanchiberry
      </h2>
      <div className="mx-auto mt-16 max-w-5xl space-y-0">
        <Block
          title="The Weave"
          body={[
            "Every saree begins with its weave: the weight of the silk, the shine of the zari, the rhythm of a border repeated end to end.",
            "Discover how Kanjivaram, Banarasi, Paithani and other traditions each give a saree its own character.",
          ]}
          href="/art-of-weaving"
          photo={{
            src: craftPhotos.kanchipuramLoom.src,
            alt: craftPhotos.kanchipuramLoom.alt,
            position: "50% 50%",
            credit: `Photo: ${craftPhotos.kanchipuramLoom.credit}, ${craftPhotos.kanchipuramLoom.license}, Wikimedia Commons`,
          }}
        />
        <div className="-mt-px">
          <Block
            title="The Drape"
            flip
            body={[
              "A saree comes alive when it is worn: pleats that fall just so, a pallu that moves with you, colour that lights up a room.",
              "Find the drape for your next occasion, from wedding silks to easy everyday handlooms.",
            ]}
            href="/shop"
            photo={{ src: "/photos/kb-9.jpg", alt: "A striped pallu and pleats falling in soft folds to the floor", position: "60% 55%" }}
          />
        </div>
      </div>
    </section>
  );
}
