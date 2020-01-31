/*jshint esversion: 6 */

const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const htmlmin = require("html-minifier");
const yaml = require("js-yaml");

module.exports = eleventyConfig => {
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/img");
  eleventyConfig.setDynamicPermalinks(true);


  eleventyConfig.setTemplateFormats([
    "html",
    "md",
    "liquid",
    "njk",
    "css",
  ]);

  eleventyConfig.addDataExtension("yaml", contents => yaml.safeLoad(contents));

  eleventyConfig.addTransform("htmlmin", (content, outputPath) => {
    if (outputPath.endsWith(".html")) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      });
      return minified;
    }
    return content;
  });

  return {
    pathPrefix: "/docs",
    dir: {
      input: "src",
      output: "docs", // github uses doc for their pages
      data: "_data"
    },
    passthroughFileCopy: true
  };
};