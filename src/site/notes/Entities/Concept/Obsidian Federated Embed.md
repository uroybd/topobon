---
{"title":"Obsidian Federated Embed","aliases":["OFE"],"type":"Technical Draft","created":"2023-01-31T20:53:31+06:00","updated":"2023-01-31T21:50:33+06:00","dg-publish":true,"permalink":"/entities/concept/obsidian-federated-embed/","dgPassFrontmatter":true}
---

## Abstract
Digital Gardens are great for nurturing thought. And, evergreen notes expands but seldom scraped altogether. Therefore, Ideally, to build **campfire** of multiple gardener, cross-embedding between vaults/gardens.

## Approach
### Publisher
The publisher, be it a plugin like Obsidian Digital Garden, or a dedicated one will generate a manifest file, let's say, `obsidian-federation.json` to the root of the public URL with this format:

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

The plugin will get the manifest file based on the `URL`, then load the contents and suggest based on title, alias, and content URL then append the text as quote.

For partial embed, it will support block and header embed like existing syntax. There are also two new syntax for partial embed:

```
URL/path#:1-3 for line based embed
URL/path#>p:3 for tag-based embed, paragraph 3 in this case.
```
