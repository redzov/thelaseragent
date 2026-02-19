"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-black">
      <div className="text-center px-6">
        <h1 className="text-6xl font-bold text-[#5ABA47] mb-4">Oops!</h1>
        <h2 className="text-3xl font-semibold text-white mb-4">
          Something went wrong
        </h2>
        <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
          An unexpected error occurred. Please try again or contact us if the
          problem persists.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center justify-center px-7 py-2.5 text-base font-medium rounded-[20px] border-2 border-transparent bg-[#5ABA47] text-white hover:bg-[#348923] transition-all duration-200 cursor-pointer"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
