require("dotenv").config();
const settings = require("../helpers/constants");

const wikilink = /\[\[(.*?\|.*?)\]\]/g;
const internalLinkRegex = /href="\/(.*?)"/g;

const markdownIt = require("markdown-it");
const md = markdownIt({
  html: true,
}).use(require("../helpers/utils").namedHeadingsFilter);

function caselessCompare(a, b) {
  return a.toLowerCase() === b.toLowerCase();
}

const allSettings = settings.ALL_NOTE_SETTINGS;

module.exports = {
  eleventyComputed: {
    backlinks: (data) => {
      const notes = data.collections.note;
      if (!notes) {
        return [];
      }
      const currentFileSlug = data.page.filePathStem.replace("/notes/", "");
      const currentURL = data.page.url;

      let backlinks = [];
      let counter = 1;
      let uniqueLinks = new Set();

      for (const otherNote of notes) {
        const noteContent = otherNote.template.frontMatter.content;

        const outboundLinks = (noteContent.match(wikilink) || []).map((link) =>
          link
            .slice(2, -2)
            .split("|")[0]
            .replace(/.(md|markdown)\s?$/i, "")
            .replace("\\", "")
            .trim()
        );
        const embedLinks = (noteContent.match(internalLinkRegex) || []).map(
          (link) =>
            link
              .slice(6, -1)
              .split("|")[0]
              .replace(/.(md|markdown)\s?$/i, "")
              .replace("\\", "")
              .trim()
        );

        const allLinks = [...outboundLinks, ...embedLinks];

        if (
          allLinks.some(
            (link) =>
              caselessCompare(link, currentFileSlug) ||
              currentURL == link.split("#")[0]
          )
        ) {
          if (!uniqueLinks.has(otherNote.url)) {
            let preview = noteContent.slice(0, 240);
            backlinks.push({
              url: otherNote.url,
              isHome: otherNote.data["dg-home"] || false,
              title: otherNote.data.title || otherNote.data.page.fileSlug,
              preview,
              id: counter++,
            });
            uniqueLinks.add(otherNote.url);
          }
        }
      }

      return backlinks;
    },
    outbound: (data) => {
      const notes = data.collections.note;

      if (!notes || notes.length == 0) {
        return [];
      }

      const currentNote =
        data.collections.gardenEntry && data.collections.gardenEntry[0];
      if (!currentNote) {
        return [];
      }

      let counter = 1;

      const noteContent = currentNote.template.frontMatter.content;

      const outboundLinks = (noteContent.match(wikilink) || []).map((link) =>
        link
          .slice(2, -2)
          .split("|")[0]
          .replace(/.(md|markdown)\s?$/i, "")
          .replace("\\", "")
          .trim()
      );

      const embedLinks = (noteContent.match(internalLinkRegex) || []).map(
        (link) =>
          link
            .slice(6, -1)
            .split("|")[0]
            .replace(/.(md|markdown)\s?$/i, "")
            .replace("\\", "")
            .trim()
      );

      const allLinks = [...outboundLinks, ...embedLinks];

      let uniqueLinks = new Set();

      let outbound = allLinks
        .map((fileslug) => {
          var outboundNote = notes.find(
            (x) =>
              caselessCompare(
                x.data.page.filePathStem.replace("/notes/", ""),
                fileslug
              ) || x.data.page.url == fileslug.split("#")[0]
          );
          if (!outboundNote) {
            return null;
          }

          if (!uniqueLinks.has(outboundNote.url)) {
            uniqueLinks.add(outboundNote.url);
            return {
              url: outboundNote.url,
              title: outboundNote.data.title || outboundNote.data.page.fileSlug,
              isHome: outboundNote.data["dg-home"] || false,
              id: counter++,
            };
          } else {
            return null;
          }
        })
        .filter((x) => x);

      return outbound;
    },
    settings: (data) => {
      const currentnote =
        data.collections.gardenEntry && data.collections.gardenEntry[0];
      if (currentnote && currentnote.data) {
        const noteSettings = {};
        allSettings.forEach((setting) => {
          let noteSetting = currentnote.data[setting];
          let globalSetting = process.env[setting];

          let settingValue =
            noteSetting || (globalSetting === "true" && noteSetting !== false);
          noteSettings[setting] = settingValue;
        });
        return noteSettings;
      }
      return {};
    },
    noteTitle: (data) => {
      const currentnote =
        data.collections.gardenEntry && data.collections.gardenEntry[0];
      if (currentnote && currentnote.data) {
        return currentnote.data.title || currentnote.data.page.fileSlug;
      }
      return "";
    },
    content: (data) => {
      const currentnote =
        data.collections.gardenEntry && data.collections.gardenEntry[0];
      if (
        currentnote &&
        currentnote.template &&
        currentnote.template.frontMatter &&
        currentnote.template.frontMatter.content
      ) {
        return md.render(currentnote.template.frontMatter.content);
      }
      return "";
    },
  },
};
