/** @format */

const fs = require("fs");
const NewsAPI = require("newsapi");
const newsAPIToken = process.env.NEWS_API_TOKEN;
const newsapi = new NewsAPI(newsAPIToken);
// To query /v2/top-headlines
// All options passed to topHeadlines are optional, but you need to include at least one of them
let url;
let title;

newsapi.v2
  .topHeadlines({
    source: "google-news",
    sortBy: "top",
    language: "en",
    country: "us",
  })
  .then((response) => {
    url = response.articles[0].url;
    title = response.articles[0].title;

    fs.writeFile("./databases/database.txt", `${url}\n${title}\na`, (err) => {
      // In case of a error throw err.
      if (err) throw err;
    });
  });
