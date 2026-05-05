---
{"title":"The Shelf","aliases":["The Shelf"],"created":"2023-03-21T14:29:43+06:00","updated":"2026-05-05T20:16:07+06:00","dg-note-icon":"signpost","dg-publish":true,"dg-pinned":true,"garden-index":true,"dg-hide-in-graph":true,"cssClasses":["cards","cards-cols-3","cards-cover","cards-cover-no-border"],"tags":["bookshelf"],"dg-path":"Reading/The Shelf.md","permalink":"/reading/the-shelf/","hideInGraph":true,"pinned":true,"contentClasses":"cards cards-cols-3 cards-cover cards-cover-no-border","dgPassFrontmatter":true,"noteIcon":"signpost","dg-note-properties":{"title":"The Shelf","aliases":["The Shelf"],"created":"2023-03-21T14:29:43+06:00","updated":"2026-05-05T20:16:07+06:00","garden-index":true,"cssClasses":["cards","cards-cols-3","cards-cover","cards-cover-no-border"],"tags":["bookshelf"]}}
---

These are all the books (and notes) I've been mentioning in this garden.
```base
filter: file.inFolder("Personal/Reading/Books") && file["dg-publish"] == true
filters:
  and:
    - file.inFolder("Personal/Reading/Books")
    - file.hasProperty("dg-publish")
    - '!file.hasProperty("garden-index")'
properties:
  note.reading_notes:
    displayName: Notes
views:
  - type: cards
    name: The Shelf
    order:
      - file.name
      - reading_notes
      - tags
    image: note.cover
    imageFit: contain

```
