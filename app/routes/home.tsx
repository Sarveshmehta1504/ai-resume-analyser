import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ResumeFEED" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <main className="bg-[url('/images/bg-main.svg')] bg-cover">
    <Navbar/>
    <section className="main-section">
      <div className="page-heading">
        <h1>Track You Resume Application</h1>
        <h2>Review you resume and get AI-powred Feedback</h2>
      </div>
    </section>
    
  </main>
}
