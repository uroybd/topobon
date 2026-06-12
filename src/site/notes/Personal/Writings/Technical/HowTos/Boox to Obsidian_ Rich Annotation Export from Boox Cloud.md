---
{"title":"Boox to Obsidian: Rich Annotation Export from Boox Cloud","aliases":["Boox to Obsidian: Rich Annotation Export from Boox Cloud"],"created":"2025-03-27T12:13:35+06:00","updated":"2026-06-12T20:33:37+06:00","location":"Dhaka","dg-publish":true,"dg-note-icon":"chest","dg-path":"Writings/Technical/HowTos/Boox to Obsidian_ Rich Annotation Export from Boox Cloud.md","permalink":"/writings/technical/how-tos/boox-to-obsidian-rich-annotation-export-from-boox-cloud/","dgPassFrontmatter":true,"noteIcon":"chest","dg-note-properties":{"title":"Boox to Obsidian: Rich Annotation Export from Boox Cloud","aliases":["Boox to Obsidian: Rich Annotation Export from Boox Cloud"],"created":"2025-03-27T12:13:35+06:00","updated":"2026-06-12T20:33:37+06:00","location":"Dhaka"}}
---

[Many like me](https://christiantietze.de/posts/2023/05/boox-neoreader-annotation-export-is-meh/), have already noticed that annotations exported as text or HTML from Boox devices are inadequate at best. They lack context. Previously, I tried to make the situation better by [[Personal/Writings/Technical/HowTos/Boox to Obsidian_ Highlights and Annotations\|adding some context in the notes]]. It works, but it is very cumbersome to handle.

**But I found a better way.**

First, download **Boox Rich Annotations** app from the latest release page:

[![uroybd/BooxRichAnnotations - GitHub](https://gh-card.dev/repos/uroybd/BooxRichAnnotations.svg)](https://github.com/uroybd/BooxRichAnnotations/releases/latest)

Once you download, install, and open it, you will be presented with a screen like this, where you can see all the books of `epub`, `mobi` and `azw` format in a list:

![Media/main_page.png](/img/user/Media/main_page.png)

Choose the book you want to export highlights from, and tap `Download as JSON` to download the annotations. It will be saved in your downloads folder and **doesn't require an active internet connection**.

![Media/download_page.png](/img/user/Media/download_page.png)

Once you have it downloaded as JSON, you will get something like this, where fields like highlight style and colours are present:

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
            "style": "underline",
            "color": "#ee00ff"
        },
        {
            "quote": "Zampanò, I've come to recognize now, was a very \nfunny man. But his humor was that wry, desiccated \nkind soldiers whisper, all their jokes subsurface,\ntheir laughter amounting to little more than a tic in \nthe corner of the mouth, told as they wait together in \ntheir outpost, slowly realizing that help's not going \nto reach them in time and come nightfall, no matter \nwhat they've done or what they try to say, slaughter \nwill overrun them all. Carrion dawn for vultures",
            "note": "",
            "pageNumber": 22,
            "chapter": "Introduction ",
            "createdAt": 1740760531837,
            "style": "underline",
            "color": "#ee00ff"
        },
        {
            "quote": "\"Irony? Irony can never be more than our own \npersonal Maginot Line; the drawing of it, for the most \npart, purely arbitrary.\"",
            "note": "",
            "pageNumber": 22,
            "chapter": "Introduction ",
            "createdAt": 1740760623457,
            "style": "underline",
            "color": "#ee00ff"
        },
        {
            "quote": "Zampanò writes constantly about seeing. What we \nsee, how we see and what in turn we can't see. Over \nand over again, in one form or another, he returns to \nthe subject of light, space, shape, line, color,\nfocus, tone, contrast, movement , rhythm, perspective \nand composition. None of which is surprising \nconsidering Zampanò's piece centers on a documentary \nfilm called The Navidson Record made by a Pulitzer \nPrize-winning photojournalist who must somehow capture \nthe most difficult subject of all: the sight of \ndarkness itself.",
            "note": "",
            "pageNumber": 23,
            "chapter": "Introduction ",
            "createdAt": 1740760696601,
            "style": "underline",
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
    let output = `---\ntitle: "${data.title}"\naliases: ["Notes from ${data.title}"]\nauthor: "${data.authors}"\n---\n# ${data.title}\n##### ${data.authors}`;

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