---
{"title":"Boox to Obsidian: Rich Annotation Export from Boox Cloud","aliases":["Boox to Obsidian: Rich Annotation Export from Boox Cloud"],"created":"2025-03-27T12:13:35+06:00","updated":"2025-03-27T12:47:45+06:00","location":"Dhaka","dg-publish":true,"dg-note-icon":"chest","dg-path":"Writings/Technical/HowTos/Boox to Obsidian_ Rich Annotation Export from Boox Cloud.md","permalink":"/writings/technical/how-tos/boox-to-obsidian-rich-annotation-export-from-boox-cloud/","dgPassFrontmatter":true,"noteIcon":"chest"}
---

[Many like me](https://christiantietze.de/posts/2023/05/boox-neoreader-annotation-export-is-meh/), have already noticed that annotations exported as text or HTML from Boox devices are inadequate at best. They lack context. Previously, I tried to make situation better by [[Personal/Writings/Technical/HowTos/Boox to Obsidian_ Highlights and Annotations\|adding some context in the notes]]. It works, but it is very cumbersome to handle.

**But, I found a better way.**

First, lets get the data from Boox Cloud as JSON. These JSON files will contain rich context. To do that we will use [Tampermonkey](https://www.tampermonkey.net/)

First, install the plugin in your browser and add the following script:

```js

// ==UserScript==
// @name         Boox Annotations
// @namespace    http://tampermonkey.net/
// @version      2025-02-26
// @description  export Boox annotations as JSON
// @author       Utsob Roy
// @include        https://push.boox.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mozilla.org
// @grant GM.registerMenuCommand
// ==/UserScript==

(function() {
    'use strict';

   async function getDBSpec() {
  const databases = await window.indexedDB.databases();
  return databases.find(db => db.name.startsWith("_pouch") && db.name.endsWith("-library"))
}


function loadFromIndexedDB(storeName){
  return new Promise(
    function(resolve, reject) {
      var dbRequest = indexedDB.open(storeName);

      dbRequest.onerror = function(event) {
        reject(Error("Error text"));
      };

      dbRequest.onupgradeneeded = function(event) {
        // Objectstore does not exist. Nothing to load
        event.target.transaction.abort();
        reject(Error('Not found'));
      };

      dbRequest.onsuccess = function(event) {
        var content = [];
        var database = event.target.result;
        database.transaction("by-sequence").objectStore("by-sequence").openCursor().onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            content.push(cursor.value);
            cursor.continue();
          } else {
            console.log("No more entries!");
            resolve(content);
          }
        };
      };
    }
  );
}

async function getContent() {
  const db = await getDBSpec();
  const content = await loadFromIndexedDB(db.name);
  return content
}

var bookCommands = [];
var content = [];

function selectBook(content) {
  let books = content.filter((item) => item.progress != undefined && item.title != undefined && item.title != null)
  books = books.filter((item, index) => {
      return books.findIndex((otherItem) => otherItem.uniqueId == item.uniqueId && otherItem.updatedAt > item.updatedAt) == -1
  })
  // Create a modal with the list of books:
  const modal = document.createElement("div");
    // Position it to center
    modal.style.position = "fixed"
    modal.style.top = "50%"
    modal.style.left = "50%"
    modal.style.transform = "translate(-50%, -50%)"
    modal.style.padding = "20px"
    modal.style.backgroundColor = "white"
    modal.style.zIndex = "9999"
    modal.style.border = "1px solid black"
    modal.style.borderRadius = "10px"

    // Add a title
    const title = document.createElement("h3")
    title.textContent = "Select a book"
    modal.appendChild(title)

    // Add the list of books
    const list = document.createElement("ul")
    // Style it without bullets
    list.style.listStyle = "none"
    books.forEach((book) => {
      const btn = document.createElement("li")
      btn.textContent = book.title
      btn.addEventListener("click", () => {
        document.body.removeChild(modal)
        const ann = getAnnotations(book)
        download(ann)
      })
      // Style it like buttons
      btn.style.cursor = "pointer"
      btn.style.border = "1px solid green"
      btn.style.borderRadius = "10px"
      btn.style.padding = "10px"
      btn.style.marginBottom = "10px"
      list.appendChild(btn)
    })
    modal.appendChild(list)
    document.body.appendChild(modal)
    // Add a close button
    const close = document.createElement("button")
    close.textContent = "Close"
    modal.appendChild(close)
    close.addEventListener("click", () => {
      document.body.removeChild(modal)
    })
}

function integerToColorHex(num) {
num >>>= 0;
    var b = num & 0xFF,
        g = (num & 0xFF00) >>> 8,
        r = (num & 0xFF0000) >>> 16
  return "#" + ("00" + r.toString(16)).substr(-2) + ("00" + g.toString(16)).substr(-2) + ("00" + b.toString(16)).substr(-2);
}

function getAnnotations(book) {
  let annotations = content.filter((item) => item.documentId == book.uniqueId && item.status == 0 && item.pageNumber != undefined && item.color != undefined)
  annotations.sort((a, b) => {
      const pageDiff = a.pageNumber - b.pageNumber
      if (pageDiff == 0) {
          return a.createdAt - b.createdAt
      }
      return pageDiff
  })
  // Remove duplicate entries from annotiations. First, match by uniqueId, then keep the one with the highest updatedA
  annotations = annotations.filter((item, index) => {
      return annotations.findIndex((otherItem) => otherItem.uniqueId == item.uniqueId && otherItem.updatedAt > item.updatedAt) == -1
  })

  const rdata = {
    title: book.title,
    authors: book.authors,
    format: book.type,
    pageNumber: parseInt(book.progress.split("/")[1]),
    annotations: annotations.map((item) => {
      return {
        quote: item.quote,
        note: item.note,
        pageNumber: item.pageNumber,
        chapter: item.chapter,
        createdAt: item.createdAt,
        color: integerToColorHex(item.color)
      }
    })
  }
  return rdata
}

const formatedTimestamp = ()=> {
  const d = new Date()
  const date = d.toISOString().split('T')[0];
  const time = d.toTimeString().split(' ')[0].replace(/:/g, '-');
  return `${date}-${time}`
}

function download(annotations) {
  // Create blob and download
  const blob = new Blob([JSON.stringify(annotations, null, 4)], { type: "application/json" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = formatedTimestamp(new Date()) + "-annotations.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  console.log(annotations)
}

GM.registerMenuCommand("Download Book's Annotations", async (event) => {
  content = await getContent()
  selectBook(content)
});
})();
```

So, what are we doing here? We are registering a command. Buy clicking on that menu command, you will be presented with a list of book, click any of them, and the annotations will be downloaded as JSON. We are not violating any security or law. The data is already present in the browser, and essentially your data.

Once you got it exported as JSON, you will get something like this:

```json
{
    "title": "House Of Leaves",
    "authors": "Mark Z. Danielewski",
    "format": "pdf",
    "pageNumber": 740,
    "annotations": [
        {
            "quote": "As I discovered, there were reams and reams of \nit. Endless snarls of words, sonetines twisting into \nmeaning, sometimes into nothing at all, frequently \nbreaking apart, always branching off into other pieces \nI'd come across later-on old napkins, the tattered \nedges of an envelope, once even on the back of a \npostage stamp; everything and anything but empty; each \nfragment completely covered with the creep of years \nand years of ink pronouncements; layered, crossed out,\namended; handwritten, typed; legible, illegible;\nimpenetrable, lucid; torn, stained, scotch taped; some \nbits crisp and clean, others faded, burnt or folded \nand refolded so many times the creases have \nobliterated whole passages of god knows what-sense?\ntruth? deceit? a legacy of prophecy or lunacy or \nnothing of the kind?, and in the end achieving,\ndesignating, describing, recreating-find your own \nwords; I have no more; or plenty more but why? and all \nto tellwhat?",
            "note": "",
            "pageNumber": 19,
            "chapter": "Introduction ",
            "createdAt": 1740509505032,
            "color": "#ee00ff"
        },
        {
            "quote": "Zampanò, I've come to recognize now, was a very \nfunny man. But his humor was that wry, desiccated \nkind soldiers whisper, all their jokes subsurface,\ntheir laughter amounting to little more than a tic in \nthe corner of the mouth, told as they wait together in \ntheir outpost, slowly realizing that help's not going \nto reach them in time and come nightfall, no matter \nwhat they've done or what they try to say, slaughter \nwill overrun them all. Carrion dawn for vultures",
            "note": "",
            "pageNumber": 22,
            "chapter": "Introduction ",
            "createdAt": 1740760531837,
            "color": "#ee00ff"
        },
        {
            "quote": "\"Irony? Irony can never be more than our own \npersonal Maginot Line; the drawing of it, for the most \npart, purely arbitrary.\"",
            "note": "",
            "pageNumber": 22,
            "chapter": "Introduction ",
            "createdAt": 1740760623457,
            "color": "#ee00ff"
        },
        {
            "quote": "Zampanò writes constantly about seeing. What we \nsee, how we see and what in turn we can't see. Over \nand over again, in one form or another, he returns to \nthe subject of light, space, shape, line, color,\nfocus, tone, contrast, movement , rhythm, perspective \nand composition. None of which is surprising \nconsidering Zampanò's piece centers on a documentary \nfilm called The Navidson Record made by a Pulitzer \nPrize-winning photojournalist who must somehow capture \nthe most difficult subject of all: the sight of \ndarkness itself.",
            "note": "",
            "pageNumber": 23,
            "chapter": "Introduction ",
            "createdAt": 1740760696601,
            "color": "#00b036"
        }
    ]
}
```

You can transform it anyway you want (if you know how to code)! Here I am formatting to Markdown using [Templater](https://silentvoid13.github.io/Templater/). Here's the template I'm using:

```js
<%*
const NOTE_STYLES = {
  lemon: {
	type: "quote",
	title: "Quotable/Concept/General Idea",
  },
  blue: {
	type: "important",
	title: "Striking/Intense",
  },
  red: {
	type: "danger",
	title: "In Discord",
  },
  green: {
	type: "question",
	title: "Thought Provoking",
  },
  chartreuse: {
    type: "sceptic",
    title: "Sceptic"
  },
  orange: {
    type: "warning",
    title: "Unsound"
  },
  violet: {
    type: "stylish",
    title: "Stylish"
  }
};

const COLOR_DICT = {
  "#000000": "black",
  "#404040": "dark-grey",
  "#808080": "grey",
  "#c0c0c0": "light-grey",
  "#ffffff": "white",
  "#ffc1c3": "red",
  "#00b036": "green",
  "#000084": "blue",
  "#00f0ff": "aqua",
  "#ee00ff": "violet",
  "#ffaa00": "orange",
  "#f0ff00": "lemon",
  "#008000": "chartreuse",
  "#9338be": "grape",
  "#00aaff": "sky-blue",
  "#ff4400": "orange-red"
}

function get_note_style(note) {
    const colorName = COLOR_DICT[note.color]
    if (colorName == undefined) {
        return NOTE_STYLES["lemon"]
    }
    const style = NOTE_STYLES[colorName]
    if (style == undefined) {
        return NOTE_STYLES["lemon"]
    }
    return style
}

function format_percentages(page, total) {
	if (page && total) {
		return `${((page / total) * 100).toFixed(2)}%`;
	}
	return "";
}

function format_quote(text, keepBreak) {
    if (!keepBreak) {
        return text.replaceAll(/\n\n/g, '__temp__').replaceAll(/\n/g, ' ').replaceAll('__temp__', '\n');
    }
    return text
}

async function format_json_highlights(content) {
	const data = JSON.parse(content);
    let keepBreak = false
	if (data.format == "pdf") {
    	keepBreak = await tp.system.suggester(["No", "Yes"], [false, true], false, "Keep line break?")
	}
    console.log("keepBreak: ", keepBreak)
    let output = `---\ntitle: "${data.title}"\naliases: ["Notes from ${data.title}"]\nauthor: "${data.authors}"\n---\n# ${data.title}\n##### ${data.author}`;

	let current_chapter = "";
	for (const entry of data.annotations) {
	  if (entry.quote) {
		if (entry.chapter != current_chapter) {
		  output += `\n\n## ${entry.chapter}\n`;
		  current_chapter = entry.chapter;
		}
		output += `\n### Page: ${
		  entry.pageNumber
		} (${format_percentages(
		  entry.pageNumber,
		  data.pageNumber
		)}) @ ${window.moment(entry.createdAt).format("DD MMM YYYY hh:mm:ss A")}\n`;
		output += `\n${format_quote(entry.quote, keepBreak)}`;
		const note_type = get_note_style(entry);
		output += `\n\n> [!${note_type.type}] ${note_type.title}`;
		if (entry.note) {
		  if (entry.note.length > 50) {
			output += `\n> ${entry.note.replaceAll("\n", "\n> ")}`;
		  } else {
			output += `: ${entry.note}`;
		  }
		  output += "\n";
		}
		output += "\n";
	  }
	}
	return output;
}

const content = await tp.system.prompt("Paste the JSON content", null, true, true);
const output = await format_json_highlights(content);
let file = app.workspace.getActiveFile();
await app.vault.modify(file, output);
%>
```

Upon running this, the template will prompt you for the JSON, copy-paste it here. Then It may ask for pdfs if you want to keep the linebreaks. Here's the output:

```
---
title: "House Of Leaves"
aliases: ["Notes from House Of Leaves"]
author: "Mark Z. Danielewski"
created: 2025-03-25T20:08:37+06:00
updated: 2025-03-25T20:14:58+06:00
---
# House Of Leaves
##### Mark Z. Danielewski

## Introduction

### Page: 19 (2.57%) @ 26 Feb 2025 12:51:45 AM

As I discovered, there were reams and reams of it. Endless snarls of words, sonetines twisting into meaning, sometimes into nothing at all, frequently breaking apart, always branching off into other pieces I'd come across later-on old napkins, the tattered edges of an envelope, once even on the back of a postage stamp; everything and anything but empty; each fragment completely covered with the creep of years and years of ink pronouncements; layered, crossed out, amended; handwritten, typed; legible, illegible; impenetrable, lucid; torn, stained, scotch taped; some bits crisp and clean, others faded, burnt or folded and refolded so many times the creases have obliterated whole passages of god knows what-sense? truth? deceit? a legacy of prophecy or lunacy or nothing of the kind?, and in the end achieving, designating, describing, recreating-find your own words; I have no more; or plenty more but why? and all to tellwhat?

> [!stylish] Stylish

### Page: 22 (2.97%) @ 28 Feb 2025 10:35:31 PM

Zampanò, I've come to recognize now, was a very funny man. But his humor was that wry, desiccated kind soldiers whisper, all their jokes subsurface, their laughter amounting to little more than a tic in the corner of the mouth, told as they wait together in their outpost, slowly realizing that help's not going to reach them in time and come nightfall, no matter what they've done or what they try to say, slaughter will overrun them all. Carrion dawn for vultures

> [!stylish] Stylish

### Page: 22 (2.97%) @ 28 Feb 2025 10:37:03 PM

"Irony? Irony can never be more than our own personal Maginot Line; the drawing of it, for the most part, purely arbitrary."

> [!stylish] Stylish

### Page: 23 (3.11%) @ 28 Feb 2025 10:38:16 PM

Zampanò writes constantly about seeing. What we see, how we see and what in turn we can't see. Over and over again, in one form or another, he returns to the subject of light, space, shape, line, color, focus, tone, contrast, movement , rhythm, perspective and composition. None of which is surprising considering Zampanò's piece centers on a documentary film called The Navidson Record made by a Pulitzer Prize-winning photojournalist who must somehow capture the most difficult subject of all: the sight of darkness itself.

> [!question] Thought Provoking
```

This, if rendered, will look this:

---
# House Of Leaves
##### Mark Z. Danielewski

## Introduction

### Page: 19 (2.57%) @ 26 Feb 2025 12:51:45 AM

As I discovered, there were reams and reams of it. Endless snarls of words, sonetines twisting into meaning, sometimes into nothing at all, frequently breaking apart, always branching off into other pieces I'd come across later-on old napkins, the tattered edges of an envelope, once even on the back of a postage stamp; everything and anything but empty; each fragment completely covered with the creep of years and years of ink pronouncements; layered, crossed out, amended; handwritten, typed; legible, illegible; impenetrable, lucid; torn, stained, scotch taped; some bits crisp and clean, others faded, burnt or folded and refolded so many times the creases have obliterated whole passages of god knows what-sense? truth? deceit? a legacy of prophecy or lunacy or nothing of the kind?, and in the end achieving, designating, describing, recreating-find your own words; I have no more; or plenty more but why? and all to tellwhat?

> [!stylish] Stylish

### Page: 22 (2.97%) @ 28 Feb 2025 10:35:31 PM

Zampanò, I've come to recognize now, was a very funny man. But his humor was that wry, desiccated kind soldiers whisper, all their jokes subsurface, their laughter amounting to little more than a tic in the corner of the mouth, told as they wait together in their outpost, slowly realizing that help's not going to reach them in time and come nightfall, no matter what they've done or what they try to say, slaughter will overrun them all. Carrion dawn for vultures

> [!stylish] Stylish

### Page: 22 (2.97%) @ 28 Feb 2025 10:37:03 PM

"Irony? Irony can never be more than our own personal Maginot Line; the drawing of it, for the most part, purely arbitrary."

> [!stylish] Stylish

### Page: 23 (3.11%) @ 28 Feb 2025 10:38:16 PM

Zampanò writes constantly about seeing. What we see, how we see and what in turn we can't see. Over and over again, in one form or another, he returns to the subject of light, space, shape, line, color, focus, tone, contrast, movement , rhythm, perspective and composition. None of which is surprising considering Zampanò's piece centers on a documentary film called The Navidson Record made by a Pulitzer Prize-winning photojournalist who must somehow capture the most difficult subject of all: the sight of darkness itself.

> [!question] Thought Provoking