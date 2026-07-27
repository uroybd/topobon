---
{"title":"Unlived Lives of Ours","handle":"unlived","created":"2023-02-09T09:23:19+06:00","updated":"2026-07-27T18:06:19+06:00","total_books":"2","dg-note-icon":"signpost","dg-publish":true,"dg-path":"Writings/Series/Unlived Lives of Ours.md","permalink":"/writings/series/unlived-lives-of-ours/","dgPassFrontmatter":true,"noteIcon":"signpost","dg-note-properties":{"title":"Unlived Lives of Ours","handle":"unlived","created":"2023-02-09T09:23:19+06:00","updated":"2026-07-27T18:06:19+06:00","total_books":"2"}}
---


```base
formulas:
  series_string: series.toString()
  Title: link(file.path, title)
  SL: |
    series[this.handle]
properties:
  note.location:
    displayName: Location
views:
  - type: table
    name: Series Entries
    filters:
      and:
        - file.folder.startsWith("Personal/Writings")
        - series.keys().contains(this.handle)
    order:
      - formula.SL
      - formula.Title
      - location

```
