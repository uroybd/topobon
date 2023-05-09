---
{"title":"CBZ 2.0 - A Better Comic Book Format","aliases":["CBZ 2.0 - A Better Comic Book Format"],"created":"2023-04-25T09:32:42+06:00","updated":"2023-05-09T16:33:17+06:00","tags":["techincal-draft","ebook","comic-book"],"dg-publish":true,"dg-note-icon":1,"dg-path":"Technical Drafts/CBZ 2.0 - A Better Comic Book Archive.md","permalink":"/technical-drafts/cbz-2-0-a-better-comic-book-archive/","dgPassFrontmatter":true,"noteIcon":1}
---

CBZ (and derivatives) have been used as an e-book format for comic books for quite a long time. While they work well on larger screens, using them on smaller handheld devices is very hard.

Many e-book reader apps solve this problem differently. Some use features like **panel zoom** and **bubble zoom**. They work, but not perfectly.

This proposed second iteration of Comic Book Archive is an attempt to solve some, if possibly most, of these problems.

## Structure
In structure, this format is similar to CBZ except for an additional `content.xml` file in the archive root. This allows these files to be **backwards compatible**.

### Content.xml
The `content.xml` file will contain several sections. A rudimentary example here:

```xml
<?xml version="1.0" encoding="utf-8"?>
<package version="2.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf">
    <dc:title>Title of the comic book</dc:title>
    ... Other metadata
  </metadata>
  <content>
    <panels>
      <panel id="panel-1" href="1.png" frame="5 5 30 30" />
      <panel href="1.png" frame="40 40 30 30" />
      ...more panels
      <panel href="5.png" frame="5 5 30 100" />
      ...
    </panels>
    <bubbles>
      <bubble href="1.png" frame="5 5 30 30" parent="#panel-1" />
      <bubble href="1.png" frame="40 40 30 30" />
      ...more bubbles
      <bubble href="5.png" frame="5 5 30 100">
        Optional content in the bubble for screen reader.
      </bubble>
    </bubbles>
  </content>
</package>
```

Let's dissect the `content.xml`

#### Metadata
The metadata section contains all the metadata of the comic book. I'm using IPDF's metadata convention here.

#### Content
##### Panels
This section defines all the panels in order. `href` points to the file from which we'll get the panel. `frame` contains values: x, y, width, and height.

##### Bubbles
Bubbles get defined here almost exactly like panels. Optionally, they can also have the content in them to allow the screen readers to read the comics, and with a `parent` key, a parent panel can be defined.

## Usage
Using the structure defined above, e-book reader applications can develop the following features:

### Panel Navigation
Apps can get panels from images by using the data from `content.xml` and allow users to navigate panel by panel. This allows users to read comics more easily on hand-held devices.

### Bubble Zoom
Using the `bubbles` definitions apps can enable bubble-zoom more efficiently without any image recognition burden.

Additionally, It can be used to provide better accessibility for people with disabilities affecting their reading capabilities.