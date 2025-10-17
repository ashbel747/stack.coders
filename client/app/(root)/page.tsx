import Hero from "../components/landing-page/Hero";
import FeedPage from "../components/landing-page/Feed";
import ContactForm from "../components/landing-page/ContactForm";
import Footer from "../components/landing-page/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <FeedPage />
      <ContactForm />
      <Footer />
    </main>
  );
}
