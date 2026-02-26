import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-black">
      <div className="text-center px-6">
        <h1 className="text-8xl font-bold text-[#2196F3] mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-white mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-7 py-2.5 text-base font-medium rounded-[20px] border-2 border-transparent bg-[#2196F3] text-white hover:bg-[#1976D2] transition-all duration-200"
          >
            Go Home
          </Link>
          <Link
            href="/laser-machines-for-sale"
            className="inline-flex items-center justify-center px-7 py-2.5 text-base font-medium rounded-[20px] border-2 border-[#2196F3] bg-transparent text-[#2196F3] hover:bg-[#2196F3] hover:text-white transition-all duration-200"
          >
            Browse Lasers
          </Link>
        </div>
      </div>
    </div>
  );
}
