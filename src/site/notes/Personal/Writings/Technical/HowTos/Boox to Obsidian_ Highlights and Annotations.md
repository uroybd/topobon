---
{"title":"Boox to Obsidian: Highlights and Annotations","aliases":["Boox to Obsidian: Highlights and Annotations"],"created":"2023-08-01T13:46:56+06:00","updated":"2023-08-05T21:05:57+06:00","dg-publish":true,"dg-note-icon":3,"tags":["obsidian","boox","neoreader","how-to"],"dg-path":"Writings/Technical/HowTos/Boox to Obsidian_ Highlights and Annotations.md","permalink":"/writings/technical/how-tos/boox-to-obsidian-highlights-and-annotations/","dgPassFrontmatter":true,"noteIcon":3}
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
    - `?` for thought-provoking things.

Only these symbols at the beginning will be treated differently.

With this setup and practices in place, we can create a template like this:

```js
<%* 
// Note style prefixes we will map to callouts.
// It will suffice to put just this character to change the callout style.
// If additional notes are required, we will use a space after the prefix,
// and then continue to our usual note.
// Customize this as you see fit. With types from: https://help.obsidian.md/Editing+and+formatting/Callouts#Supported+types
const NOTE_STYLES = {
  "*": {
    type: "important",
    title: "Striking/Intense",
  },
  "#": {
    type: "danger",
    title: "In Discord",
  },
  "?": {
    type: "question",
    title: "Thought Provoking",
  },
}

const NOTE_STYLE_KEYS = Object.keys(NOTE_STYLES);

// Default note style, if any prefix is not present.
const DEFAULT_NOTE_STYLE = {
  type: "quote",
  title: "Quotable/Concept/General Idea"
}

function parseNoteFormat(note) {
  let data = {...DEFAULT_NOTE_STYLE, note};
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
      content.highlight = content.highlight ? `${l}\n${content.highlight}` : l;
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
notes = (lines.join("\n") + "\n").split("-------------------\n")

let output = `# ${titleAndAuthor.title}\n##### ${titleAndAuthor.authors}\n\n`;
let currentSection = null;
let prevNoteHeader = null;
for (let i = 0;  i < notes.length; i++) {
  if (notes[i] && notes[i].trim("\n").length) {
    let noteData = parseNote(notes[i])
    if (noteData.section && (currentSection != noteData.section)) {
      output += `## ${noteData.section}\n`;
      currentSection = noteData.section;
    }
    let noteHeader = `${noteData.timestamp} @ Page: ${noteData.page}`
    if (prevNoteHeader && prevNoteHeader.split(" / ")[0] == noteHeader) {
      noteHeader += " / " + ((parseInt(prevNoteHeader.split(" /")[1]) || 1) + 1) 
    }
    prevNoteHeader = noteHeader
    output += `### ${noteHeader}\n${noteData.highlight}\n\n`;
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
Reading Notes | <<Pearl, Judea_ Mackenzie, Dana - The Book of Why_ The New Science of Cause and Effect-Basic Books (2018)>>Judea Pearl
CHAPTER 1 The Ladder of Causation
2023-08-01 23:01  |  Page No.: 49
very early in our evolution, we humans realized that the world is not made up only of dry facts (what we might call data today
-------------------
CHAPTER 2 From Buccaneers to Guinea Pigs: The Genesis of Causal Inference
2023-08-01 23:03  |  Page No.: 115
In Pearson’s eyes, Galton had enlarged the vocabulary of science. Causation was reduced to nothing more than a special case of correlation
【Note】his view was inaccurate
-------------------
CHAPTER 2 From Buccaneers to Guinea Pigs: The Genesis of Causal Inference
2023-08-01 23:03  |  Page No.: 115
In Pearson’s eyes, Galton had enlarged the vocabulary of science. Causation was reduced to nothing more than a special case of correlation
【Note】* his view was inaccurate
-------------------
CHAPTER 2 From Buccaneers to Guinea Pigs: The Genesis of Causal Inference
2023-08-01 23:03  |  Page No.: 115
In Pearson’s eyes, Galton had enlarged the vocabulary of science. Causation was reduced to nothing more than a special case of correlation
【Note】# his view was inaccurate
-------------------
CHAPTER 2 From Buccaneers to Guinea Pigs: The Genesis of Causal Inference
2023-08-01 23:03  |  Page No.: 115
In Pearson’s eyes, Galton had enlarged the vocabulary of science. Causation was reduced to nothing more than a special case of correlation
【Note】? his view was inaccurate
-------------------
```

#### After

> [!success] Output
> # Pearl, Judea_ Mackenzie, Dana - The Book of Why_ The New Science of Cause and Effect-Basic Books (2018)
> ##### Judea Pearl
> 
> ## CHAPTER 1 The Ladder of Causation
> ### 2023-08-01 23:01 @ Page: 49
> very early in our evolution, we humans realized that the world is not made up only of dry facts (what we might call data today
> 
> > [!quote] Quotable/Concept/General Idea
> 
> ## CHAPTER 2 From Buccaneers to Guinea Pigs: The Genesis of Causal Inference
> ### 2023-08-01 23:03 @ Page: 115
> In Pearson’s eyes, Galton had enlarged the vocabulary of science. Causation was reduced to nothing more than a special case of correlation
>
> > [!quote] Quotable/Concept/General Idea
> > his view was inaccurate
> 
> ### 2023-08-01 23:03 @ Page: 115 / 2
> In Pearson’s eyes, Galton had enlarged the vocabulary of science. Causation was reduced to nothing more than a special case of correlation
> 
> > [!important] Striking/Intense
> > his view was inaccurate
> 
> ### 2023-08-01 23:03 @ Page: 115 / 3
> In Pearson’s eyes, Galton had enlarged the vocabulary of science. Causation was reduced to nothing more than a special case of correlation
> 
> > [!danger] In Discord
> > his view was inaccurate
> 
> ### 2023-08-01 23:03 @ Page: 115 / 4
> In Pearson’s eyes, Galton had enlarged the vocabulary of science. Causation was reduced to nothing more than a special case of correlation
> 
> > [!question] Thought Provoking
> > his view was inaccurate

##### Raw

```markdown
# Pearl, Judea_ Mackenzie, Dana - The Book of Why_ The New Science of Cause and Effect-Basic Books (2018)
##### Judea Pearl

## CHAPTER 1 The Ladder of Causation
### 2023-08-01 23:01 @ Page: 49
very early in our evolution, we humans realized that the world is not made up only of dry facts (what we might call data today

> [!quote] Quotable/Concept/General Idea

## CHAPTER 2 From Buccaneers to Guinea Pigs: The Genesis of Causal Inference
### 2023-08-01 23:03 @ Page: 115
In Pearson’s eyes, Galton had enlarged the vocabulary of science. Causation was reduced to nothing more than a special case of correlation

> [!quote] Quotable/Concept/General Idea
> his view was inaccurate


### 2023-08-01 23:03 @ Page: 115 / 2
In Pearson’s eyes, Galton had enlarged the vocabulary of science. Causation was reduced to nothing more than a special case of correlation

> [!important] Striking/Intense
> his view was inaccurate


### 2023-08-01 23:03 @ Page: 115 / 3
In Pearson’s eyes, Galton had enlarged the vocabulary of science. Causation was reduced to nothing more than a special case of correlation

> [!danger] In Discord
> his view was inaccurate


### 2023-08-01 23:03 @ Page: 115 / 4
In Pearson’s eyes, Galton had enlarged the vocabulary of science. Causation was reduced to nothing more than a special case of correlation

> [!question] Thought Provoking
> his view was inaccurate
```

[^1]: The default reading app for Onyx Boox Devices.