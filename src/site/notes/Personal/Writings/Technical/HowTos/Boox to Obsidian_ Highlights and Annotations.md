---
{"title":"Boox to Obsidian: Highlights and Annotations","aliases":["Boox to Obsidian: Highlights and Annotations"],"created":"2023-08-01T13:46:56+06:00","updated":"2023-08-01T17:36:25+06:00","dg-publish":true,"dg-note-icon":2,"tags":["obsidian","boox","neoreader","how-to"],"dg-path":"Writings/Technical/HowTos/Boox to Obsidian_ Highlights and Annotations.md","permalink":"/writings/technical/how-tos/boox-to-obsidian-highlights-and-annotations/","dgPassFrontmatter":true,"noteIcon":2}
---

## Problem
One can easily export highlights and annotations from NeoReader[^1] as txt file. However, it has some very important downsides:
1. It provides very minimal metadata, nothing more than page number, chapter, and time. One can choose between multiple highlighting *styles* while reading(e.g. highlight, wavy line, or straight underline), but these data are not being exported from NeoReader. Therefore, it goes nowhere near KOReader as long as exporting feature is concerned.
2. It's really a very ugly format.

## Solution
Here's a workflow (basically a [Templater](https://silentvoid13.github.io/Templater/) template) that made my life a little easier. It assumes some practices and setup on my part:
1. Obsidian, and Templater plugins installed.
2. Except for normal quotes, I'm starting my notes with the following symbols for added context:
    -  `*` for important notes.
    - `#` for disagreement.
    - `~` for thought-provoking things.

Only these symbols at the beginning will be treated differently.

With this setup and practices in place, we can create a template like this:

```js
<%* 
const NOTE_STYLES = {
  "*": {
    type: "important",
    title: "Striking/Intense",
  },
  "#": {
    type: "danger",
    title: "In Discord",
  },
  "~": {
    type: "question",
    title: "Thought Provoking",
  },
}

const NOTE_STYLE_KEYS = Object.keys(NOTE_STYLES);

const DEFAULT_NOTE_STYLE = {
  type: "quote",
  title: "Quotable/Concept/General Idea"
}

function parseNoteFormat(note) {
  let data = {...DEFAULT_NOTE_STYLE, note};
  console.log("parsed note", data);
  for (let i = 0; i < NOTE_STYLE_KEYS.length; i++) {
    let key = NOTE_STYLE_KEYS[i];
    if (note.startsWith(key)) {
      data = {...NOTE_STYLES[key], note: note.substr(key.length + 1)};
      break;
    }
  }
  return data
}

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
      content.note = parseNoteFormat(l.replace('【Note】', ""));
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
  if (!content.note) {
    content.note = {...DEFAULT_NOTE_STYLE, note: ""}
  }
  return content
}

let file = app.workspace.getActiveFile()
let content = await app.vault.read(file)
let lines = content.split("\n");
let titleAndAuthor = getTitleAndAuthor(lines.shift())
lines = lines.join("\n")
notes = lines.split("-------------------\n")

let output = `# ${titleAndAuthor.title}\n##### ${titleAndAuthor.authors}\n\n`;
let currentSection = null;
for (let i = 0;  i < notes.length; i++) {
  if (notes[i]) {
    let noteData = parseNote(notes[i])
    console.log(noteData);
    if (noteData.section && (currentSection != noteData.section)) {
      output += `## ${noteData.section}\n`;
      currentSection = noteData.section;
    }
    output += `### ${noteData.timestamp} @ Page: ${noteData.page}\n${noteData.highlight}\n\n`;
    output += `> [!${noteData.note.type}] ${noteData.note.title}`;
    if (noteData.note.note) {
      output += `\n> ${noteData.note.note}\n`
    }
    output += "\n\n"
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
```markdown
# George Orwell - Animal Farm   (2011, Houghton Mifflin Harcourt)
##### George Orwell

### 2023-07-15 01:16 @ Page: 18
Mr Jones, of the Manor Farm, had locked the hen-houses for the night,

> [!quote] Quotable/Concept/General Idea
> descriptive begining


### 2023-07-31 22:16 @ Page: 24
Man is the only creature that consumes without producing

> [!quote] Quotable/Concept/General Idea

### 2023-07-15 01:16 @ Page: 18
Mr Jones, of the Manor Farm, had locked the hen-houses for the night,

> [!important] Striking/Intense
> Another one, Striking


### 2023-07-31 22:16 @ Page: 24
Man is the only creature that consumes without producing

> [!danger] In Discord
> Another one, In discord


### 2023-07-31 22:16 @ Page: 24
Man is the only creature that consumes without producing

> [!question] Thought Provoking
> Another one, Thought Provoking
```

[^1]: The default reading app for Onyx Boox Devices.