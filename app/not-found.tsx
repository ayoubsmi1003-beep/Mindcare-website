import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FBF8F3] text-[#10201F]">
      <div className="text-center p-8">
        <h1 className="text-4xl font-serif font-bold mb-4">404 - Page non trouvée</h1>
        <p className="text-[#3A504D] mb-6">La page que vous recherchez n'existe pas ou a été déplacée.</p>
        <Link href="/" className="inline-block px-6 py-3 bg-[#2E4B47] text-white rounded-full font-medium hover:bg-[#1E3532] transition-colors">
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
