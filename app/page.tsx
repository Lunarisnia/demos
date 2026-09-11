import Link from "next/link";
import { categories, demos } from "@/demos/registry";

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <Link className="wordmark" href="/">
          FIELD NOTES <span>/ DEMOS</span>
        </Link>
        <p>Math, graphics, and small computational experiments.</p>
      </header>

      <section className="hero">
        <div className="eyebrow">A living laboratory</div>
        <h1>
          Ideas are better
          <br />
          when they <em>move.</em>
        </h1>
        <p className="hero-copy">
          A central shelf for visual proofs, rendering studies, simulations,
          and curious mathematical objects. Pick an experiment and open the
          workspace.
        </p>
        <div className="hero-stats" aria-label="Repository summary">
          <span>{String(demos.length).padStart(2, "0")} experiments</span>
          <span>{String(categories.length).padStart(2, "0")} disciplines</span>
          <span>{String(demos.length).padStart(2, "0")} runnable</span>
        </div>
      </section>

      <section className="catalog" aria-labelledby="catalog-heading">
        <div className="section-heading">
          <p>Index</p>
          <h2 id="catalog-heading">Choose a study</h2>
        </div>

        <div className="demo-grid">
          {demos.map((demo, index) => (
            <Link className="demo-card" href={`/demos/${demo.slug}`} key={demo.slug}>
              <div className={`card-visual visual-${demo.accent}`} aria-hidden="true">
                <span>{demo.glyph}</span>
              </div>
              <div className="card-meta">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span>{demo.category}</span>
              </div>
              <h3>{demo.title}</h3>
              <p>{demo.description}</p>
              <div className="card-footer">
                <span className="status status-ready">Run experiment</span>
                <span aria-hidden="true">↗</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <footer>
        <span>Built for unfinished thoughts.</span>
        <span>Next.js / Canvas / WebGL ready</span>
      </footer>
    </main>
  );
}
