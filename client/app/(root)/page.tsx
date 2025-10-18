import Hero from "../components/landing-page/Hero";
import FeedPage from "../feed/page";
import ContactForm from "../components/landing-page/ContactForm";
import Footer from "../components/landing-page/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stack Coders | Developers Community",
  description:
    "Welcome to Stack Coders — a developer hub for sharing community news and  collaborating on projects and also networking with other developers in the community.",
  keywords: ["developers", "community", "coding", "collaborating", "projects", "Stack Coders"],
  authors: [{ name: "Stack Coders Dev Team" }],
  openGraph: {
    title: "Stack Coders Community Feed",
    description:
      "Stay updated with the latest developer news, projects, and insights from Stack Coders.",
    url: "https://stackcoders.vercel.app",
    siteName: "Stack Coders",
    images: [
      {
        url: "https://stackcoders.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Stack Coders community feed",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stack Coders | Developer Community Hub",
    description:
      "Join Stack Coders — where developers collaborate, connect and share insights.",
    images: ["https://stackcoders.vercel.app/og-image.png"],
  },
};

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
