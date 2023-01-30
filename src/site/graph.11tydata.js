const wikilink = /\[\[(.*?\|.*?)\]\]/g;
const internalLinkRegex = /href="\/(.*?)"/g;

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
      return JSON.stringify({
        nodes,
        links,
      });
    },
  },
};
