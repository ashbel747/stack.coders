"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-50 px-4">
      <Image
        src="/not-found.png"
        alt="Page not found"
        width={300}
        height={300}
        className="mb-6 object-contain"
      />

      <h1 className="text-6xl font-bold text-blue-600">404</h1>

      <p className="mt-2 text-gray-800 text-lg">
        Page not found. Redirecting you...
      </p>
    </div>
  );
}
