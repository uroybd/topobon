require("dotenv").config();
const axios = require("axios");
const fs = require("fs");

async function getTheme(){
  let themeUrl = process.env.THEME;
  if (themeUrl) {
    //https://forum.obsidian.md/t/1-0-theme-migration-guide/42537
    //Not all themes with no legacy mark have a theme.css file, so we need to check for it
    try {
      await axios.get(themeUrl);
    } catch {
      if (themeUrl.indexOf("theme.css") > -1) {
        themeUrl = themeUrl.replace("theme.css", "obsidian.css");
      } else if (themeUrl.indexOf("obsidian.css") > -1) {
        themeUrl = themeUrl.replace("obsidian.css", "theme.css");
      }
    }

    const res = await axios.get(themeUrl);
    fs.writeFileSync("src/site/styles/theme.css", res.data, function (err) {
      if (err) {
        return console.log(err);
      }
      console.log("File saved");
    });
    
  }
};


getTheme();