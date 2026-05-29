---
{"title":"Remembrance of Things Past","aliases":["Remembrance of Things Past"],"handle":"remembrance","created":"2023-10-01T19:37:26+06:00","updated":"2026-05-29T21:34:16+06:00","dg-publish":true,"dg-note-icon":"3","tags":["book-series"],"cssclasses":["base-plain"],"dg-path":"Reading/Series/Remembrance of Things Past.md","permalink":"/reading/series/remembrance-of-things-past/","dgPassFrontmatter":true,"noteIcon":"3","dg-note-properties":{"title":"Remembrance of Things Past","aliases":["Remembrance of Things Past"],"handle":"remembrance","created":"2023-10-01T19:37:26+06:00","updated":"2026-05-29T21:34:16+06:00","tags":["book-series"],"cssclasses":["base-plain"]}}
---

I started reading this book with much scepticism on my part. The volume of the work (4200 pages) is in itself prohibitive since I get too little time to read, and I prefer non-fiction more. Now, my reading is often a public act; people regularly ask me what I am reading. That is easy to answer. However, some of them are readers themselves. Often, they follow up with a question to know what I am getting out of it/what this book is about.

One may say that it is not important for fiction. Well, that is not entirely true. At least, one must get the entertainment out of the most light readings. And when you read 4 thousand pages of fiction, you'd better get something more. I have learned more about anarchy from V for Vendetta than from all the works by Noam Chomsky I have read. Human failings in the political landscape are much more well explained in 1984 and Animal Farm than in many political treatises.


<div class="transclusion internal-embed is-loaded"><div class="markdown-embed">

<div class="markdown-embed-title">

# Finding Time Again_ In Search of Lost Time, Volume 7

</div>


I was thinking of those who would read it as my readers. For they were not, as I saw it, my readers, so much as readers of their own selves, my book being merely one of those magnifying glasses of the sort the optician at Combray used to offer his customers; my book, but a books thanks to which I would be providing them with the means of reading within themselves. 

</div></div>


We can see what Proust thought about this book at the end of the [[Personal/Reading/Books/Read/Finding Time Again by Marcel Proust\|last volume]] of this work as cited above. This is very true. Although events in this work happened in a time in society now virtually non-existent, the work itself is an internal monologue, a retrospective introspection.

**Instead of giving us something, Proust involves us.**

The word 'involvement' requires some qualifications. In great Russian novels, we find writers as omnipresent observers of events and explaining a deeper understanding of human affairs now and then; here we are in the driver's seat. Proust and his character are really mischievous map-readers trying to navigate us through the unknown alleys of our soul. Some of them are full of pettiness, some are dark. Some are evil, to say the least.

And that is not all. The involvement requires practice. The volume of this book will let you practice being Marcel. Marcel– who is vain and jealous but sincere regarding art. Marcel the tormentor and tormented. Marcel– who laments and is both dazzled and bored in society.

Among all those aforementioned things, boredom is the hardest thing to produce. It is risky, too. However, Proust used almost three of the seven volumes to produce a long monotony, inducing a sense of utter uselessness of 'society', just so one can understand Marcel's position better.


```base
filters:
  and:
    - file.folder.contains("Personal/Reading/Books")
    - file.ext != "base"
formulas:
  Title: link(file.path, title)
  Series: series[this.handle]
  series_string: series.toString()
  Rating: if(rating == null, "N/A", ["⭐", rating.toString()].join(" "))
  Cover: image(cover)
  Log: log.toString()
  Untitled: log.map(value.timestamp)
  Reading Years: log.filter(value.status == "Read").map(value.timestamp.split("-")[0])
  Untitled 2: log.filter(value.status == "Read")
  Author Names: list(this.title) + this.aliases
properties:
  note.authors:
    displayName: Authors
  note.reading_notes:
    displayName: Notes
  note.reviewed:
    displayName: Reviewed
  note.status:
    displayName: Status
  note.tags:
    displayName: Tags
  note.updated:
    displayName: Updated
  note.created:
    displayName: Added On
  note.dg-note-icon:
    displayName: Maturity
  formula.Series:
    displayName: Index
  formula.Author Names:
    displayName: Author Filter
views:
  - type: table
    name: All Books
    filters:
      and:
        - status != "Abandoned"
    groupBy:
      property: status
      direction: ASC
    order:
      - formula.Cover
      - formula.Title
      - authors
      - status
      - reviewed
      - formula.Rating
      - tags
      - pages
      - reading_notes
      - updated
    sort:
      - property: updated
        direction: DESC
      - property: formula.Cover
        direction: DESC
      - property: formula.Title
        direction: ASC
    summaries:
      pages: Average
    columnSize:
      formula.Cover: 67
      note.status: 125
      formula.Rating: 102
      note.tags: 184
      note.reading_notes: 222
      note.updated: 231
    rowHeight: medium
  - type: table
    name: Queue
    filters:
      and:
        - status == "To Read"
    order:
      - formula.Title
      - authors
      - tags
      - created
    sort:
      - property: created
        direction: DESC
    columnSize:
      formula.Title: 636
      note.tags: 184
      note.created: 239
  - type: table
    name: Published
    filters:
      and:
        - note["dg-publish"] == true
    order:
      - formula.Title
      - authors
      - tags
      - dg-note-icon
      - updated
    sort:
      - property: updated
        direction: DESC
  - type: table
    name: Series
    filters:
      and:
        - formula.series_string.contains(this.handle)
    order:
      - formula.Series
      - formula.Title
      - authors
      - status
      - formula.Rating
      - updated
    sort:
      - property: formula.Series
        direction: ASC
    columnSize:
      formula.Series: 27
      formula.Title: 220
      note.updated: 294
  - type: cards
    name: Series Cards
    filters:
      and:
        - formula.series_string.contains(this.handle)
    order:
      - formula.Title
      - formula.Series
      - authors
      - status
      - formula.Rating
      - tags
    sort:
      - property: formula.Series
        direction: ASC
    image: cover
    imageFit: contain
    cardSize: 160
  - type: cards
    name: By Year
    filters:
      and:
        - file.folder == "Personal/Reading/Books/Read"
        - log.filter(value.status == "Read" && value.timestamp.year == this.title)
    order:
      - formula.Title
      - authors
      - tags
      - formula.Rating
      - reading_notes
    sort:
      - property: updated
        direction: DESC
    image: cover
    imageFit: contain
    cardSize: 160
  - type: cards
    name: Current Year
    filters:
      and:
        - file.folder.startsWith("Personal/Reading/Books")
        - or:
            - status == "In Progress"
            - log.filter(value.status == "Read" && value.timestamp.year == this.title)
    groupBy:
      property: status
      direction: ASC
    order:
      - formula.Title
      - authors
      - tags
      - formula.Rating
      - reading_notes
    sort:
      - property: updated
        direction: DESC
    image: cover
    imageFit: contain
    cardSize: 160
  - type: cards
    name: By Author
    filters:
      or:
        - formula["Author Names"].reduce(if(authors.contains(value), value,  acc), "null") != "null"
    order:
      - file.name
      - formula.Title
      - status
      - formula.Rating
      - tags
      - reading_notes
      - formula.Author Names
    image: note.cover
    imageFit: contain

```

