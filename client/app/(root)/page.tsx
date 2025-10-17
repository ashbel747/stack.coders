import Hero from "../components/landing-page/Hero";
import FeedPage from "../components/landing-page/Feed";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <FeedPage />
    </main>
  );
}
