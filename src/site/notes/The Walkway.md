```dataviewjs
const latest = dv.pages().where(p => p["dg-publish"] == true && p["dg-home"] != true && p["garden-index"] != true).sort(p => p.updated, 'desc').limit(10);

const { Formatters } = customJS;

dv.table(
  ["Title", "Updated", "Created"],
  latest.map((b) => {
    return [
      Formatters.format_maturity_title_link(b, b.maturity),
      Formatters.format_compact_date(b.updated),
      Formatters.format_compact_date(b.created),
    ];
  })
);

```