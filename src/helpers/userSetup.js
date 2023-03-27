const { parse } = require("node-html-parser");

const Image = require("@11ty/eleventy-img");
function transformImage(src, cls, alt, sizes, widths = ["500", "700", "auto"]) {
  let options = {
    widths: widths,
    formats: ["webp", "jpeg"],
    outputDir: "./dist/img/optimized",
    urlPath: "/img/optimized",
  };

  // generate images, while this is async we don’t wait
  Image(src, options);
  let metadata = Image.statsSync(src, options);
  return metadata;
}

function userMarkdownSetup(md) {
  // The md parameter stands for the markdown-it instance used throughout the site generator.
  // Feel free to add any plugin you want here instead of /.eleventy.js
}
function userEleventySetup(eleventyConfig) {
  // The eleventyConfig parameter stands for the the config instantiated in /.eleventy.js.
  // Feel free to add any plugin you want here instead of /.eleventy.js
  eleventyConfig.addTransform("table", function (str) {
    const parsed = parse(str);
    for (const t of parsed.querySelectorAll(".cm-s-obsidian > table")) {
      let inner = t.innerHTML;
      t.tagName = "div";
      t.classList.add("table-wrapper");
      t.innerHTML = `<table>${inner}</table>`;
    }
    return str && parsed.innerHTML;
  });

  eleventyConfig.addTransform("picture", function (str) {
    const parsed = parse(str);
    for (const t of parsed.querySelectorAll(".cm-s-obsidian img")) {
      if (src && src.startsWith("/") && !src.endsWith(".svg")) {
        const src = t.getAttribute("src");
        const cls = t.classList;
        const alt = t.getAttribute("alt");

        try {
          const meta = transformImage(
            "./src/site" + decodeURI(t.getAttribute("src")),
            cls.toString(),
            alt,
            ["(max-width: 480px)", "(max-width: 1024px)"]
          );

          if (meta) {
            t.tagName = "picture";
            t.innerHTML = `<source
      media="(max-width:480px)"
      srcset="${meta.webp[0].url}"
      type="image/webp"
    />
    <source
      media="(max-width:480px)"
      srcset="${meta.jpeg[0].url}"
    />
    <source
      media="(max-width:1920px)"
      srcset="${meta.webp[1].url}"
      type="image/webp"
    />
    <source
      media="(max-width:1920px)"
      srcset="${meta.jpeg[1].url}"
    />
    <img
      class="${cls.toString()}"
      src="${src}"
      alt="${alt}"
    />`;
          }
        } catch {
          // Make it fault tolarent.
        }
      }
    }
    return str && parsed.innerHTML;
  });
}
exports.userMarkdownSetup = userMarkdownSetup;
exports.userEleventySetup = userEleventySetup;
