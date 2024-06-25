import React from "react";
import { useNews } from "../NewsContext";
import { AiOutlineSave } from "react-icons/ai";
import Footer from "../Footer/Footer";


const Home = () => {
  const {
    articles,
    loading,
    country,
    handleCountryChange,
    searchQuery,
    handleSave,
  } = useNews();
  const date = new Date();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const filteredArticles = articles.filter((article) =>
    article.source.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedArticles = filteredArticles.reduce((acc, article) => {
    const source = article.source.name;
    if (!acc[source]) {
      acc[source] = [];
    }
    acc[source].push(article);
    return acc;
  }, {});

  if (loading) {
    return <div className="flex justify-center items-center">Loading...</div>;
  }

  return (
    <>
      <div className="p-6 flex-col items-center justify-center">
        <hr className="w-full h-4 mt-1" />
        <div className="flex justify-between items-center mb-6">
          <span>
            {day}/{month}/{year}
          </span>
          <h1 className="text-4xl font-bold flex items-center justify-center md:flex md:items-center md:justify-center">
            Today&apos;s Popular News Headlines
          </h1>
          <select
            value={country}
            onChange={handleCountryChange}
            className="p-2 border rounded-md"
          >
            <option value="in">India</option>
            <option value="us">USA</option>
          </select>
        </div>
        <hr className="w-full h-1 mt-1" />
        {Object.keys(groupedArticles).map((source, index) => (
          <div
            key={index}
            className="mt-4 mb-8 flex flex-col items-center justify-center"
          >
            <h1 className="text-2xl font-bold mb-4 flex items-center justify-center">
              {source}
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupedArticles[source].map((article) => (
                <div
                  key={article.id}
                  className="relative p-4 border rounded-lg shadow-md bg-white"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold mb-2">
                      {article.title}
                    </h3>
                  </div>
                  <AiOutlineSave
                    className="absolute top-2 right-1 text-green-500 cursor-pointer"
                    onClick={() =>
                      handleSave(
                        article.id,
                        article.title,
                        article.description,
                        article.urlToImage,
                        article.url
                      )
                    }
                    size={24}
                  />
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
          </div>
        ))}
      </div>
      <Footer />
    </>
  );
};

export default Home;
