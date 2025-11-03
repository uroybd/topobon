---
{"title":"Steal My Look!","aliases":["Steal My Look!"],"created":"2025-11-03T15:25:58+06:00","updated":"2025-11-03T16:09:27+06:00","dg-publish":true,"dg-note-icon":"chest","dg-path":"Writings/Technical/HowTos/Steal My Look.md","permalink":"/writings/technical/how-tos/steal-my-look/","dgPassFrontmatter":true,"noteIcon":"chest"}
---

You visited my digital garden and are wondering how to replicate it (maybe partially)? I will try to guide you through it.

This is the repository containing my source code:
 
[![uroybd/topobon - GitHub](https://gh-card.dev/repos/uroybd/topobon.svg)](https://github.com/uroybd/topobon)

> [!INFO] Having difficulties?
> I understand if you are. But the sole reason for this note is to help non-technical people. If you are struggling, feel free to contact me (the email button on the bottom-right might come in handy), or comment here. I will try to help and update this note accordingly.

## To Replicate Completely
If you are starting fresh and want my repository to use as a starting point, just clone it and delete all markdown files (ending with `.md`) from the [notes](https://github.com/uroybd/topobon/tree/main/src/site/notes) directory.

## Replicate Partially
Most of the customisations you see in my garden are done using the [Custom Component] feature available in Obsidian Digital Garden. All such components can be found in [this folder](https://github.com/uroybd/topobon/tree/main/src/site/_includes/components/user).
### All Components
1. Common:
    1. Footer:
        1. [Floating Controls](https://github.com/uroybd/topobon/blob/main/src/site/_includes/components/user/common/footer/001-floatingControls.njk): For the floating control at the bottom-right. It allows you to switch between dark/light modes, and allows you to start a conversation through email.
        2. [Analytics](https://github.com/uroybd/topobon/blob/main/src/site/_includes/components/user/common/footer/002-analytics.njk): For Vercel analytics.
        3. [Footnotes](https://github.com/uroybd/topobon/blob/main/src/site/_includes/components/user/common/footer/003-footNote.njk): For pop-up footnotes.
    2. Head:
        1. [OG Image](https://github.com/uroybd/topobon/blob/main/src/site/_includes/components/user/common/head/002-og-image.njk) For OpenGraph Image resolution based on note maturity.
2. Index:
    1. Head:
        1. [Google Meta](https://github.com/uroybd/topobon/blob/main/src/site/_includes/components/user/index/head/001-google-meta.njk): To add Google's meta tag for verification.
        2. [Forest](https://github.com/uroybd/topobon/blob/main/src/site/_includes/components/user/index/header/forest.njk): To render the *Forest* on the home page.
3. Notes:
    1. AfterContent:
        1. [Series](https://github.com/uroybd/topobon/blob/main/src/site/_includes/components/user/notes/afterContent/001-series.njk): To add series-related information.
    2. BeforeContent:
        1. [Tool Links](https://github.com/uroybd/topobon/blob/main/src/site/_includes/components/user/notes/beforeContent/001-tool-links.njk): To show a section for *Tool* notes with links.
    3. Footer:
        1. [Comment](https://github.com/uroybd/topobon/blob/main/src/site/_includes/components/user/notes/footer/001-comment.njk): For Disqus comment.
        2. [Slider]: To show a note as a slider. [[Personal/Writings/Creative/Poems/হেমন্তের হাইকু\|See in action]].
    4. Header:
        1. [Aliases](https://github.com/uroybd/topobon/blob/main/src/site/_includes/components/user/notes/header/001-aliases.njk): To show note aliases in the header.
        2. [Reading Convention](https://github.com/uroybd/topobon/blob/main/src/site/_includes/components/user/notes/header/002-reading-convention.njk): for highlighting conventions of some of my older reading notes. Adding it here for completeness' sake.

### Forest
The aforementioned forest component requires a little more work than just adding components. To make it work, some site-wide calculation is needed. The relevant part can be found in the [userUtils.js file](https://github.com/uroybd/topobon/blob/main/src/helpers/userUtils.js)

### Cards
In [[The Threshold\|The Threshold]] or in [[Personal/Reading/The Shelf\|The Shelf]], you may have noticed cards of notes. This is being achieved by a combination of:
1. [Dataview Plugin](https://blacksmithgu.github.io/obsidian-dataview/): To render the tables.
2. [Minimal Theme](https://minimal.guide): To turn the tables to cards.

**It means that to have the cards (until the base support lands), you have to set your Garden's theme to Minimal.**