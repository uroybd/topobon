---
{"title":"Boox to Obsidian: Highlights and Annotations","aliases":["Boox to Obsidian: Highlights and Annotations"],"created":"2023-08-01T13:46:56+06:00","updated":"2024-11-03T20:28:37+06:00","dg-publish":true,"dg-note-icon":"chest","tags":["obsidian","boox","neoreader","how-to"],"dg-path":"Writings/Technical/HowTos/Boox to Obsidian_ Highlights and Annotations.md","permalink":"/writings/technical/how-tos/boox-to-obsidian-highlights-and-annotations/","dgPassFrontmatter":true,"noteIcon":"chest"}
---

## Problem
One can easily export highlights and annotations from NeoReader[^1] as txt file. However, it has some very important downsides:
1. It provides very minimal metadata, nothing more than page number, chapter, and time. One can choose between multiple highlighting *styles* while reading(e.g. highlight, wavy line, or straight underline), but these data are not being exported from NeoReader. Therefore, it goes nowhere near KOReader as long as exporting feature is concerned.
2. It's really a very ugly format.

## Solution
Here's a workflow (basically a [Templater](https://silentvoid13.github.io/Templater/) template) that made my life a little easier. It assumes some practices and setup on my part:
1. Obsidian, and Templater plugins installed.
2. Except for normal quotes, I'm starting my notes with the following symbols for added context:
    -  `!` for important notes.
    - `@` for disagreement.
    - `?` for thought-provoking things.
    - `>` for continued highlight. NeoReader doesn't allow to spill the highlight to another page. This will allow you to merge consecutive notes into one.

Only these symbols at the beginning will be treated differently.

With this setup and practices in place, copy the content of the gist below in a markdown file to use as a template for Templater:

<script src="https://gist.github.com/uroybd/cbfce7135b8efa61964f89234e52f39d.js"></script>

To use this, all one has to do is:
1. Create an empty note.
2. Run that note as a template using templater.
3. A prompt will appear for the content. Copy the exported note's content into this prompt and proceed.
4. A prompt for total page number will appear. Input the total pages calculated in the NeoReader for accurate calculation then proceed.

It will replace the existing content with formatted content.
### An Example

#### Before
```
Reading Notes | <<Proust, Marcel - Swann's Way>>Marcel Proust
PART II - Swann in Love
2023-09-28 13:11  |  Page No.: 166
It even seemed, for a moment, that this love for a phrase of music would have to open in Swann the possibility of a sort of rejuvenation. He had for so long given up directing his life toward an ideal goal and limited it to the pursuit of everyday satisfactions that he believed, without ever saying so formally to himself, that this would not change as long as he lived; much worse, since his mind no longer entertained any lofty ideas, he had ceased to believe in their reality, though without being able to deny it altogether.
【Note】? a common pitfall.
-------------------
2023-10-02 12:09  |  Page No.: 173
fix you up,” and with the conceited little laugh she would have given at some invention of her own, had settled behind Swann’s head, and under his feet, cushions of Japanese silk which she kneaded as if she were lavish with these riches and careless of their value. But when the valet came bringing one after another the many lamps which, nearly all enclosed in large Chinese vases, burned singly or in pairs, all on different pieces of furniture as though on altars, and which hadsummoned back to the already almost nocturnal
-------------------
2023-10-02 12:09  |  Page No.: 175
again in her, nevertheless that resemblance conferred a certain beauty on her too, made her more precious. Swann reproached himself for having misunderstood the value of a creature who would have appeared captivating to the great Sandro, and he felt happy that his pleasure in seeing Odette could be justified by his own aesthetic culture. He told himself
【Note】>
-------------------
PART III - Place-Names: The Name
2023-10-02 12:09  |  Page No.: 288
AMONG THE BEDROOMS whose images I summoned up most often in my nights of insomnia, none resembled less the rooms at Combray, dusted with an atmosphere that was grainy, pollinated, edible, and devout, than the room at the Grand-Hôtel de la Plage, at Balbec, whose enamel-painted walls contained, like the polished sides of a swimming pool which tints the water blue, a pure azure salt sea air. The Bavarian decorator commissioned to furnish the hotel had varied the design schemes of the rooms and on three sides, along the walls, in the one I was occupying, had placed low bookcases, with glass panes, in which, depending on the spot they occupied, and by an effect he had not foreseen, one part or another of the changing picture of the sea was reflected, unfurling a frieze
-------------------
2023-10-02 12:10  |  Page No.: 289
geology—and just as completely outside human history as the Ocean itself or the Great Bear,4 with those wild fishermen for whom no more than for the whales had there been any Middle Ages—it had been a great delight for me to see it suddenly take its place in the sequence of the centuries, now that it had experienced theRomanesque period, and to know that the Gothic trefoil had come at the proper time topattern those wild rocks too, like the frail but hardy plants which, when spring comes, spangle here and there the polar snow
【Note】* a note of importance
-------------------
2023-10-02 12:11  |  Page No.: 290
perfumes, colors seemed to me of any value; forthis alternation of images had brought about a change of direction in my desire, and—as abrupt as those that occur now and then in music—a complete change of tone in my sensibility. Thus it came about that a simple variation in the atmosphere was enough toprovoke this modulation in me without any need to wait for the return of a season. Foroften, in one season, we find a day that has strayed from another and that immediatelyevokes its particular pleasures, lets us experience
【Note】! another one!
-------------------
```

#### After

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

##### Raw

```markdown
# Proust, Marcel - Swann's Way
##### Marcel Proust

## PART II - Swann in Love
### Page: 166 (48.26%) @ 28 Sep 2023 01:11:00 PM

It even seemed, for a moment, that this love for a phrase of music would have to open in Swann the possibility of a sort of rejuvenation. He had for so long given up directing his life toward an ideal goal and limited it to the pursuit of everyday satisfactions that he believed, without ever saying so formally to himself, that this would not change as long as he lived; much worse, since his mind no longer entertained any lofty ideas, he had ceased to believe in their reality, though without being able to deny it altogether.

> [!question] Thought Provoking: a common pitfall.


### Page: 173 (50.29%) @ 02 Oct 2023 12:09:00 PM

fix you up,” and with the conceited little laugh she would have given at some invention of her own, had settled behind Swann’s head, and under his feet, cushions of Japanese silk which she kneaded as if she were lavish with these riches and careless of their value. But when the valet came bringing one after another the many lamps which, nearly all enclosed in large Chinese vases, burned singly or in pairs, all on different pieces of furniture as though on altars, and which hadsummoned back to the already almost nocturnal again in her, nevertheless that resemblance conferred a certain beauty on her too, made her more precious. Swann reproached himself for having misunderstood the value of a creature who would have appeared captivating to the great Sandro, and he felt happy that his pleasure in seeing Odette could be justified by his own aesthetic culture. He told himself

> [!quote] Quotable/Concept/General Idea

## PART III - Place-Names: The Name
### Page: 288 (83.72%) @ 02 Oct 2023 12:09:00 PM

AMONG THE BEDROOMS whose images I summoned up most often in my nights of insomnia, none resembled less the rooms at Combray, dusted with an atmosphere that was grainy, pollinated, edible, and devout, than the room at the Grand-Hôtel de la Plage, at Balbec, whose enamel-painted walls contained, like the polished sides of a swimming pool which tints the water blue, a pure azure salt sea air. The Bavarian decorator commissioned to furnish the hotel had varied the design schemes of the rooms and on three sides, along the walls, in the one I was occupying, had placed low bookcases, with glass panes, in which, depending on the spot they occupied, and by an effect he had not foreseen, one part or another of the changing picture of the sea was reflected, unfurling a frieze

> [!quote] Quotable/Concept/General Idea

### Page: 289 (84.01%) @ 02 Oct 2023 12:10:00 PM

geology—and just as completely outside human history as the Ocean itself or the Great Bear,4 with those wild fishermen for whom no more than for the whales had there been any Middle Ages—it had been a great delight for me to see it suddenly take its place in the sequence of the centuries, now that it had experienced theRomanesque period, and to know that the Gothic trefoil had come at the proper time topattern those wild rocks too, like the frail but hardy plants which, when spring comes, spangle here and there the polar snow

> [!quote] Quotable/Concept/General Idea: * a note of importance


### Page: 290 (84.30%) @ 02 Oct 2023 12:11:00 PM

perfumes, colors seemed to me of any value; forthis alternation of images had brought about a change of direction in my desire, and—as abrupt as those that occur now and then in music—a complete change of tone in my sensibility. Thus it came about that a simple variation in the atmosphere was enough toprovoke this modulation in me without any need to wait for the return of a season. Foroften, in one season, we find a day that has strayed from another and that immediatelyevokes its particular pleasures, lets us experience

> [!important] Striking/Intense: another one!
```

[^1]: The default reading app for Onyx Boox Devices.