"use client";

import { Mail, Github, Linkedin, Twitter, Instagram, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-blue-50 text-blue-800 py-10 border-t border-blue-100">
      <div className="max-w-6xl mx-auto px-6">
        {/* Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Column 1 - Name */}
          <div>
            <h2 className="text-2xl font-bold text-blue-700">Stack Coders</h2>
            <p className="text-blue-600 mt-2">
              Collaborate and Build projects together to Solve real-world problems.
            </p>
          </div>

          {/* Column 2 - Socials */}
          <div className="flex flex-col space-y-3 md:items-end">
            <a
              href="mailto:kashbel747@gmail.com"
              className="flex items-center gap-2 text-blue-700 hover:text-blue-600 transition-colors"
            >
              <Mail size={18} /> Email us
            </a>

            <div className="flex space-x-4 mt-2">
              <a
                href="tel:+254795524137"
                className="flex items-center gap-2 text-blue-700 hover:text-blue-600 transition-colors"
              >
                <Phone size={18} />
              </a>

              <a
                href="https://www.instagram.com/_benuella"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:text-blue-600 transition-colors"
              >
                <Instagram size={20} />
              </a>
              
            </div>
          </div>
        </div>

        {/* Bottom Text */}
        <div className="border-t border-blue-200 pt-4 text-center text-sm text-blue-700">
          © {new Date().getFullYear()} Built with passion by the Stack Coders Dev Team.
        </div>
      </div>
    </footer>
  );
}
