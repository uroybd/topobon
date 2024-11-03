---
{"title":"KOReader to Obsidian: Export Notes and Highlights","aliases":["KOReader to Obsidian: Export Notes and Highlights"],"created":"2023-09-10T14:38:12+06:00","updated":"2024-11-03T20:31:16+06:00","dg-note-icon":"chest","dg-publish":true,"tags":["koreader","obsidian","how-to","notes-export"],"dg-path":"Writings/Technical/HowTos/KOReader to Obsidian.md","permalink":"/writings/technical/how-tos/ko-reader-to-obsidian/","dgPassFrontmatter":true,"noteIcon":"chest"}
---

Previously, I used [KOReader](https://github.com/koreader/koreader)'s notes and highlight export function to export as markdown and store them in my Obsidian vault (I've contributed to its development too). I export with styles so that they give me context later. It is very convenient. However, sometimes, it is also hard to read. In Obsidian we have [callouts](https://help.obsidian.md/Editing+and+formatting/Callouts) which are not standard markdown, and therefore, is not a good candidate to add support for it in the KOReader directly. So I decided to export as JSON from KOReader and use that JSON to generate markdown the way I like.

I'm using the script below to achieve my goal. Save this as a template and call it with the [Templater plugin](https://github.com/SilentVoid13/Templater).

```js
<%*
const NOTE_STYLES = {
  yellow: {
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
  orange: {
    type: "warning",
    title: "Unsound"
  },
  purple: {
    type: "stylish"
    title: "Stylish"
  }
};

function format_koreader_percentages(page, total) {
	if (page && total) {
		return `${((page / total) * 100).toFixed(2)}%`;
	}
	return "";
}

function format_koreader_json_highlights(content) {
	const data = JSON.parse(content);
    let output = `---\ntitle: "${data.title}"\naliases: ["Notes from ${data.title}"]\nauthor: "${data.author}"\n---\n# ${data.title}\n##### ${data.author}`;

	let current_chapter = "";
	for (const entry of data.entries) {
	  if (entry.text) {
		if (entry.chapter != current_chapter) {
		  output += `\n\n## ${entry.chapter}\n`;
		  current_chapter = entry.chapter;
		}
		output += `\n### Page: ${
		  entry.page
		} (${format_koreader_percentages(
		  entry.page,
		  data.number_of_pages
		)}) @ ${window.moment.unix(entry.time).format("DD MMM YYYY hh:mm:ss A")}\n`;
		output += `\n${entry.text}`;
		const note_type = NOTE_STYLES[entry.color];
		output += `\n\n> [!${note_type.type}] ${note_type.title}`;
		if (entry.note) {
		  if (entry.note.length > 50) {
			output += `\n> ${entry.note}`;
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
const output = format_koreader_json_highlights(content);
let file = app.workspace.getActiveFile();
await app.vault.modify(file, output);
%>
```

Lines 23-26 use a [custom callout](https://help.obsidian.md/Editing+and+formatting/Callouts#Customize+callouts) defined with the following CSS:

```css
.callout[data-callout="stylish"] {
    --callout-color: var(--color-purple-rgb);
    --callout-icon: lucide-brush;
}
```

### An Example
Here's an exported JSON file I used to generate a note from:

```json
{
    "entries": [
        {
            "text": "He was wrong. Very understandably so, since reality, even if it is inevitable, is not completely predictable; those who learn some correct detail about the life of another promptly jump from it to quite incorrect conclusions and see in the newly discovered fact the explanation for things which in truth are completely unrelated to it.",
            "time": 1723464582,
            "color": "yellow",
            "sort": "highlight",
            "drawer": "underscore",
            "page": 22,
            "chapter": "The Prisoner"
        },
        {
            "text": "The things people joke about most are usually those which irritate them, but which they do not want to seem to be irritated by; there is perhaps, too, an unspoken hope of further advantage: that the person we are speaking to, hearing us admit something jokingly, will believe that it is not true.",
            "time": 1723464653,
            "color": "yellow",
            "sort": "highlight",
            "drawer": "underscore",
            "page": 38,
            "chapter": "The Prisoner"
        },
        {
            "text": "No, approaching the sonata from another point of view, looking at it in itself as the work of a great artist, I was carried back on the wave of sound towards the old days at Combray – I do not mean Montjouvain and the Méséglise way, but our walks towards Guermantes – when I myself had wanted to be an artist. Having in practice abandoned this ambition, had I given up something real? Could life make up to me for the loss of art, or was there in art a deeper reality where our true personality finds an expression that the actions of life cannot give it? Each great artist seems so different from all the others, and gives us such a strong sense of individuality, which we seek in vain in everyday life!",
            "time": 1724727692,
            "color": "blue",
            "sort": "highlight",
            "drawer": "underscore",
            "page": 131,
            "chapter": "The Prisoner"
        },
        {
            "text": "But despite the richness of these works, in which the contemplation of nature is found next to action, next to individuals who are not only the names of characters, I found myself thinking how strongly these works partake of the character of being – wonderfully, it is true – incomplete: that incompleteness which characterizes all the great works of the nineteenth century; the nineteenth century, whose greatest writers failed in their books, but, watching themselves at work as if they were both worker and judge, drew from this self-contemplation a new beauty, separate from and superior to their work, conferring on it retrospectively a unity, a grandeur which it does not have in reality.",
            "time": 1724727752,
            "color": "green",
            "sort": "highlight",
            "drawer": "underscore",
            "page": 132,
            "chapter": "The Prisoner"
        }
    ],
    "file": "/storage/emulated/0/Books/In Search of Lost Time/(In Search of Lost Time (Prendergast Edition) - 05) Marcel Proust - The Prisoner and The Fugitive.epub",
    "title": "The Prisoner and The Fugitive",
    "created_on": 1725171976,
    "version": "json/1.0.0",
    "number_of_pages": 568,
    "author": "Marcel Proust"
}
```

And it generated the following content:

```
---
title: "The Prisoner and The Fugitive"
aliases: ["Notes from The Prisoner and The Fugitive"]
author: "Marcel Proust"
---

# The Prisoner and The Fugitive
##### Marcel Proust

## The Prisoner

### Page: 22 (3.87%) @ 12 Aug 2024 06:09:42 PM

He was wrong. Very understandably so, since reality, even if it is inevitable, is not completely predictable; those who learn some correct detail about the life of another promptly jump from it to quite incorrect conclusions and see in the newly discovered fact the explanation for things which in truth are completely unrelated to it.

> [!quote] Quotable/Concept/General Idea

### Page: 38 (6.69%) @ 12 Aug 2024 06:10:53 PM

The things people joke about most are usually those which irritate them, but which they do not want to seem to be irritated by; there is perhaps, too, an unspoken hope of further advantage: that the person we are speaking to, hearing us admit something jokingly, will believe that it is not true.

> [!quote] Quotable/Concept/General Idea

### Page: 131 (23.06%) @ 27 Aug 2024 09:01:32 AM

No, approaching the sonata from another point of view, looking at it in itself as the work of a great artist, I was carried back on the wave of sound towards the old days at Combray – I do not mean Montjouvain and the Méséglise way, but our walks towards Guermantes – when I myself had wanted to be an artist. Having in practice abandoned this ambition, had I given up something real? Could life make up to me for the loss of art, or was there in art a deeper reality where our true personality finds an expression that the actions of life cannot give it? Each great artist seems so different from all the others, and gives us such a strong sense of individuality, which we seek in vain in everyday life!

> [!important] Striking/Intense

### Page: 132 (23.24%) @ 27 Aug 2024 09:02:32 AM

But despite the richness of these works, in which the contemplation of nature is found next to action, next to individuals who are not only the names of characters, I found myself thinking how strongly these works partake of the character of being – wonderfully, it is true – incomplete: that incompleteness which characterizes all the great works of the nineteenth century; the nineteenth century, whose greatest writers failed in their books, but, watching themselves at work as if they were both worker and judge, drew from this self-contemplation a new beauty, separate from and superior to their work, conferring on it retrospectively a unity, a grandeur which it does not have in reality.

> [!question] Thought Provoking

```

> [!success] Output
> # The Prisoner and The Fugitive
> ##### Marcel Proust
> 
> ## The Prisoner
> 
> ### Page: 22 (3.87%) @ 12 Aug 2024 06:09:42 PM
> 
> He was wrong. Very understandably so, since reality, even if it is inevitable, is not completely predictable; those who learn some correct detail about the life of another promptly jump from it to quite incorrect conclusions and see in the newly discovered fact the explanation for things which in truth are completely unrelated to it.
> 
> > [!quote] Quotable/Concept/General Idea
> 
> ### Page: 38 (6.69%) @ 12 Aug 2024 06:10:53 PM
> 
> The things people joke about most are usually those which irritate them, but which they do not want to seem to be irritated by; there is perhaps, too, an unspoken hope of further advantage: that the person we are speaking to, hearing us admit something jokingly, will believe that it is not true.
> 
> > [!quote] Quotable/Concept/General Idea
> 
> ### Page: 131 (23.06%) @ 27 Aug 2024 09:01:32 AM
> 
> No, approaching the sonata from another point of view, looking at it in itself as the work of a great artist, I was carried back on the wave of sound towards the old days at Combray – I do not mean Montjouvain and the Méséglise way, but our walks towards Guermantes – when I myself had wanted to be an artist. Having in practice abandoned this ambition, had I given up something real? Could life make up to me for the loss of art, or was there in art a deeper reality where our true personality finds an expression that the actions of life cannot give it? Each great artist seems so different from all the others, and gives us such a strong sense of individuality, which we seek in vain in everyday life!
> 
> > [!important] Striking/Intense
> 
> ### Page: 132 (23.24%) @ 27 Aug 2024 09:02:32 AM
> 
> But despite the richness of these works, in which the contemplation of nature is found next to action, next to individuals who are not only the names of characters, I found myself thinking how strongly these works partake of the character of being – wonderfully, it is true – incomplete: that incompleteness which characterizes all the great works of the nineteenth century; the nineteenth century, whose greatest writers failed in their books, but, watching themselves at work as if they were both worker and judge, drew from this self-contemplation a new beauty, separate from and superior to their work, conferring on it retrospectively a unity, a grandeur which it does not have in reality.
> 
> > [!question] Thought Provoking


## Before Version 2024.08

Before the aforementioned version, there was no support for colour in highlights. Back then I used to do the same using the 4 **styles** provided by KOReader. Here's the script to do just that. 

```js
<%*
// The KOReader defined highlight styles vs callout mapping. Leave the keys as is, but you can edit the values to create your own convention.
const NOTE_STYLES = {
  lighten: {
	type: "quote",
	title: "Quotable/Concept/General Idea",
  },
  invert: {
	type: "important",
	title: "Striking/Intense",
  },
  strikeout: {
	type: "danger",
	title: "In Discord",
  },
  underscore: {
	type: "question",
	title: "Thought Provoking",
  },
};

function format_koreader_percentages(page, total) {
	if (page && total) {
		return `${((page / total) * 100).toFixed(2)}%`;
	}
	return "";
}

function format_koreader_json_highlights(content) {
	const data = JSON.parse(content);
    let output = `---
title: "${data.title}"
aliases: ["Notes from ${data.title}"]
author: "${data.author}"
---
# ${data.title}
##### ${data.author}`;
	let current_chapter = "";
	for (const entry of data.entries) {
	  if (entry.text) {
		if (entry.chapter != current_chapter) {
		  output += `\n\n## ${entry.chapter}\n`;
		  current_chapter = entry.chapter;
		}
		output += `\n### Page: ${
		  entry.page
		} (${format_koreader_percentages(
		  entry.page,
		  data.number_of_pages
		)}) @ ${window.moment.unix(entry.time).format("DD MMM YYYY hh:mm:ss A")}\n`;
		output += `\n${entry.text}`;
		const note_type = NOTE_STYLES[entry.drawer];
		output += `\n\n> [!${note_type.type}] ${note_type.title}`;
		if (entry.note) {
		  if (entry.note.length > 50) {
			output += `\n> ${entry.note}`;
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
const output = format_koreader_json_highlights(content);
let file = app.workspace.getActiveFile();
await app.vault.modify(file, output);
%>
```

It will prompt you to paste the JSON. open the JSON file and copy-paste the content in the prompt.

### An Example
Here's an exported JSON file I used to generate a note from:

```json
{
	"number_of_pages": 68,
	"file": "/storage/emulated/0/Download/(Shambhala Centaur Editions) Sam Hamill - The Sound of Water_ Haiku by Basho, Buson, Issa, and Other Poets.epub",
	"author": "Sam Hamill",
	"entries": [
		{
			"chapter": "Cover",
			"text": "books from ancient Chinese, Japanese, Greek, Latin, and Estonian. He has published fourteen volumes of original poetry. He has been the recipient of fellowships from the National Endowment for the Arts, the Guggenheim Foundation, the Woodrow Wilson Foundation",
			"time": 1694256612,
			"sort": "highlight",
			"page": 2,
			"drawer": "lighten"
		},
		{
			"chapter": "Translator’s Introduction",
			"text": "authentic experience of “beeness” as deeply as possible? Perhaps both qualities are present. His detailed observation calls for something other than metaphor; it demands literal accuracy. Is the bee inside his mind or outside? The poem moves in part because of tension raised",
			"time": 1694256620,
			"sort": "highlight",
			"page": 9,
			"drawer": "underscore"
		},
		{
			"chapter": "Translator’s Introduction",
			"note": "some note Page 10 to write a quatrain or a sonnet. The problem remains: to be great, a poem must rise on its own merit, and too much haiku is merely haiku.",
			"text": "to write a quatrain or a sonnet. The problem remains: to be great, a poem must rise on its own merit, and too much haiku is merely haiku. Haiku written in American English and attempting to borrow traditional Japanese literary devices usually ends up smelling of the bric-",
			"time": 1694256629,
			"sort": "highlight",
			"page": 10,
			"drawer": "strikeout"
		},
		{
			"chapter": "Translator’s Introduction",
			"text": "follow in the footsteps of the old masters, but seek what they sought.” His “way of elegance” did not include the mere trappings associated with elegance; he sought the authentic vision of “the ancients.”\nBorn into a samurai family prominent among nobility, Bashō rejected that world and became a wanderer, studying Zen, history, and classical Chinese poetry, living in apparently",
			"time": 1694256653,
			"sort": "highlight",
			"page": 11,
			"drawer": "invert",
			"note": "a very small striking thing"
		}
	],
	"title": "The Sound of Water",
	"created_on": 1694256681,
	"version": "json/1.0.0"
}
```

And, It generated the following content:

```
---
title: "The Sound of Water"
aliases: ["Notes from The Sound of Water"]
author: "Sam Hamill"
---
# The Sound of Water
##### Sam Hamill

## Cover

### Page: 2 (2.94%) @ 09 Sep 2023 04:50:12 PM

books from ancient Chinese, Japanese, Greek, Latin, and Estonian. He has published fourteen volumes of original poetry. He has been the recipient of fellowships from the National Endowment for the Arts, the Guggenheim Foundation, the Woodrow Wilson Foundation

> [!quote] Quotable/Concept/General Idea


## Translator’s Introduction

### Page: 9 (13.24%) @ 09 Sep 2023 04:50:20 PM

authentic experience of “beeness” as deeply as possible? Perhaps both qualities are present. His detailed observation calls for something other than metaphor; it demands literal accuracy. Is the bee inside his mind or outside? The poem moves in part because of tension raised

> [!question] Thought Provoking

### Page: 10 (14.71%) @ 09 Sep 2023 04:50:29 PM

to write a quatrain or a sonnet. The problem remains: to be great, a poem must rise on its own merit, and too much haiku is merely haiku. Haiku written in American English and attempting to borrow traditional Japanese literary devices usually ends up smelling of the bric-

> [!danger] In Discord
> some note Page 10 to write a quatrain or a sonnet. The problem remains: to be great, a poem must rise on its own merit, and too much haiku is merely haiku.


### Page: 11 (16.18%) @ 09 Sep 2023 04:50:53 PM

follow in the footsteps of the old masters, but seek what they sought.” His “way of elegance” did not include the mere trappings associated with elegance; he sought the authentic vision of “the ancients.”
Born into a samurai family prominent among nobility, Bashō rejected that world and became a wanderer, studying Zen, history, and classical Chinese poetry, living in apparently

> [!important] Striking/Intense: a very small striking thing
```


> [!success] Output
> # The Sound of Water
> ##### Sam Hamill
> 
> ## Cover
> ### Page: 2 (2.94%) @ 09 Sep 2023 04:50:12 PM
> books from ancient Chinese, Japanese, Greek, Latin, and Estonian. He has published fourteen volumes of original poetry. He has been the recipient of fellowships from the National Endowment for the Arts, the Guggenheim Foundation, the Woodrow Wilson Foundation
> > [!quote] Quotable/Concept/General Idea
> ## Translator’s Introduction
> ### Page: 9 (13.24%) @ 09 Sep 2023 04:50:20 PM
> authentic experience of “beeness” as deeply as possible? Perhaps both qualities are present. His detailed observation calls for something other than metaphor; it demands literal accuracy. Is the bee inside his mind or outside? The poem moves in part because of tension raised
> > [!question] Thought Provoking
> ### Page: 10 (14.71%) @ 09 Sep 2023 04:50:29 PM
> to write a quatrain or a sonnet. The problem remains: to be great, a poem must rise on its own merit, and too much haiku is merely haiku. Haiku written in American English and attempting to borrow traditional Japanese literary devices usually ends up smelling of the bric-
> > [!danger] In Discord
> > some note Page 10 to write a quatrain or a sonnet. The problem remains: to be great, a poem must rise on its own merit, and too much haiku is merely haiku.
> ### Page: 11 (16.18%) @ 09 Sep 2023 04:50:53 PM
> follow in the footsteps of the old masters, but seek what they sought.” His “way of elegance” did not include the mere trappings associated with elegance; he sought the authentic vision of “the ancients.”
> Born into a samurai family prominent among nobility, Bashō rejected that world and became a wanderer, studying Zen, history, and classical Chinese poetry, living in apparently
> > [!important] Striking/Intense: a very small striking thing



