import React, { useEffect, useState } from "react";
import { copy, linkIcon, loader, tick } from "../assets";
import { useLazyGetSummaryQuery } from "../sevices/article";

const Demo = () => {
  const [articles, setArticles] = useState({
    url: "",
    summary: "",
  });

  const [allArticles, setAllArticles] = useState([]);
  const [copied, setCopied] = useState("");

  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

  useEffect(() => {
    const articlesFromLocalStorage = JSON.parse(
      localStorage.getItem("articles")
    );

    if (articlesFromLocalStorage) {
      setAllArticles(articlesFromLocalStorage);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data } = await getSummary({ articleUrl: articles.url });

    if (data?.summary) {
      const newArticle = { ...articles, summary: data.summary };
      setArticles(newArticle);

      const updatedAllArticles = [newArticle, ...allArticles];
      setAllArticles(updatedAllArticles);

      localStorage.setItem("articles", JSON.stringify(updatedAllArticles));

      setArticles((prev) => ({
        ...prev,
        url: "",
      }));

    }
  };

  const handleCopy = (url) => {
    setCopied(url);
    navigator.clipboard.writeText(url);
    navigator?.vibrate(100);

    setTimeout(() => {
      setCopied(false);
    }, 5000);
  };

  return (
    <>
      {/* Main Section */}
      <section className="mt-16 w-full max-w-xl">
        <div className="flex flex-col w-full gap-2">
          <form
            className="relative flex justify-center items-center"
            onSubmit={handleSubmit}
          >
            <img
              src={linkIcon}
              alt="link_icon"
              className="absolute left-0 my-2 ml-3 w-5"
            />

            <input
              type="url"
              placeholder="Enter a URL"
              value={articles.url}
              onChange={(e) =>
                setArticles({
                  ...articles,
                  url: e.target.value,
                })
              }
              required
              className="url_input peer"
            />

            <button
              type="submit"
              className="submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700"
            >
              <p>↵</p>
            </button>
          </form>

          {/* URL History */}
          <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
            {allArticles.map((item, index) => (
              <div
                key={`link-${index}`}
                onClick={() => setArticles(item)}
                className="link_card"
              >
                <div className="copy_btn" onClick={() => handleCopy(item.url)}>
                  <img
                    src={copied === item.url ? tick : copy}
                    alt="copy_icon"
                    className="w-[40%] h-[40%] object-contain"
                  />
                </div>
                <p className="flex-1 text-blue-500 font-medium text-sm truncate">
                  {item.url}
                </p>
              </div>
            ))}
          </div>
        </div>
        {/* Results Display */}
        <div className="my-10 max-w-full flex justify-center items-center">
          {isFetching ? (
            <img
              src={loader}
              alt="loader"
              className="w-20 h-20 object-contain"
            />
          ) : error ? (
            <p className="font-bold text-black text-center">
              Well, that wasn't supposed to happen...
              <br />
              <span className="font-normal text-gray-700">
                {error?.data?.error}
              </span>
            </p>
          ) : (
            articles.summary && (
              <div className="flex flex-col gap-3">
                <h2 className="orange_gradient font-bold text-[1.25rem]">
                  Article <span className="font-bold">Summary</span>
                </h2>
                <div className="summary_box">
                  <p className="font-medium text-sm text-gray-700 leading-[2]">
                    {articles.summary}
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </section>

      {/* footer */}
      <footer className="footer">
        <p className="orange_gradient text-center text-sm text-black font-bold pt-4 pb-4">
          Made by Shaikh Muhammad Ibrahim •{" "}
          <span>{new Date().getFullYear()}</span>
        </p>
      </footer>
    </>
  );
};

export default Demo;
