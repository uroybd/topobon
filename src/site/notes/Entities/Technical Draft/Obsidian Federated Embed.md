---
{"title":"Obsidian Federated Embed","aliases":["OFE"],"type":"Technical Draft","dg-publish":true,"dg-note-icon":2,"tags":["technical-draft"],"updated":"2023-07-12T11:53:10","created":"2023-01-31T20:53:31","dg-path":"Entities/Technical Drafts/Obsidian Federated Embed.md","permalink":"/entities/technical-drafts/obsidian-federated-embed/","dgPassFrontmatter":true,"noteIcon":2}
---

## Abstract
Digital Gardens are great for nurturing thought. And, evergreen notes expand but are seldom scraped altogether. Therefore, Ideally, to build a **campfire** of multiple gardeners, cross-embedding between vaults/gardens.

## Approach
### Publisher
The publisher, be it a plugin like Obsidian Digital Garden, or a dedicated one will generate a manifest file, let's say, `campfire.json` to the root of the public URL with this format:

```json
{
  "version": "1.0.0",
  "last_updated": "<unix timestamp>",
  "content_root": "content root to prepend before content_url",
  "published_root": "published root to prepend before published_url",
  "notes": [
    {
      "title": "Some Title",
      "aliases": ["An alias"],
      "content_url": "relative url accessible from web to get the raw content",
      "published_url": "optional relative publicly available url",
      "last_updated": "<unix timestamp>"
    }
  ]
}
```

### Consumer
Consumer plugin will leverage existing callout syntax and provide auto-complete to help the user.

```md
> [!FED] URL/path
> <pulled_content>
>
> updated_at: <timestamp>
```

The plugin will get the manifest file based on the `URL`, then load the contents and suggest based on title, alias, and content URL then append the text as a quote.

For partial embedding, it will support block and header embedding like existing syntax. There are also two new syntaxes for partial embedding:

```
URL/path#:1-3 for line-based embed
URL/path#>p:3 for tag-based embed, paragraph 3 in this case.
```
