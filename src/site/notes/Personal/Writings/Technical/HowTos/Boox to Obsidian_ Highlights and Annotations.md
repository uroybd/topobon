---
{"title":"Boox to Obsidian: Highlights and Annotations","aliases":["Boox to Obsidian: Highlights and Annotations"],"created":"2023-08-01T13:46:56+06:00","updated":"2023-08-01T14:08:06+06:00","dg-publish":true,"dg-note-icon":2,"tags":["obsidian","boox","neoreader","how-to"],"dg-path":"Writings/Technical/HowTos/Boox to Obsidian_ Highlights and Annotations.md","permalink":"/writings/technical/how-tos/boox-to-obsidian-highlights-and-annotations/","dgPassFrontmatter":true,"noteIcon":2}
---

## Problem
One can easily export highlights and annotations from NeoReader[^1] as txt file. However, it has some very important downsides:
1. It provides very minimal metadata, nothing more than page number, chapter, and time. One can choose between multiple highlighting *styles* while reading(e.g. highlight, wavy line, or straight underline), but these data are not being exported from NeoReader. Therefore, it goes nowhere near KOReader as long as exporting feature is concerned.
2. It's really a very ugly format.

## Solution
Here's a workflow (basically a [Templater](https://silentvoid13.github.io/Templater/) template) that made my life a little easier. It assumes some practices and setup on my part:
1. Obsidian, and Templater plugins installed.
2. Except for normal quotes, I'm starting my notes with the following symbols for added context:
  1. `*` for important notes.
  2. `#` for disagreement.
  3. `~` for thought-provoking things.

Only these symbols at the beginning will be treated differently.

With this setup and practices in place, we can create a template like this:

```
<%* 
function getTitleAndAuthor(l) {
  l = l.replace("Reading Notes | <<", "").split(">>");
  return {
    title: l[0],
    authors: l[1]
  }
}

function parseNote(note) {
  let lines = note.split("\n");
  lines.reverse();
  let content = {
    section: "",
    timestamp: "",
    page: "",
    highlight: "",
    note: ""
  }
  for (let i = 0; i < lines.length; i++) {
    let l = lines[i];
    if (l.includes("【Note】")) {
      content.note = l.replace('【Note】', "");
    } else if (l.includes("  |  Page No.: ")) {
      let meta = l.split("  |  Page No.: ");
      content.timestamp = meta[0]
      content.page = meta[1]
    } else if (i == lines.length - 1) {
      content.section = l;
    } else {
      content.highlight = l;
    }
  }
  return content
}

function formatNote(note) {
  let sym = note.charAt(0);
  let type = "quote"
  let title = "Quotable/Concept/General Idea";
  switch(sym) {
    case "*":
      note = note.substr(2);
      type = "important";
      title = "Striking/Intense"
      break;
    case "#":
      note = note.substr(2);
      type = "danger";
      title = "In Discord"
      break;
    case "~":
      note = note.substr(2);
      type = "question";
      title = "Though Provoking"
      break;
  }
  let output = "> [!" + type + "] " + title;
  if (note) {
    output += "\n" + note + "\n"
  }
  return output
}

let file = app.workspace.getActiveFile()
let content = await app.vault.read(file)
let lines = content.split("\n");
let titleAndAuthor = getTitleAndAuthor(lines.shift())
lines = lines.join("\n")
notes = lines.split("-------------------\n")

let output = ["# " + titleAndAuthor.title, "##### " + titleAndAuthor.authors].join("\n") + "\n\n";
let currentSection = null;
for (let i = 0;  i < notes.length; i++) {
  if (notes[i]) {
    let noteData = parseNote(notes[i])
    if (noteData.section && (currentSection != noteData.section)) {
      output += "## " + noteData.section + "\n";
      currentSection = noteData.section;
    }
    output += ["### " + noteData.timestamp + " @ Page: " + noteData.page, noteData.highlight].join("\n") + "\n";
    output += "\n" + formatNote(noteData.note) + "\n"
    output += "\n"
  }
}

app.vault.modify(file, output)
%>
```

To use this, all one has to do is:
1. Copy the text file's content in a note in obsidian.
2. Run this template.

It will replace the existing content with formatted content.

### An Example
![Media/Boox Template.gif](/img/user/Media/Boox%20Template.gif)

#### Before
```
Reading Notes | <<George Orwell - Animal Farm   (2011, Houghton Mifflin Harcourt)>>George Orwell
2023-07-15 01:16  |  Page No.: 18
Mr Jones, of the Manor Farm, had locked the hen-houses for the night,
【Note】descriptive begining
-------------------
2023-07-31 22:16  |  Page No.: 24
Man is the only creature that consumes without producing
-------------------
2023-07-15 01:16  |  Page No.: 18
Mr Jones, of the Manor Farm, had locked the hen-houses for the night,
【Note】* Another one, Striking
-------------------
2023-07-31 22:16  |  Page No.: 24
Man is the only creature that consumes without producing
【Note】# Another one, In discord
-------------------
2023-07-31 22:16  |  Page No.: 24
Man is the only creature that consumes without producing
【Note】~ Another one, Thought Provoking
-------------------
```

#### After
```
# George Orwell - Animal Farm   (2011, Houghton Mifflin Harcourt)
##### George Orwell

### 2023-07-15 01:16 @ Page: 18
Mr Jones, of the Manor Farm, had locked the hen-houses for the night,

> [!quote] Quotable/Concept/General Idea
descriptive begining


### 2023-07-31 22:16 @ Page: 24
Man is the only creature that consumes without producing

> [!quote] Quotable/Concept/General Idea

### 2023-07-15 01:16 @ Page: 18
Mr Jones, of the Manor Farm, had locked the hen-houses for the night,

> [!important] Striking/Intense
Another one, Striking


### 2023-07-31 22:16 @ Page: 24
Man is the only creature that consumes without producing

> [!danger] In Discord
Another one, In discord


### 2023-07-31 22:16 @ Page: 24
Man is the only creature that consumes without producing

> [!question] Though Provoking
Another one, Thought Provoking
```

[1]: The default reading app for Onyx Boox Devices.