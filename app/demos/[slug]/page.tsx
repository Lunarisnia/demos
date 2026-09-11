import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { demos, getDemo } from "@/demos/registry";

export const dynamicParams = false;

export function generateStaticParams() {
  return demos.map((demo) => ({ slug: demo.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/demos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const demo = getDemo(slug);

  return demo
    ? { title: demo.title, description: demo.description }
    : { title: "Demo not found" };
}

export default async function DemoPage({ params }: PageProps<"/demos/[slug]">) {
  const { slug } = await params;
  const demo = getDemo(slug);

  if (!demo) notFound();

  const DemoComponent = demo.component;

  return (
    <main className="demo-page">
      <header className="demo-page-header">
        <div className="demo-intro">
          <Link className="back-link" href="/">
            ← All experiments
          </Link>
          <nav className="experiment-switcher" aria-label="Choose experiment">
            {demos.map((experiment, index) => (
              <Link
                aria-current={experiment.slug === demo.slug ? "page" : undefined}
                href={`/demos/${experiment.slug}`}
                key={experiment.slug}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                {experiment.title}
              </Link>
            ))}
          </nav>
          <h1>{demo.title}</h1>
        </div>
        <div className="demo-summary">
          <p>{demo.description}</p>
          <dl className="demo-facts">
            <div><dt>Discipline</dt><dd>{demo.category}</dd></div>
            <div><dt>Medium</dt><dd>{demo.technology}</dd></div>
            <div><dt>Status</dt><dd>Runnable</dd></div>
          </dl>
        </div>
      </header>

      <section className="workspace">
        <div className="workspace-label">
          <span>Interactive workspace</span>
          <span>{demo.slug}</span>
        </div>
        <div className="demo-stage"><DemoComponent /></div>
      </section>
    </main>
  );
}
