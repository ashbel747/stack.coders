import { Metadata } from "next";
import LoginForm from "../../components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Login | Stack Coders",
  description:
    "Access your Stack Coders account to share projects, follow developers, and explore the latest community updates.",
  openGraph: {
    title: "Login | Stack Coders",
    description:
      "Access your Stack Coders account to share projects, follow developers, and explore the latest community updates.",
    url: "https://stackcoders.vercel.app/auth/login",
    siteName: "Stack Coders",
    images: [
      {
        url: "https://stackcoders.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Stack Coders Login Page",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Login | Stack Coders",
    description:
      "Access your Stack Coders account and connect with the developer community.",
    images: ["https://stackcoders.vercel.app/og-image.png"],
  },
};


export default function LoginPage() {
  return <LoginForm />;
}
