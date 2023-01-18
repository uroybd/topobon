const wikilink = /\[\[(.*?\|.*?)\]\]/g;
const internalLinkRegex = /href="\/(.*?)"/g;

function caselessCompare(a, b) {
  return a.toLowerCase() === b.toLowerCase();
}

function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

function sliceIntoChunks(arr, chunkSize) {
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
}

function getPositions(trees) {
  let minInRow = Math.floor(Math.sqrt(trees.length));
  let maxInRow = Math.ceil(Math.sqrt(trees.length));
  if (minInRow < maxInRow) {
    trees = trees.concat(
      Array(Math.pow(maxInRow, 2) - trees.length).fill([0, "", ""])
    );
  }
  trees = shuffle([...trees]);
  let levels = sliceIntoChunks(trees, maxInRow);
  return levels;
}

function forestData(data) {
  const canvasTrees = data.collections.note.map((n) => {
    return [n.data.maturity || 1, n.url, n.data.title || n.fileSlug];
  });
  return getPositions(canvasTrees);
}

function extractLinks(content) {
  return [
    ...(content.match(wikilink) || []).map((link) =>
      link
        .slice(2, -2)
        .split("|")[0]
        .replace(/.(md|markdown)\s?$/i, "")
        .replace("\\", "")
        .trim()
    ),
    ...(content.match(internalLinkRegex) || []).map((link) =>
      link
        .slice(6, -1)
        .split("|")[0]
        .replace(/.(md|markdown)\s?$/i, "")
        .replace("\\", "")
        .trim()
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

exports.wikilink = wikilink;
exports.internalLinkRegex = internalLinkRegex;
exports.getBacklinks = getBacklinks;
exports.getOutboundLinks = getOutboundLinks;
exports.caselessCompare = caselessCompare;
exports.extractLinks = extractLinks;
exports.forestData = forestData;
