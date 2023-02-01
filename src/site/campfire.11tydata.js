const { extractLinks } = require("../helpers/linkUtils");

module.exports = {
  eleventyComputed: {
    manifest: (data) => {
      const output = {
        version: "1.0.0",
        last_updated: new Date().toISOString(),
        content_root:
          "https://raw.githubusercontent.com/uroybd/topobon/main/src/site/notes",
        published_root: data.meta.siteBaseUrl,
        notes: data.collections.note.map((v, idx) => {
          let content_url = v.filePathStem.replace("/notes", "") + ".md";
          return {
            title: v.data.title || v.fileSlug,
            published_url: v.url,
            content_url,
            aliases: [],
            last_updated: v.data.updated,
          };
        }),
      };
      return JSON.stringify(output);
    },
  },
};
