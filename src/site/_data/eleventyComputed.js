const { getGraph } = require("../../helpers/linkUtils");
const { getFileTree } = require("../../helpers/filetreeUtils");
const { userComputed } = require("../../helpers/userUtils");

module.exports = {
  graph: (data) => getGraph(data),
  fileTree: (data) => getFileTree(data),
  userComputed: (data) => userComputed(data),
};
