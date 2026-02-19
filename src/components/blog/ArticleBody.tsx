interface ArticleBodyProps {
  html: string;
}

export default function ArticleBody({ html }: ArticleBodyProps) {
  // Strip wrapping <html><head></head><body> and </body></html> tags
  const cleanedHtml = html
    .replace(/^<html><head><\/head><body>/, "")
    .replace(/<\/body><\/html>$/, "");

  return (
    <div
      className="prose-dark max-w-none"
      dangerouslySetInnerHTML={{ __html: cleanedHtml }}
    />
  );
}
