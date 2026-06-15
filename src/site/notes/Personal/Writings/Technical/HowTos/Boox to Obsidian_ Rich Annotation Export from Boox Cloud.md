---
{"title":"Boox to Obsidian: Rich Annotation Export from Boox Cloud","aliases":["Boox to Obsidian: Rich Annotation Export from Boox Cloud"],"created":"2025-03-27T12:13:35+06:00","updated":"2026-06-15T16:48:24+06:00","location":"Dhaka","dg-publish":true,"dg-note-icon":"chest","dg-path":"Writings/Technical/HowTos/Boox to Obsidian_ Rich Annotation Export from Boox Cloud.md","permalink":"/writings/technical/how-tos/boox-to-obsidian-rich-annotation-export-from-boox-cloud/","dgPassFrontmatter":true,"noteIcon":"chest","dg-note-properties":{"title":"Boox to Obsidian: Rich Annotation Export from Boox Cloud","aliases":["Boox to Obsidian: Rich Annotation Export from Boox Cloud"],"created":"2025-03-27T12:13:35+06:00","updated":"2026-06-15T16:48:24+06:00","location":"Dhaka"}}
---

[Many like me](https://christiantietze.de/posts/2023/05/boox-neoreader-annotation-export-is-meh/), have already noticed that annotations exported as text or HTML from Boox devices are inadequate at best. They lack context. Previously, I tried to make the situation better by [[Personal/Writings/Technical/HowTos/Boox to Obsidian_ Highlights and Annotations\|adding some context in the notes]]. It works, but it is very cumbersome to handle.

**But I found a better way.**

First, download **Boox Rich Annotations** app from the latest release page:

[![uroybd/BooxRichAnnotations - GitHub](https://gh-card.dev/repos/uroybd/BooxRichAnnotations.svg)](https://github.com/uroybd/BooxRichAnnotations/releases/latest)

Once you download, install, and open it, you will be presented with a screen like this, where you can see all the books of `epub`, `mobi` and `azw` format in a list:

![Boox Rich Annotations App](https://github.com/uroybd/BooxRichAnnotations/blob/main/screenshots/main_page.png?raw=true)

You can either press the save button to save the annotations as JSON in your **Downloads** folder or the share button to share the JSON through your system's share sheet. It **doesn't require an active internet connection**.

Once you have it downloaded as JSON, you will get something like this, where fields like highlight style and colours are present:

```json
{
    "title": "House Of Leaves",
    "authors": "Mark Z. Danielewski",
    "format": "pdf",
    "totalPages": 740,
    "annotations": [
        {
            "quote": "As I discovered, there were reams and reams of \nit. Endless snarls of words, sonetines twisting into \nmeaning, sometimes into nothing at all, frequently \nbreaking apart, always branching off into other pieces \nI'd come across later-on old napkins, the tattered \nedges of an envelope, once even on the back of a \npostage stamp; everything and anything but empty; each \nfragment completely covered with the creep of years \nand years of ink pronouncements; layered, crossed out,\namended; handwritten, typed; legible, illegible;\nimpenetrable, lucid; torn, stained, scotch taped; some \nbits crisp and clean, others faded, burnt or folded \nand refolded so many times the creases have \nobliterated whole passages of god knows what-sense?\ntruth? deceit? a legacy of prophecy or lunacy or \nnothing of the kind?, and in the end achieving,\ndesignating, describing, recreating-find your own \nwords; I have no more; or plenty more but why? and all \nto tellwhat?",
            "note": "",
            "pageNumber": 19,
            "chapter": "Introduction ",
            "createdAt": 1740509505032,
            "style": "underline",
            "color": "#ee00ff"
        },
        {
            "quote": "Zampanò, I've come to recognize now, was a very \nfunny man. But his humor was that wry, desiccated \nkind soldiers whisper, all their jokes subsurface,\ntheir laughter amounting to little more than a tic in \nthe corner of the mouth, told as they wait together in \ntheir outpost, slowly realizing that help's not going \nto reach them in time and come nightfall, no matter \nwhat they've done or what they try to say, slaughter \nwill overrun them all. Carrion dawn for vultures",
            "note": "",
            "pageNumber": 22,
            "chapter": "Introduction ",
            "createdAt": 1740760531837,
            "style": "underline",
            "color": "#ee00ff"
        },
        {
            "quote": "\"Irony? Irony can never be more than our own \npersonal Maginot Line; the drawing of it, for the most \npart, purely arbitrary.\"",
            "note": "",
            "pageNumber": 22,
            "chapter": "Introduction ",
            "createdAt": 1740760623457,
            "style": "underline",
            "color": "#ee00ff"
        },
        {
            "quote": "Zampanò writes constantly about seeing. What we \nsee, how we see and what in turn we can't see. Over \nand over again, in one form or another, he returns to \nthe subject of light, space, shape, line, color,\nfocus, tone, contrast, movement , rhythm, perspective \nand composition. None of which is surprising \nconsidering Zampanò's piece centers on a documentary \nfilm called The Navidson Record made by a Pulitzer \nPrize-winning photojournalist who must somehow capture \nthe most difficult subject of all: the sight of \ndarkness itself.",
            "note": "",
            "pageNumber": 23,
            "chapter": "Introduction ",
            "createdAt": 1740760696601,
            "style": "underline",
            "color": "#00b036"
        }
    ]
}
```

You can transform it anyway you want (if you know how to code)! Here I am formatting to Markdown using [Templater](https://silentvoid13.github.io/Templater/). Here's the template I'm using:

```gist
uroybd/9a10174687d8983e9e697a47500c1ce6
```

Upon running this, the template will prompt you for the JSON, copy-paste it here. Then It may ask for pdfs if you want to keep the linebreaks. Here's the output:

```
---
title: "House Of Leaves"
aliases: ["Notes from House Of Leaves"]
author: "Mark Z. Danielewski"
created: 2025-03-25T20:08:37+06:00
updated: 2025-03-25T20:14:58+06:00
---
# House Of Leaves
##### Mark Z. Danielewski

## Introduction

### Page: 19 (2.57%) @ 26 Feb 2025 12:51:45 AM

As I discovered, there were reams and reams of it. Endless snarls of words, sonetines twisting into meaning, sometimes into nothing at all, frequently breaking apart, always branching off into other pieces I'd come across later-on old napkins, the tattered edges of an envelope, once even on the back of a postage stamp; everything and anything but empty; each fragment completely covered with the creep of years and years of ink pronouncements; layered, crossed out, amended; handwritten, typed; legible, illegible; impenetrable, lucid; torn, stained, scotch taped; some bits crisp and clean, others faded, burnt or folded and refolded so many times the creases have obliterated whole passages of god knows what-sense? truth? deceit? a legacy of prophecy or lunacy or nothing of the kind?, and in the end achieving, designating, describing, recreating-find your own words; I have no more; or plenty more but why? and all to tellwhat?

> [!stylish] Stylish

### Page: 22 (2.97%) @ 28 Feb 2025 10:35:31 PM

Zampanò, I've come to recognize now, was a very funny man. But his humor was that wry, desiccated kind soldiers whisper, all their jokes subsurface, their laughter amounting to little more than a tic in the corner of the mouth, told as they wait together in their outpost, slowly realizing that help's not going to reach them in time and come nightfall, no matter what they've done or what they try to say, slaughter will overrun them all. Carrion dawn for vultures

> [!stylish] Stylish

### Page: 22 (2.97%) @ 28 Feb 2025 10:37:03 PM

"Irony? Irony can never be more than our own personal Maginot Line; the drawing of it, for the most part, purely arbitrary."

> [!stylish] Stylish

### Page: 23 (3.11%) @ 28 Feb 2025 10:38:16 PM

Zampanò writes constantly about seeing. What we see, how we see and what in turn we can't see. Over and over again, in one form or another, he returns to the subject of light, space, shape, line, color, focus, tone, contrast, movement , rhythm, perspective and composition. None of which is surprising considering Zampanò's piece centers on a documentary film called The Navidson Record made by a Pulitzer Prize-winning photojournalist who must somehow capture the most difficult subject of all: the sight of darkness itself.

> [!question] Thought Provoking
```

This, if rendered, will look this:

---
# House Of Leaves
##### Mark Z. Danielewski

## Introduction

### Page: 19 (2.57%) @ 26 Feb 2025 12:51:45 AM

As I discovered, there were reams and reams of it. Endless snarls of words, sonetines twisting into meaning, sometimes into nothing at all, frequently breaking apart, always branching off into other pieces I'd come across later-on old napkins, the tattered edges of an envelope, once even on the back of a postage stamp; everything and anything but empty; each fragment completely covered with the creep of years and years of ink pronouncements; layered, crossed out, amended; handwritten, typed; legible, illegible; impenetrable, lucid; torn, stained, scotch taped; some bits crisp and clean, others faded, burnt or folded and refolded so many times the creases have obliterated whole passages of god knows what-sense? truth? deceit? a legacy of prophecy or lunacy or nothing of the kind?, and in the end achieving, designating, describing, recreating-find your own words; I have no more; or plenty more but why? and all to tellwhat?

> [!stylish] Stylish

### Page: 22 (2.97%) @ 28 Feb 2025 10:35:31 PM

Zampanò, I've come to recognize now, was a very funny man. But his humor was that wry, desiccated kind soldiers whisper, all their jokes subsurface, their laughter amounting to little more than a tic in the corner of the mouth, told as they wait together in their outpost, slowly realizing that help's not going to reach them in time and come nightfall, no matter what they've done or what they try to say, slaughter will overrun them all. Carrion dawn for vultures

> [!stylish] Stylish

### Page: 22 (2.97%) @ 28 Feb 2025 10:37:03 PM

"Irony? Irony can never be more than our own personal Maginot Line; the drawing of it, for the most part, purely arbitrary."

> [!stylish] Stylish

### Page: 23 (3.11%) @ 28 Feb 2025 10:38:16 PM

Zampanò writes constantly about seeing. What we see, how we see and what in turn we can't see. Over and over again, in one form or another, he returns to the subject of light, space, shape, line, color, focus, tone, contrast, movement , rhythm, perspective and composition. None of which is surprising considering Zampanò's piece centers on a documentary film called The Navidson Record made by a Pulitzer Prize-winning photojournalist who must somehow capture the most difficult subject of all: the sight of darkness itself.

> [!question] Thought Provoking