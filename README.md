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
  extensions: [basicSetup, InkLanguageSupport]
})
```

## Tests

If you find an issue with the grammar (incorrect highlighting boundaries, etc) please include
the snippet of Ink code that causes the issue in your bug report. As you can see in the
tests directory, the test suite allows us to directly compare Ink files with the syntax tree
we expect them to produce.
