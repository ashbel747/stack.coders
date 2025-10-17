import React from "react";
import HeroTypingText from "../hero-typing";
import Image from "next/image";
import Link from "next/link";

const Hero: React.FC = () => {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* 🔹 Background Image */}
      <Image
        src="/download.jpeg"
        alt="Hero background"
        fill
        className="object-center brightness-50"
        priority
      />

      {/* 🔹 Overlay gradient for smoother contrast */}
      <div className="absolute inset-0 bg-black/40" />

      {/* 🔹 Overlay Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl">
        <div className="mt-12">
          <h1
            className="inline-block text-white text-4xl font-semibold px-8 py-4 rounded-xl shadow-lg"
          >
            Stack Coders.
          </h1>
        </div>
        
        <h2>
          <HeroTypingText />
        </h2>

        {/* 🔹 Get Started Button */}
        <div className="mt-12">
          <Link
            href="/auth"
            className="inline-block bg-blue-600 text-white text-lg font-semibold px-8 py-4 rounded-xl shadow-lg hover:bg-blue-700 hover:scale-105 transition-all duration-300"
          >
            Get Started
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
