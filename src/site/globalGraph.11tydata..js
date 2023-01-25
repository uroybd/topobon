require("dotenv").config();
const settings = require("../../helpers/constants");
const { globalGraphData } = require("../../helpers/linkUtils");

const allSettings = settings.ALL_NOTE_SETTINGS;

module.exports = {
  eleventyComputed: {
    globalGraph: (data) => globalGraphData(data),
  },
};
