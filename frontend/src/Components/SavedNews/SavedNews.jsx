import React from "react";
import { useNews } from "../NewsContext";
import { AiOutlineDelete } from "react-icons/ai";

const SavedNews = () => {
  const { articles, savedNews, handleDelete } = useNews();

  // const savedArticles = articles.filter(article => savedNews.includes(article.id));
  const savedArticles = savedNews;

  return (
    <div className="p-6 flex-col items-center justify-center">
      {savedArticles.length === 0 ? (
        <div className="flex justify-center items-center font-semibold text-4xl">
          No saved articles
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedArticles.map((article) => (
            <div
              key={article.id}
              className="relative p-4 border rounded-lg shadow-md bg-white"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
                <AiOutlineDelete
                  onClick={() => handleDelete(article.id)}
                  className="absolute top-2 right-2 text-red-500 cursor-pointer"
                  size={24}
                />
              </div>
              <p className="text-gray-700 mb-4">{article.description}</p>
              {article.urlToImage && (
                <img
                  src={article.urlToImage}
                  alt={article.title}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
              )}
              <p>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Read more
                </a>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedNews;
