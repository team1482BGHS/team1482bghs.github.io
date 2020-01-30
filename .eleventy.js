const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const htmlmin = require("html-minifier");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPassthroughCopy("src/css");
  // eleventyConfig.addPassthroughCopy("src/img");
  eleventyConfig.addPassthroughCopy("src/fonts");

  eleventyConfig.setDynamicPermalinks(false);

  eleventyConfig.setTemplateFormats([
    "html",
    "md",
    "liquid",
    "njk",
    "css",
    "ttf"
  ]);

  eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
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
    // pathPrefix: "/base/",
    dir: {
      input: "src",
      output: "docs", // github uses doc for their pages
      data: "_data"
    },
    passthroughFileCopy: true
  };
};