import { Metadata } from "next";
import SignupForm from "../../components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Join Stack Coders | Sign Up",
  description:
    "Create your Stack Coders account to join the community, share projects, and collaborate with developers worldwide.",
  openGraph: {
    title: "Join Stack Coders | Sign Up",
    description:
      "Create your Stack Coders account to join the community, share projects, and collaborate with developers worldwide.",
    url: "https://stack-coders.vercel.app/auth/signup",
    siteName: "Stack Coders",
    images: [
      {
        url: "https://stack-coders.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Stack Coders Signup Page",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Join Stack Coders | Sign Up",
    description:
      "Create your Stack Coders account to join the community and start collaborating today.",
    images: ["https://stack-coders.vercel.app/og-image.png"],
  },
};

export default function SignupPage() {
  return <SignupForm />;
}
