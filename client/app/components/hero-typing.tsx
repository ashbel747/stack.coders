"use client";

import { Typewriter } from "react-simple-typewriter";

export default function HeroTypingText() {
  return (
    <p className="mt-6 text-3xl leading-8 text-gray-600 dark:text-white">
      <Typewriter
        words={[
            "Join our community of developers.",
            "Collaborate and build top-tier projects.",
            "Solve real-world problems together.",
        ]}
        loop={0} // 0 = infinite loop, or set to 1 to type once
        cursor
        cursorStyle="|"
        typeSpeed={40}
        deleteSpeed={20}
        delaySpeed={2000} // pause before deleting
      />
    </p>
  );
}
