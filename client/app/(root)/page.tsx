import Hero from "../components/landing-page/Hero";
import FeedPage from "../components/landing-page/Feed";
import ContactForm from "../components/landing-page/ContactForm";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <FeedPage />
      <ContactForm />
    </main>
  );
}
