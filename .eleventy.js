const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/img");

  eleventyConfig.setDynamicPermalinks(false);
  
  return {
    dir: {
      input: "src",
      output: "doc", // github uses doc for their pages
      data: "_data"
    },
    passthroughFileCopy: true
  }
}