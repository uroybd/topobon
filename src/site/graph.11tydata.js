const wikilink = /\[\[(.*?\|.*?)\]\]/g;
const internalLinkRegex = /href="\/(.*?)"/g;

function caselessCompare(a, b) {
  return a.toLowerCase() === b.toLowerCase();
}

function extractLinks(content) {
  return [
    ...(content.match(wikilink) || []).map(
      (link) =>
        link
          .slice(2, -2)
          .split("|")[0]
          .replace(/.(md|markdown)\s?$/i, "")
          .replace("\\", "")
          .trim()
          .split("#")[0]
    ),
    ...(content.match(internalLinkRegex) || []).map(
      (link) =>
        link
          .slice(6, -1)
          .split("|")[0]
          .replace(/.(md|markdown)\s?$/i, "")
          .replace("\\", "")
          .trim()
          .split("#")[0]
    ),
  ];
}

function getBacklinks(data) {
  const notes = data.collections.note;
  if (!notes) {
    return [];
  }
  const currentFileSlug = data.page.filePathStem
    .replace("/notes/", "")
    .split("#")[0];
  const currentURL = data.page.url;

  let backlinks = [];
  let uniqueLinks = new Set();
  let counter = 1;

  for (const otherNote of notes) {
    const noteContent = otherNote.template.frontMatter.content;
    const backLinks = extractLinks(noteContent);

    if (
      !uniqueLinks.has(otherNote.url) &&
      backLinks.some(
        (link) =>
          caselessCompare(link, currentFileSlug) ||
          currentURL == link.split("#")[0]
      )
    ) {
      let preview = noteContent.slice(0, 240);
      backlinks.push({
        url: otherNote.url,
        title: otherNote.data.title || otherNote.data.page.fileSlug,
        preview,
        id: counter++,
        isHome: otherNote.data["dg-home"] || false,
      });
      uniqueLinks.add(otherNote.url);
    }
  }
  return backlinks;
}

function getOutboundLinks(data, isHome = false) {
  const notes = data.collections.note;

  if (!notes || notes.length == 0) {
    return [];
  }

  let currentNote;
  if (isHome) {
    currentNote =
      data.collections.gardenEntry && data.collections.gardenEntry[0];
  } else {
    const currentFileSlug = data.page.filePathStem.replace("/notes/", "");
    currentNote = notes.find(
      (x) =>
        x.data.page.filePathStem &&
        caselessCompare(
          x.data.page.filePathStem.replace("/notes/", ""),
          currentFileSlug
        )
    );
  }

  if (!currentNote) {
    return [];
  }

  let counter = 1;
  let uniqueLinks = new Set();

  const outboundLinks = extractLinks(currentNote.template.frontMatter.content);
  let outbound = outboundLinks
    .map((fileSlug) => {
      var outboundNote = notes.find((x) => {
        fileSlug = fileSlug.split("#")[0];
        return (
          caselessCompare(
            x.data.page.filePathStem.replace("/notes/", ""),
            fileSlug
          ) || x.data.page.url == fileSlug
        );
      });
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
}

module.exports = {
  eleventyComputed: {
    graphData: (data) => {
      let nodes = {};
      let links = [];
      let stemURLs = {};
      data.collections.note.forEach((v, idx) => {
        nodes[v.url] = {
          id: idx,
          title: v.data.title || v.fileSlug,
          url: v.url,
          home: v.data["dg-home"] || false,
          outBound: extractLinks(v.template.frontMatter.content),
          neighbors: new Set(),
        };
        stemURLs[v.filePathStem.replace("/notes/", "")] = v.url;
      });
      Object.values(nodes).forEach((node) => {
        node.outBound.forEach((olink) => {
          let link = (stemURLs[olink] || olink).split("#")[0];
          console.log(link);
          let n = nodes[link];
          if (n) {
            n.neighbors.add(node.url);
            node.neighbors.add(n.url);
            links.push({ source: node.id, target: n.id });
          }
        });
      });
      Object.keys(nodes).map((k) => {
        nodes[k].neighbors = Array.from(nodes[k].neighbors);
        nodes[k].size = nodes[k].neighbors.length;
      });
      return JSON.stringify(
        {
          nodes,
          links,
        },
        null,
        "\t"
      );
    },
  },
};
