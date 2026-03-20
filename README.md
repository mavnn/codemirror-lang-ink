# Ink language support for CodeMirror

- [npm package](https://www.npmjs.com/package/@mavnn/codemirror-lang-ink)
- [CodeMirror](https://codemirror.net/)
- [Ink](https://www.inklestudios.com/ink/)

This package implements Ink language support for the
[CodeMirror](https://codemirror.net/) code editor.

You can try out the editor live in a demo Ink project at [VisualInk](https://visualink.mavnn.eu/script/demo).

This code is released under an
[MIT license](https://github.com/mavnn/codemirror-lang-ink/tree/main/LICENSE).

## Usage

```javascript
import {EditorView, basicSetup} from "codemirror"
import {InkLanguageSupport} from "@mavnn/codemirror-lang-ink"

const view = new EditorView({
  parent: document.body,
  doc: `Once upon a time...`,
  extensions: [basicSetup, InkLanguageSupport()]
})
```

## Highlighting

Ink has a slightly unusual set of highlighting requirements compared to most programming languages, and so 
the default highlighting style doesn't look all that fantastic. You can see the full range of tag styles set
by the language extension at [./src/index.ts](./src/index.ts), or use something like the following to get you
started:

```javascript
import { syntaxHighlighting, HighlightStyle } from "@codemirror/language"
import {EditorView, basicSetup} from "codemirror"
import {InkLanguageSupport} from "@mavnn/codemirror-lang-ink"

const highlightStyle = HighlightStyle.define( [
  { tag: [tags.comment, tags.blockComment], class: "has-text-info" },
  { tag: [tags.operatorKeyword, tags.controlOperator, tags.keyword], class: "has-text-primary" },
  { tag: [tags.labelName], class: "has-text-success" },
  { tag: [tags.operator, tags.list], class: "has-text-info-on-scheme" },
  { tag: [tags.bracket, tags.separator], class: "has-text-warning"},
  { tag: [tags.name], class: "has-text-primary-on-scheme"},
  { tag: [tags.bool, tags.string, tags.number], class: "has-text-danger-on-scheme"},
  { tag: [tags.heading], class: "has-text-primary"}
])

const view = new EditorView({
  parent: document.body,
  doc: `Once upon a time...`,
  extensions: [basicSetup, InkLanguageSupport(), syntaxHighlighting(highlightStyle)]
})
```

The class names above come from the Bulma css library.

## Tests

If you find an issue with the grammar (incorrect highlighting boundaries, etc) please include
the snippet of Ink code that causes the issue in your bug report. As you can see in the
tests directory, the test suite allows us to directly compare Ink files with the syntax tree
we expect them to produce.
