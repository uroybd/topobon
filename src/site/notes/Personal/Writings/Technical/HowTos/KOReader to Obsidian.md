---
{"title":"KOReader to Obsidian: Export Notes and Highlights","aliases":["KOReader to Obsidian: Export Notes and Highlights"],"created":"2023-09-10T14:38:12+06:00","updated":"2026-03-21T15:38:34+06:00","dg-note-icon":"chest","dg-publish":true,"tags":["koreader","obsidian","how-to","notes-export"],"dg-path":"Writings/Technical/HowTos/KOReader to Obsidian.md","permalink":"/writings/technical/how-tos/ko-reader-to-obsidian/","dgPassFrontmatter":true,"noteIcon":"chest"}
---

Previously, I used [KOReader](https://github.com/koreader/koreader)'s notes and highlight export function to export as markdown and store them in my Obsidian vault (I've contributed to its development too). I export with styles so that they give me context later. It is very convenient. However, sometimes, it is also hard to read. In Obsidian, we have [callouts](https://help.obsidian.md/Editing+and+formatting/Callouts) which are not standard markdown, and therefore, are not a good candidate to add support for it in the KOReader directly. So I decided to export as JSON from KOReader and use that JSON to generate markdown the way I like.

I'm using the script below to achieve my goal. Save this as a template (remember to uncomment the first and the last line after saving it as markdown) and call it with the [Templater plugin](https://github.com/SilentVoid13/Templater).

```gist
uroybd/350b9c7848ca727aaae9e4dcba0498d8#KOReader Highlights.js
```



Lines 28-31 use a [custom callout](https://help.obsidian.md/Editing+and+formatting/Callouts#Customize+callouts) defined with the following CSS:

```gist
uroybd/350b9c7848ca727aaae9e4dcba0498d8#callouts.css
```
## Note Supplements: A Faster Way to Write Longer Notes
KOReader has everything built-in, including the keyboard. It is slow to response in e-ink and honestly, writing a note more than 10 words wears me off. There's no ergonomic way to solve this. I made some compromises while crafting this solution.

The basic idea is, You keep another file in Obsidian for the book you're reading, in the `Unprocessed` folder to write long notes.

In that note, use the following template to generate a block for your note.

```gist
uroybd/350b9c7848ca727aaae9e4dcba0498d8#Highlight Companion.md
```
It will generate a block like this, here `hj24v0` is the ID:

```
--- START: hj24v0 ---

--- END ---
```

You write your long note inside this:

```
--- START: hj24v0 ---
Your very very very long note that would take 2 hours to write in KOReader.
--- END ---
```

The next step is, in KOReader, in the highlight's note put the ID with `#` in front (`#hj24v0` in this case), and save.

When running our template to import highlight, after pasting the JSON, there will be a prompt to select supplement file, you can select it or skip it if you don't have any. Those notes will be merged with your exported notes.
## An Example
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
