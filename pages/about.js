import Link from "next/link";
import { FaInstagram, FaXTwitter, FaFacebook, FaTiktok } from "react-icons/fa6";
import Header from "../components/ui/header";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-12 text-center">

        <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Numerus</h1>

        <p className="text-lg text-gray-600 mb-6">
          A reverse trivia game that celebrates the magic, mystery, and meaning behind numbers.
        </p>

        <blockquote className="italic text-gray-500 mb-10">
          “Numbers rule the universe.” — Pythagoras
        </blockquote>

        <section className="text-left mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">The Story</h2>
          <p className="text-gray-600 leading-relaxed">
            Numerus was born from a fascination with the hidden stories behind the numbers that shape our world — 
            from the scientific constants we rely on to the quirky digits in pop culture and sport. 
            Every puzzle is a chance to guess what a number means, with clues to lead the way.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Follow Us</h2>
<div className="flex justify-center space-x-4 mt-4 text-2xl text-[#3B82F6]">
  <a href="https://instagram.com/YOUR_USERNAME" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
    <FaInstagram />
  </a>
  <a href="https://x.com/YOUR_USERNAME" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
    <FaXTwitter />
  </a>
  <a href="https://facebook.com/YOUR_USERNAME" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
    <FaFacebook />
  </a>
  <a href="https://tiktok.com/@YOUR_USERNAME" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
    <FaTiktok />
  </a>
</div>
        </section>

        <Link href="/game">
          <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Start Playing
          </button>
        </Link>

      </main>
    </>
  );
}
