const { getGraph } = require("../../helpers/linkUtils");
const { forestData } = require("../../helpers/userUtils");

module.exports = {
  graph: (data) => getGraph(data),
  forestData: (data) => forestData(data),
};
