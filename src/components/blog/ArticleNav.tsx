import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface ArticleNavProps {
  prev?: { slug: string; title: string } | null;
  next?: { slug: string; title: string } | null;
}

function cleanTitle(title: string): string {
  return title.replace(/ - The [Ll]aser Agent$/i, "");
}

export default function ArticleNav({ prev, next }: ArticleNavProps) {
  if (!prev && !next) return null;

  return (
    <nav aria-label="Article navigation" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Previous Article */}
      {prev ? (
        <Link
          href={`/article/${prev.slug}`}
          className="group flex items-center gap-3 p-4 rounded-lg bg-[#1a1a1a] border border-transparent hover:border-[#2196F3]/40 hover:bg-[#252525] transition-all"
        >
          <ArrowLeft className="w-5 h-5 text-[#2196F3] flex-shrink-0 transition-transform group-hover:-translate-x-1" />
          <div className="min-w-0">
            <span className="text-xs text-gray-500 uppercase tracking-wide block mb-1">
              Previous
            </span>
            <span className="text-white text-sm font-medium line-clamp-2 group-hover:text-[#2196F3] transition-colors">
              {cleanTitle(prev.title)}
            </span>
          </div>
        </Link>
      ) : (
        <div />
      )}

      {/* Next Article */}
      {next ? (
        <Link
          href={`/article/${next.slug}`}
          className="group flex items-center justify-end gap-3 p-4 rounded-lg bg-[#1a1a1a] border border-transparent hover:border-[#2196F3]/40 hover:bg-[#252525] transition-all text-right"
        >
          <div className="min-w-0">
            <span className="text-xs text-gray-500 uppercase tracking-wide block mb-1">
              Next
            </span>
            <span className="text-white text-sm font-medium line-clamp-2 group-hover:text-[#2196F3] transition-colors">
              {cleanTitle(next.title)}
            </span>
          </div>
          <ArrowRight className="w-5 h-5 text-[#2196F3] flex-shrink-0 transition-transform group-hover:translate-x-1" />
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}
