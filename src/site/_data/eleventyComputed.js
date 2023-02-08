const { getGraph, forestData } = require("../../helpers/linkUtils");

module.exports = {
    graph: (data) => getGraph(data),
    forestData: (data) => forestData(data),
}