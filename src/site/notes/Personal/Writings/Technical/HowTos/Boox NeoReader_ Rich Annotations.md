---
{"created":"2026-06-15T23:22:01+06:00","updated":"2026-06-16T02:34:02+06:00","title":"Boox NeoReader: Rich Annotations","aliases":["Boox NeoReader: Rich Annotations"],"dg-publish":true,"dg-note-icon":"chest","dg-path":"Writings/Technical/HowTos/Boox NeoReader_ Rich Annotations.md","permalink":"/writings/technical/how-tos/boox-neo-reader-rich-annotations/","dgPassFrontmatter":true,"noteIcon":"chest","dg-note-properties":{"created":"2026-06-15T23:22:01+06:00","updated":"2026-06-16T02:34:02+06:00","title":"Boox NeoReader: Rich Annotations","aliases":["Boox NeoReader: Rich Annotations"]}}
---

Reading is never really only reading, at least to me. It comes with an arsenal of cerebral processes— analysis, deduction, deconstruction… the usual lot. And, it is of paramount importance to me that I retain my thoughts and mood of those times. Hence, my emphasis on how much metadata I can store in the annotations I collect from a bvolved about the same annotation. I want to refer to them with as much accuracy as I can get.

As you may already know if you are a Boox device user, the text annotation exports they provide are subpar. And the developers surely have other priorities. What I really needed was to colour-code and export those annotations with that data about colours so that I can contextualise them even when I just highlighted, but have not written a note about it.

Since there's no native way to do that in NeoReader, I, by far, have attempted to remedy the situation. The first way was to put special symbols to denote. For example, for thought-provoking highlights. You can find that [[Personal/Writings/Technical/HowTos/Boox to Obsidian_ Highlights and Annotations from Boox Cloud\|implementation]] here. These symbols, along with an Obsidian Templater template, can do the trick. But it is not very ergonomic to do so. You have to put a symbol for every highlight, tiring, really. The second [[Personal/Writings/Technical/HowTos/Boox to Obsidian_ Rich Annotation Export from Boox Cloud\|implementation]] can use the colours, but you will need Tampermonkey to make it work. Still, it is better because you do that once for a book. Much less cumbersome than putting a symbol on every highlight.

My third and by far the best approach is to create an Android app to do so. Let me introduce:

[![uroybd/BooxRichAnnotations - GitHub](https://githubcard.com/uroybd/BooxRichAnnotations.svg?d=ahadHc9n)](https://github.com/uroybd/BooxRichAnnotations/releases/latest)

And, it is understandably a better option for several reasons:
1. It works for multiple formats: `JSON`, `CSV`, and `text`
2. The template for `text` is customizable. So, you can be really creative with it.
3. It doesn't depend on elaborate setups like setting up a template or Tampermonkey script.
4. And it integrates with everything nicely. Both `JSON` and `CSV` are easy to import or program anywhere. You can customise the text format to your needs to get exactly what you want, to an extent.

## How?

Let's say you want your notes to be formatted as the [[Personal/Writings/Technical/HowTos/Boox NeoReader_ Rich Annotations#Example\|example]] Provided at the end of this post. It maps your highlight colours to a specific notion you had about them. For example, I use the colour 'green' for things I find thought-provoking.

If you download and run the app, you will be presented with a list of books, only if you have made any text annotations there. Just like this:

![Boox Rich Annotations App](https://github.com/uroybd/BooxRichAnnotations/blob/main/screenshots/main_page.png?raw=true)

**The default format you will get at this point is** `JSON`. If you press the share or the save button, they will share or save as JSON. If you want that, well… you just got it!

But, if you want a richly formatted text to store in Obsidian, you may want to go to the preferences:

![Boox Rich Annotations App](https://github.com/uroybd/BooxRichAnnotations/blob/main/screenshots/prefs_page.png?raw=true)

Select `Text` as your preferred format, and then click Edit Template. You will find yourself with an editor like this:

![Template Editor](https://github.com/uroybd/BooxRichAnnotations/raw/main/screenshots/template_editor.png)

It already comes with a decent template. But I haven't added callouts to it by default because that is an Obsidian-specific feature. So, copy this as raw and paste it into this editor and save the template:

```md
---
title: "{{ book.title }}"
aliases: ["Notes from {{ book.title }}"]
author: "{{ book.authors }}"
totalPages: {{ book.totalPages }}
totalAnnotations: {{ annotations | length }}
bookFormat: "{{ book.format }}"
exportedAt: "{{ book.exportedAt | date('dd MMM yyyy hh:mm:ss a') }}"
---
# {{ book.title }}
##### {{ book.authors }}

{%- set prevChapter = "" %}
{%- for annotation in annotations %}
{%- if annotation.chapter != prevChapter %}

## {{ annotation.chapter }}
{%- set prevChapter = annotation.chapter %}
{%- endif %}
### Page: {{ annotation.pageNumber }}{% if book.totalPages %} ({{ (annotation.pageNumber / book.totalPages * 100) | round(2) }}%){% endif %} @ {{ annotation.createdAt | date("dd MMM yyyy hh:mm:ss a") }}

{{ annotation.quote }}

{%- set calloutType = "quote" %}
{%- set calloutTitle = "Quotable/Concept/General Idea" %}
{%- if annotation.color == "#f0ff00" %}
{%- set calloutType = "quote" %}
{%- set calloutTitle = "Quotable/Concept/General Idea" %}
{%- elseif annotation.color == "#00aaff" %}
{%- set calloutType = "important" %}
{%- set calloutTitle = "Striking/Intense" %}
{%- elseif annotation.color == "#ffc1c3" %}
{%- set calloutType = "danger" %}
{%- set calloutTitle = "In Discord" %}
{%- elseif annotation.color == "#00b036" %}
{%- set calloutType = "question" %}
{%- set calloutTitle = "Thought Provoking" %}
{%- elseif annotation.color == "#008000" %}
{%- set calloutType = "sceptic" %}
{%- set calloutTitle = "Sceptic" %}
{%- elseif annotation.color == "#ffaa00" %}
{%- set calloutType = "warning" %}
{%- set calloutTitle = "Unsound" %}
{%- elseif annotation.color == "#ee00ff" %}
{%- set calloutType = "stylish" %}
{%- set calloutTitle = "Stylish" %}
{%- endif %}

> [!{{ calloutType }}] {{ calloutTitle }}{% if annotation.note %}{% set noteLen = annotation.note | length %}{% if noteLen <= 50 %}: {{ annotation.note }}{% else %}
> {{ annotation.note }}{% endif %}{% endif %}

{% endfor %}
```

You may have already noticed that there are some custom callouts. So, you can drop this in a CSS file (e.g. callouts.css) and add it as a [css snippet](https://obsidian.md/help/snippets) in your Obsidian:

```css
.callout[data-callout="stylish"] {
  --callout-color: var(--color-purple-rgb);
  --callout-icon: lucide-brush;
}


.callout[data-callout="sceptic"] {
  --callout-color: 107, 142, 35;
  --callout-icon: lucide-message-circle-question;
}
```

And that's it. Now you can press the save button beside any book and get a well-formatted markdown that you can store directly in your Obsidian, like the example below!

### Example

> [!success] Output
> # Proust, Marcel - Swann's Way
> ##### Marcel Proust
> 
> ## PART II - Swann in Love
> ### Page: 166 (48.26%) @ 28 Sep 2023 01:11:00 PM
> 
> It even seemed, for a moment, that this love for a phrase of music would have to open in Swann the possibility of a sort of rejuvenation. He had for so long given up directing his life toward an ideal goal and limited it to the pursuit of everyday satisfactions that he believed, without ever saying so formally to himself, that this would not change as long as he lived; much worse, since his mind no longer entertained any lofty ideas, he had ceased to believe in their reality, though without being able to deny it altogether.
> 
> > [!question] Thought Provoking: a common pitfall.
> 
> 
> ### Page: 173 (50.29%) @ 02 Oct 2023 12:09:00 PM
> 
> fix you up,” and with the conceited little laugh she would have given at some invention of her own, had settled behind Swann’s head, and under his feet, cushions of Japanese silk which she kneaded as if she were lavish with these riches and careless of their value. But when the valet came bringing one after another the many lamps which, nearly all enclosed in large Chinese vases, burned singly or in pairs, all on different pieces of furniture as though on altars, and which hadsummoned back to the already almost nocturnal again in her, nevertheless that resemblance conferred a certain beauty on her too, made her more precious. Swann reproached himself for having misunderstood the value of a creature who would have appeared captivating to the great Sandro, and he felt happy that his pleasure in seeing Odette could be justified by his own aesthetic culture. He told himself
> 
> > [!quote] Quotable/Concept/General Idea
> 
> ## PART III - Place-Names: The Name
> ### Page: 288 (83.72%) @ 02 Oct 2023 12:09:00 PM
> 
> AMONG THE BEDROOMS whose images I summoned up most often in my nights of insomnia, none resembled less the rooms at Combray, dusted with an atmosphere that was grainy, pollinated, edible, and devout, than the room at the Grand-Hôtel de la Plage, at Balbec, whose enamel-painted walls contained, like the polished sides of a swimming pool which tints the water blue, a pure azure salt sea air. The Bavarian decorator commissioned to furnish the hotel had varied the design schemes of the rooms and on three sides, along the walls, in the one I was occupying, had placed low bookcases, with glass panes, in which, depending on the spot they occupied, and by an effect he had not foreseen, one part or another of the changing picture of the sea was reflected, unfurling a frieze
> 
> > [!quote] Quotable/Concept/General Idea
> 
> ### Page: 289 (84.01%) @ 02 Oct 2023 12:10:00 PM
> 
> geology—and just as completely outside human history as the Ocean itself or the Great Bear,4 with those wild fishermen for whom no more than for the whales had there been any Middle Ages—it had been a great delight for me to see it suddenly take its place in the sequence of the centuries, now that it had experienced theRomanesque period, and to know that the Gothic trefoil had come at the proper time topattern those wild rocks too, like the frail but hardy plants which, when spring comes, spangle here and there the polar snow
> 
> > [!quote] Quotable/Concept/General Idea: * a note of importance
> 
> 
> ### Page: 290 (84.30%) @ 02 Oct 2023 12:11:00 PM
> 
> perfumes, colors seemed to me of any value; forthis alternation of images had brought about a change of direction in my desire, and—as abrupt as those that occur now and then in music—a complete change of tone in my sensibility. Thus it came about that a simple variation in the atmosphere was enough toprovoke this modulation in me without any need to wait for the return of a season. Foroften, in one season, we find a day that has strayed from another and that immediatelyevokes its particular pleasures, lets us experience
> 
> > [!important] Striking/Intense: another one!
> 