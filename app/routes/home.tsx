import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resume Analyzer" },
    { name: "description", content: "AI CV Analyzer" },
  ];
}

export default function Home() {
  return <main>
    <section className="main-section">
      <div className="page-heading">
        <h1>Track Your Applications & Resume Ratings</h1>
        <h2>Review your submissions and check AI-powered feedback.</h2>
      </div>
    </section>
  </main>;
}
