function findTrail(tree, permalink, trail) {
  for (const [name, node] of Object.entries(tree || {})) {
    if (!node || typeof node !== "object") {
      continue;
    }

    if (node.isNote) {
      if (node.permalink === permalink) {
        return trail;
      }

      continue;
    }

    if (node.isFolder) {
      const found = findTrail(node, permalink, [...trail, name]);

      if (found) {
        return found;
      }
    }
  }

  return null;
}

module.exports = {
  setupEleventy(eleventyConfig) {
    // The folder names leading to the note with this permalink, from the
    // core filetree data (which already honors dg-path and rewrite rules).
    eleventyConfig.addFilter("gpBreadcrumbs", function (filetree, permalink) {
      return findTrail(filetree, permalink, []) || [];
    });
  },
};
