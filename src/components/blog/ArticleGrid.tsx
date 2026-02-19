import { ArticleListItem } from "@/types/article";
import ArticleCard from "@/components/blog/ArticleCard";

interface ArticleGridProps {
  articles: ArticleListItem[];
}

export default function ArticleGrid({ articles }: ArticleGridProps) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400 text-lg">No articles found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {articles.map((article) => (
        <ArticleCard
          key={article.slug}
          slug={article.slug}
          title={article.title}
          excerpt={article.excerpt}
          featuredImage={article.featuredImage}
          author={article.author}
          publishedAt={article.publishedAt}
          categories={article.categories}
        />
      ))}
    </div>
  );
}
