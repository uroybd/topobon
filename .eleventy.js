const slugify = require("@sindresorhus/slugify");
const markdownIt = require("markdown-it");
const fs = require("fs");
const matter = require("gray-matter");
const faviconPlugin = require("eleventy-favicon");
const tocPlugin = require("eleventy-plugin-nesting-toc");
const { parse } = require("node-html-parser");

const { headerToId, namedHeadingsFilter } = require("./src/helpers/utils");

const tagRegex = /(^|\s|\>)(#[^\s!@#$%^&*()=+\.,\[{\]};:'"?><]+)(?!([^<]*>))/g;

module.exports = function (eleventyConfig) {
  eleventyConfig.setLiquidOptions({
    dynamicPartials: true,
  });
  let markdownLib = markdownIt({
    breaks: true,
    html: true,
  })
    .use(require("markdown-it-mark"))
    .use(require("markdown-it-footnote"))
    .use(function (md) {
      md.renderer.rules.hashtag_open = function (tokens, idx) {
        return '<a class="tag" onclick="toggleTagSearch(this)">';
      };
    })
    .use(require("markdown-it-mathjax3"), {
      tex: {
        inlineMath: [["$", "$"]],
      },
      options: {
        skipHtmlTags: { "[-]": ["pre"] },
      },
    })
    .use(require("markdown-it-attrs"))
    .use(require("markdown-it-task-checkbox"), {
      disabled: true,
      divWrap: false,
      divClass: "checkbox",
      idPrefix: "cbx_",
      ulClass: "task-list",
      liClass: "task-list-item",
    })
    .use(require("markdown-it-plantuml"), {
      openMarker: "```plantuml",
      closeMarker: "```",
    })
    .use(namedHeadingsFilter)
    .use(function (md) {
      //https://github.com/DCsunset/markdown-it-mermaid-plugin
      const origFenceRule =
        md.renderer.rules.fence ||
        function (tokens, idx, options, env, self) {
          return self.renderToken(tokens, idx, options, env, self);
        };
      md.renderer.rules.fence = (tokens, idx, options, env, slf) => {
        const token = tokens[idx];
        if (token.info === "mermaid") {
          const code = token.content.trim();
          return `<pre class="mermaid">${code}</pre>`;
        }
        if (token.info === "transclusion") {
          const code = token.content.trim();
          return `<div class="transclusion">${md.render(code)}</div>`;
        }
        if (token.info.startsWith("ad-")) {
          const code = token.content.trim();
          if (code && code.toLowerCase().startsWith("title:")) {
            const title = code.substring(6, code.indexOf("\n"));
            const titleDiv = title
              ? `<div class="callout-title"><div class="callout-title-inner">${title}</div></div>`
              : "";

            return `<div class="callout" data-callout="${
              token.info
            }">${titleDiv}\n<div class="callout-content">${md.render(
              code.slice(code.indexOf("\n"))
            )}</div></div>`;
          }

          const title = `<div class="callout-title"><div class="callout-title-inner">${token.info
            .charAt(3)
            .toUpperCase()}${token.info
            .substring(4)
            .toLowerCase()}</div></div>`;

          return `<div class="callout" data-callout="${
            token.info
          }">${title}\n<div class="callout-content">${md.render(
            code
          )}</div></div>`;
        }

        // Other languages
        return origFenceRule(tokens, idx, options, env, slf);
      };

      const defaultImageRule =
        md.renderer.rules.image ||
        function (tokens, idx, options, env, self) {
          return self.renderToken(tokens, idx, options, env, self);
        };
      md.renderer.rules.image = (tokens, idx, options, env, self) => {
        const imageName = tokens[idx].content;
        const [fileName, width] = imageName.split("|");
        if (width) {
          const widthIndex = tokens[idx].attrIndex("width");
          const widthAttr = `${width}px`;
          if (widthIndex < 0) {
            tokens[idx].attrPush(["width", widthAttr]);
          } else {
            tokens[idx].attrs[widthIndex][1] = widthAttr;
          }
        }

        return defaultImageRule(tokens, idx, options, env, self);
      };

      const defaultLinkRule =
        md.renderer.rules.link_open ||
        function (tokens, idx, options, env, self) {
          return self.renderToken(tokens, idx, options, env, self);
        };
      md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
        const aIndex = tokens[idx].attrIndex("target");
        const classIndex = tokens[idx].attrIndex("class");

        if (aIndex < 0) {
          tokens[idx].attrPush(["target", "_blank"]);
        } else {
          tokens[idx].attrs[aIndex][1] = "_blank";
        }

        if (classIndex < 0) {
          tokens[idx].attrPush(["class", "external-link"]);
        } else {
          tokens[idx].attrs[classIndex][1] = "external-link";
        }

        return defaultLinkRule(tokens, idx, options, env, self);
      };
      // Footnote heading fix (till the upstream releases the fix)
      md.renderer.rules.render_footnote_anchor_name = (
        tokens,
        idx,
        options,
        env
      ) => {
        var n = Number(tokens[idx].meta.id + 1).toString();
        var prefix = "";

        if (env && typeof env.docId === "string") {
          prefix = "-" + env.docId + "-";
        }

        return prefix + n;
      };
    });

  eleventyConfig.setLibrary("md", markdownLib);

  eleventyConfig.addFilter("link", function (str) {
    return (
      str &&
      str.replace(/\[\[(.*?\|.*?)\]\]/g, function (match, p1) {
        //Check if it is an embedded excalidraw drawing or mathjax javascript
        if (p1.indexOf("],[") > -1 || p1.indexOf('"$"') > -1) {
          return match;
        }
        const [fileLink, linkTitle] = p1.split("|");

        let fileName = fileLink.replaceAll("&amp;", "&");
        let header = "";
        let headerLinkPath = "";
        if (fileLink.includes("#")) {
          [fileName, header] = fileLink.split("#");
          headerLinkPath = `#${headerToId(header)}`;
        }

        let permalink = `/notes/${slugify(fileName)}`;
        let noteIcon = process.env.NOTE_ICON_DEFAULT;
        const title = linkTitle ? linkTitle : fileName;
        let deadLink = false;

        try {
          const startPath = "./src/site/notes/";
          const fullPath = fileName.endsWith(".md")
            ? `${startPath}${fileName}`
            : `${startPath}${fileName}.md`;
          const file = fs.readFileSync(fullPath, "utf8");
          const frontMatter = matter(file);
          if (frontMatter.data.permalink) {
            permalink = frontMatter.data.permalink;
          }
          if (frontMatter.data.noteIcon) {
            noteIcon = frontMatter.data.noteIcon;
          }
        } catch {
          deadLink = true;
        }

        return `<a class="internal-link ${
          deadLink ? "is-unresolved" : ""
        }" ${deadLink ? "" : 'data-note-icon="' + noteIcon + '"'} href="${permalink}${headerLinkPath}">${title}</a>`;
      })
    );
  });

  eleventyConfig.addFilter("taggify", function (str) {
    return (
      str &&
      str.replace(tagRegex, function (match, precede, tag) {
        return `${precede}<a class="tag" onclick="toggleTagSearch(this)">${tag}</a>`;
      })
    );
  });

  eleventyConfig.addFilter("searchableTags", function (str) {
    let tags;
    let match = str && str.match(tagRegex);
    if (match) {
      tags = match
        .map((m) => {
          return `"${m.split("#")[1]}"`;
        })
        .join(", ");
    }
    if (tags) {
      return `${tags},`;
    } else {
      return "";
    }
  });

  eleventyConfig.addFilter("hideDataview", function (str) {
    return (
      str &&
      str.replace(/\(\S+\:\:(.*)\)/g, function (_, value) {
        return value.trim();
      })
    );
  });

  eleventyConfig.addTransform("callout-block", function (str) {
    const parsed = parse(str);

    const transformCalloutBlocks = (
      blockquotes = parsed.querySelectorAll("blockquote")
    ) => {
      for (const blockquote of blockquotes) {
        transformCalloutBlocks(blockquote.querySelectorAll("blockquote"));

        let content = blockquote.innerHTML;

        let titleDiv = "";
        let calloutType = "";
        let isCollapsable;
        let isCollapsed;
        const calloutMeta = /\[!(\w*)\](\+|\-){0,1}(\s?.*)/;
        if (!content.match(calloutMeta)) {
          continue;
        }

        content = content.replace(
          calloutMeta,
          function (metaInfoMatch, callout, collapse, title) {
            isCollapsable = Boolean(collapse);
            isCollapsed = collapse === "-";
            const titleText = title.replace(/(<\/{0,1}\w+>)/, "")
              ? title
              : `${callout.charAt(0).toUpperCase()}${callout
                  .substring(1)
                  .toLowerCase()}`;
            const fold = isCollapsable
              ? `<div class="callout-fold"><i icon-name="chevron-down"></i></div>`
              : ``;

            calloutType = callout;
            titleDiv = `<div class="callout-title"><div class="callout-title-inner">${titleText}</div>${fold}</div>`;
            return "";
          }
        );

        blockquote.tagName = "div";
        blockquote.classList.add("callout");
        blockquote.classList.add(isCollapsable ? "is-collapsible" : "");
        blockquote.classList.add(isCollapsed ? "is-collapsed" : "");
        blockquote.setAttribute("data-callout", calloutType.toLowerCase());
        blockquote.innerHTML = `${titleDiv}\n<div class="callout-content">${content}</div>`;
      }
    };

    transformCalloutBlocks();

    return str && parsed.innerHTML;
  });

  eleventyConfig.addPassthroughCopy("src/site/img");
  eleventyConfig.addPassthroughCopy("src/site/styles/_theme.*.css");
  eleventyConfig.addPlugin(faviconPlugin, { destination: "dist" });
  eleventyConfig.addPlugin(tocPlugin, {
    ul: true,
    tags: ["h1", "h2", "h3", "h4", "h5", "h6"],
  });
  eleventyConfig.addFilter("jsonify", function (variable) {
    return JSON.stringify(variable) || '""';
  });

  eleventyConfig.addFilter("validJson", function (variable) {
    if (Array.isArray(variable)) {
      return variable.map((x) => x.replaceAll("\\", "\\\\")).join(",");
    } else if (typeof variable === "string") {
      return variable.replaceAll("\\", "\\\\");
    }
    return variable;
  });

  return {
    dir: {
      input: "src/site",
      output: "dist",
      data: `_data`,
    },
    templateFormats: ["njk", "md", "11ty.js"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    passthroughFileCopy: true,
  };
};
